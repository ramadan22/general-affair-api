import { prisma } from '@/config/database';
export const categoryRepository = {
    create: (data) => {
        return prisma.category.create({
            data,
            select: {
                id: true,
                name: true,
                prefix: true,
                isDevice: true,
                createdAt: true,
            },
        });
    },
    update: (id, data) => {
        return prisma.category.update({
            data,
            where: { id, isDeleted: false },
            select: {
                id: true,
                name: true,
                prefix: true,
                isDevice: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },
    get: (skip, size, where) => {
        return prisma.category.findMany({
            skip,
            take: size,
            where,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                prefix: true,
                isDevice: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    },
    delete: (id) => {
        return prisma.category.update({
            where: { id },
            data: { updatedAt: new Date(), isDeleted: true }
        });
    },
    count: (where) => {
        return prisma.category.count({ where });
    },
    findByName: (name) => {
        return prisma.category.findFirst({
            where: { name, isDeleted: false },
        });
    },
    findById: (id) => {
        return prisma.category.findUnique({
            where: { id, isDeleted: false },
        });
    },
};
