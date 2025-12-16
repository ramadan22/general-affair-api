import { uploadRepository } from './repository';
import { AppError } from '@/utils/appError';
import path from 'path';
export const uploadService = {
    saveFileMetadata: async (file, options) => {
        if (!file) {
            throw new AppError({ message: 'No file provided', status: 400 });
        }
        const extension = path.extname(file.originalname);
        const url = `${process.env.BASE_URL}/uploads/${file.destination.replace('uploads/', '')}/${file.filename}`;
        const storageKey = `${file.destination}/${file.filename}`;
        const upload = await uploadRepository.create({
            filename: file.filename,
            mimeType: file.mimetype,
            extension,
            size: file.size,
            url,
            storageKey,
            category: options.category,
            uploaderId: options.uploaderId,
        });
        return upload;
    },
    getFile: async (id) => {
        const file = await uploadRepository.findById(id);
        if (!file) {
            throw new AppError({ message: 'File not found', status: 404 });
        }
        return file;
    },
    deleteFile: async (id) => {
        const file = await uploadRepository.findById(id);
        if (!file) {
            throw new AppError({ message: 'File not found', status: 404 });
        }
        await uploadRepository.deleteById(id);
        return { message: 'File deleted successfully', id };
    },
};
