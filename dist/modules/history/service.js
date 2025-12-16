import { approvalHistoryRepository } from './repository';
export const approvalHistoryService = {
    async createHistory(data) {
        return approvalHistoryRepository.create(data);
    },
    async getAllHistories() {
        return approvalHistoryRepository.findAll();
    },
    async getHistoryById(id) {
        return approvalHistoryRepository.findById(id);
    },
};
