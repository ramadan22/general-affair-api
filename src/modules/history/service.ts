<<<<<<< HEAD
import { historyRepository } from './repository';
import { HistoryType, Prisma } from '@prisma/client';
import { AppError } from '@/utils/appError';

export const historyService = {
  async create(data: {
    type: HistoryType;
=======
import { $Enums } from '@prisma/client';
import { approvalHistoryRepository } from './repository';

export const approvalHistoryService = {
  async createHistory(data: {
    type: $Enums.HistoryType;
>>>>>>> origin/main
    description?: string;
    assetId?: string;
    approvalId?: string;
    performedById?: string;
    fromUserId?: string;
    toUserId?: string;
    metadata?: object;
  }) {
    return historyRepository.create(data);
  },

  async getAll(
    page: number,
    size: number,
    filters?: {
      type?: HistoryType;
      assetId?: string;
      approvalId?: string;
    }
  ) {
    const skip = (page - 1) * size;

    const where: Prisma.HistoryWhereInput = {};

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.assetId) {
      where.assetId = filters.assetId;
    }

    if (filters?.approvalId) {
      where.approvalId = filters.approvalId;
    }

    const [data, total] = await Promise.all([
      historyRepository.findAll(skip, size, where),
      historyRepository.count(where),
    ]);

    return {
      data,
      meta: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
      },
    };
  },

  async getById(id: string) {
    const history = await historyRepository.findById(id);

    if (!history) {
      throw new AppError({
        message: 'History not found',
        status: 404,
        data: { historyId: id },
      });
    }

    return history;
  },
};
