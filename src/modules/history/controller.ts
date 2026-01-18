import { Request, Response, NextFunction } from 'express';
import { historyService } from './service';
import { createHistorySchema } from './validator';
import { AppError } from '@/utils/appError';
import { flattenZodErrors } from '@/utils/flattenZod';
import { defaultResponse } from '@/utils/response';
import { HistoryType } from '@prisma/client';

export const historyController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = createHistorySchema.safeParse(req.body);

      if (!validation.success) {
        return next(
          new AppError({
            message: 'Validation error',
            status: 400,
            data: flattenZodErrors(validation.error),
          })
        );
      }

      const data = await historyService.create(validation.data);

      return defaultResponse({
        response: res,
        success: true,
        status: 201,
        message: 'History created successfully',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const size = Number(req.query.size) || 10;
      const type = req.query.type as HistoryType | undefined;
      const assetId = req.query.assetId as string | undefined;
      const approvalId = req.query.approvalId as string | undefined;

      const result = await historyService.getAll(page, size, {
        type,
        assetId,
        approvalId,
      });

      return defaultResponse({
        response: res,
        success: true,
        status: 200,
        message: 'Get histories successfully',
        data: result.data,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await historyService.getById(id);

      return defaultResponse({
        response: res,
        success: true,
        status: 200,
        message: 'Get history successfully',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
