import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { AppError } from '@/utils/appError';

const MAX_SIZE_MB = 5;

const storage = multer.diskStorage({
  destination: (req: Request, _, cb) => {
    const type = (req.body.type || req.query.type) as string;
    const usage = (req.body.usage || req.query.usage) as string;

    if (!type || !usage) {
      return cb(
        new AppError({
          message: 'Missing required params: type and usage',
          status: 400,
        }),
        undefined as unknown as string
      );
    }

    const allowedTypes: Record<string, string> = {
      image: 'images',
      file: 'files',
    };

    const baseFolder = allowedTypes[type];
    if (!baseFolder) {
      return cb(
        new AppError({
          message: 'Invalid type. Allowed: image, file',
          status: 400,
        }),
        undefined as unknown as string
      );
    }

    const folder = path.join('uploads', baseFolder, usage);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadDynamic = multer({
  storage,
  limits: {
    fileSize: MAX_SIZE_MB * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const type = (req.body.type || req.query.type) as string;

    if (type === 'image' && !file.mimetype.startsWith('image/')) {
      return cb(
        new AppError({
          message: 'Only image files are allowed',
          status: 400,
        })
      );
    }

    if (type === 'file' && file.mimetype.startsWith('image/')) {
      return cb(
        new AppError({
          message: 'Images are not allowed for type=file',
          status: 400,
        })
      );
    }

    if (!['image', 'file'].includes(type)) {
      return cb(
        new AppError({
          message: 'Invalid type parameter',
          status: 400,
        })
      );
    }

    cb(null, true);
  },
});
