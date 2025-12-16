import { prisma } from '@/config/database';
export const uploadRepository = {
    create: (data) => {
        return prisma.upload.create({
            data,
            select: {
                id: true,
                filename: true,
                mimeType: true,
                extension: true,
                size: true,
                url: true,
                storageKey: true,
                category: true,
                uploaderId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },
    findById: (id) => {
        return prisma.upload.findUnique({
            where: { id },
        });
    },
    deleteById: (id) => {
        return prisma.upload.delete({
            where: { id },
        });
    },
};
