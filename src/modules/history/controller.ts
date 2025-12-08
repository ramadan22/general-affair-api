import { Request, Response } from 'express';
import { approvalHistoryService } from './service';

export const approvalHistoryController = {
  async create(req: Request, res: Response) {
    try {
      const { type, description, assetId, approvalId, performedById } = req.body;
      const data = await approvalHistoryService.createHistory({
        type,
        description,
        assetId,
        approvalId,
        performedById,
      });
      res.status(201).json({ message: 'History created successfully', data });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const data = await approvalHistoryService.getAllHistories();
      res.status(200).json({ data });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await approvalHistoryService.getHistoryById(id);
      if (!data) return res.status(404).json({ message: 'History not found' });
      res.status(200).json({ data });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
