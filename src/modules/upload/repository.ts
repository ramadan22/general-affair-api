import { prisma } from '@/config/database';
import { Prisma } from '@prisma/client';

export const uploadRepository = {
  create: (data: Prisma.UploadCreateInput) => {
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

  findById: (id: string) => {
    return prisma.upload.findUnique({
      where: { id },
    });
  },

  deleteById: (id: string) => {
    return prisma.upload.delete({
      where: { id },
    });
  },
};
