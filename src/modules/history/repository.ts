import { prisma } from '@/config/database';
import { HistoryType, Prisma } from '@prisma/client';

export const historyRepository = {
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
    return prisma.history.create({
      data,
      include: {
        asset: {
          select: {
            id: true,
            name: true,
            code: true,
            serialNumber: true,
            image: true,
          },
        },
        approval: {
          select: {
            id: true,
            submissionType: true,
            status: true,
            notes: true,
          },
        },
        performedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  },

  findAll(skip: number, take: number, where: Prisma.HistoryWhereInput) {
    return prisma.history.findMany({
      skip,
      take,
      where,
      include: {
        asset: {
          select: {
            id: true,
            name: true,
            code: true,
            serialNumber: true,
            image: true,
          },
        },
        approval: {
          select: {
            id: true,
            submissionType: true,
            status: true,
            notes: true,
          },
        },
        performedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  count(where: Prisma.HistoryWhereInput) {
    return prisma.history.count({ where });
  },

  findById(id: string) {
    return prisma.history.findUnique({
      where: { id },
      include: {
        asset: {
          select: {
            id: true,
            name: true,
            code: true,
            serialNumber: true,
            image: true,
          },
        },
        approval: {
          select: {
            id: true,
            submissionType: true,
            status: true,
            notes: true,
          },
        },
        performedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  },
};
