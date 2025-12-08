import { PrismaClient, HistoryType } from '@prisma/client';
const prisma = new PrismaClient();

export const approvalHistoryRepository = {
  create(data: {
    type: HistoryType;
    description?: string;
    assetId?: string;
    approvalId?: string;
    performedById?: string;
    fromUserId?: string;
    toUserId?: string;
    metadata?: object;
  }) {
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

  findById(id: string) {
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
