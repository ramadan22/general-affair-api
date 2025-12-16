import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const approvalHistoryRepository = {
    create(data) {
        return prisma.approvalHistory.create({
            data,
            include: {
                asset: true,
                approval: true,
                performedBy: true,
            },
        });
    },
    findAll() {
        return prisma.approvalHistory.findMany({
            include: {
                asset: true,
                approval: true,
                performedBy: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    },
    findById(id) {
        return prisma.approvalHistory.findUnique({
            where: { id },
            include: {
                asset: true,
                approval: true,
                performedBy: true,
            },
        });
    },
};
