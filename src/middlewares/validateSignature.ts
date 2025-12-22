// src/middlewares/validateSignature.ts
import sharp from 'sharp';
import fs from 'fs';
import { AppError } from '@/utils/appError';

export const validateSignature = async (req, res, next) => {
  try {
    const usage = req.body.usage || req.query.usage;
    if (usage !== 'signatures') return next();

    if (!req.file) {
      return next(new AppError({ message: 'Signature file is required', status: 400 }));
    }

    const filePath = req.file.path;
    const image = sharp(filePath);

    const meta = await image.metadata();

    // Min size agar bukan titik kecil
    if (meta.width! < 150 || meta.height! < 40) {
      fs.unlinkSync(filePath);
      return next(new AppError({ message: 'Signature image is too small.', status: 400 }));
    }

    // Convert ke RGBA + RAW untuk baca pixel
    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const totalPixels = info.width * info.height;
    const transparentCount = [];
    const whiteCount = [];
    const inkCount = [];

    // Loop per pixel → [R,G,B,A]
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Transparent background pixel
      if (a === 0) transparentCount.push(1);

      // White background pixel (toleransi noise)
      if (r > 240 && g > 240 && b > 240) whiteCount.push(1);

      // Dark ink stroke (signature)
      if (r < 80 && g < 80 && b < 80 && a > 80) inkCount.push(1);
    }

    // ----- VALIDASI BACKGROUND -----

    const isTransparentBG = transparentCount.length > totalPixels * 0.4; // 40% transparent
    const isWhiteBG = whiteCount.length > totalPixels * 0.4; // 40% white

    if (!isTransparentBG && !isWhiteBG) {
      fs.unlinkSync(filePath);
      return next(
        new AppError({
          message: 'Signature must have a white or transparent background.',
          status: 400,
        })
      );
    }

    // ----- VALIDASI TINTA SIGNATURE -----

    if (inkCount.length < totalPixels * 0.003) {
      fs.unlinkSync(filePath);
      return next(
        new AppError({
          message: 'Signature must contain visible strokes.',
          status: 400,
        })
      );
    }

    // Lolos validasi
    next();
  } catch (err) {
    next(err);
  }
};
