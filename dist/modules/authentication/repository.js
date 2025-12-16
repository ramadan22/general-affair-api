import { prisma } from '@/config/database';
export const authenticationRepository = {
    findByEmail: (email) => {
        return prisma.user.findUnique({
            where: { email, isDeleted: false },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true,
                socialMedia: true,
                role: true,
                isActive: true,
                password: true,
                updatedAt: true,
                createdAt: true,
            },
        });
    },
    findById: (id) => {
        return prisma.user.findUnique({
            where: { id, isDeleted: false },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true,
                socialMedia: true,
                role: true,
                isActive: true,
                password: true,
                updatedAt: true,
                createdAt: true,
            },
        });
    },
    update: ({ id, hashedPassword }) => {
        return prisma.user.update({
            where: { id },
            select: { isActive: true },
            data: {
                password: hashedPassword,
                isActive: true,
            },
        });
    }
};
