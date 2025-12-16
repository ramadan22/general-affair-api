import { AppError } from '@/utils/appError';
import { defaultResponse } from '@/utils/response';
import { uploadSchema } from './validator';
import { uploadService } from './service';
import { flattenZodErrors } from '@/utils/flattenZod';
export async function upload(req, res, next) {
    try {
        const validation = uploadSchema.safeParse({
            type: req.body.type || req.query.type,
            usage: req.body.usage || req.query.usage,
        });
        if (!validation.success) {
            throw new AppError({
                message: validation.error.issues.map((e) => e.message).join(', '),
                status: 400,
                data: flattenZodErrors(validation.error),
            });
        }
        const file = req.file;
        if (!file) {
            throw new AppError({
                message: 'No file uploaded',
                status: 400,
            });
        }
        const input = validation.data;
        const savedFile = await uploadService.saveFileMetadata(file, {
            category: input.usage, // contoh: "user", "others"
            uploaderId: req.user?.id || null, // kalau ada user login
        });
        return defaultResponse({
            response: res,
            success: true,
            status: 200,
            message: 'File uploaded successfully',
            data: savedFile,
        });
    }
    catch (err) {
        next(err);
    }
}
