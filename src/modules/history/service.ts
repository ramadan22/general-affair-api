import { $Enums } from '@prisma/client';
import { approvalHistoryRepository } from './repository';

export const approvalHistoryService = {
  async createHistory(data: {
    type: $Enums.HistoryType;
    description?: string;
    assetId?: string;
    approvalId?: string;
    performedById?: string;
  }) {
    return approvalHistoryRepository.create(data);
  },

  async getAllHistories() {
    return approvalHistoryRepository.findAll();
  },

  async getHistoryById(id: string) {
    return approvalHistoryRepository.findById(id);
  },
};
