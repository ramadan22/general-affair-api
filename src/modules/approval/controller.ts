import { Request, Response, NextFunction } from 'express';
import { approvalService } from './service';
import {
	approvalParamSchema,
	approverQuerySchema,
	updateStatusSchema,
} from '@/modules/approval/validator';
import { AppError } from '@/utils/appError';
import { flattenZodErrors } from '@/utils/flattenZod';
import { defaultResponse } from '@/utils/response';
import { RequestStatus } from '@/constants/Approval';

export async function create(req: Request, res: Response, next: NextFunction) {
	try {
		const validation = approvalParamSchema.safeParse(req.body);

		if (!validation.success) {
			return next(
				new AppError({
					message: 'Validation error',
					status: 400,
					data: flattenZodErrors(validation.error),
				})
			);
		}

		const { id } = req.user;
		const result = await approvalService.create({ ...req.body, createdById: id });

		return defaultResponse({
			response: res,
			success: true,
			status: 201,
			message: 'Approval create successfully',
			data: result,
		});
	} catch (err) {
		next(err);
	}
}

export async function get(req: Request, res: Response, next: NextFunction) {
	try {
		const page = Number(req.query.page) || 1;
		const size = Number(req.query.limit) || 10;
		const keyword = (req.query.keyword as string) || '';

		const result = await approvalService.get(page, size, keyword);

		return defaultResponse({
			response: res,
			success: true,
			status: 200,
			message: 'Get approvals successfully',
			data: result.data,
			meta: result.meta,
		});
	} catch (err) {
		next(err);
	}
}

export async function update(req: Request, res: Response, next: NextFunction) {
	try {
		const validation = approvalParamSchema.safeParse(req.body);

		if (!validation.success) {
			return next(
				new AppError({
					message: 'Validation error',
					status: 400,
					data: flattenZodErrors(validation.error),
				})
			);
		}

		const approvalId = req.params.id;
		const result = await approvalService.update({ ...req.body, id: approvalId });

		return defaultResponse({
			response: res,
			success: true,
			status: 200,
			message: 'Process approval successfully',
			data: result,
		});
	} catch (err) {
		next(err);
	}
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
	try {
		const validation = updateStatusSchema.safeParse(req.body);

		if (!validation.success) {
			return next(
				new AppError({
					message: 'Validation error',
					status: 400,
					data: flattenZodErrors(validation.error),
				})
			);
		}

		const approvalId = req.params.id;
		const result = await approvalService.updateStatus({ ...req.body, id: approvalId });

		return defaultResponse({
			response: res,
			success: true,
			status: 200,
			message: 'Update approval status successfully',
			data: result,
		});
	} catch (err) {
		next(err);
	}
}

export async function updatePosition(req: Request, res: Response, next: NextFunction) {
	try {
		// const validation = updateStatusSchema.safeParse(req.body);

		// if (!validation.success) {
		// 	return next(
		// 		new AppError({
		// 			message: 'Validation error',
		// 			status: 400,
		// 			data: flattenZodErrors(validation.error),
		// 		})
		// 	);
		// }

		const approvalId = req.params.id;
		const result = await approvalService.updatePosition({ ...req.body, id: approvalId });
		await approvalService.updateStatus({ status: RequestStatus.WAITING_APPROVAL, id: approvalId });

		return defaultResponse({
			response: res,
			success: true,
			status: 200,
			message: 'Update signature position successfully',
			data: result,
		});
	} catch (err) {
		next(err);
	}
}

export async function deleteApproval(req: Request, res: Response, next: NextFunction) {
	try {
		const id = req.params.id;
		await approvalService.delete(id);

		return defaultResponse({
			response: res,
			success: true,
			status: 200,
			message: 'Delete approval successfully',
			data: null,
		});
	} catch (err) {
		next(err);
	}
}

export async function getApprovers(req: Request, res: Response, next: NextFunction) {
	try {
		const validation = approverQuerySchema.safeParse(req.query);

		if (!validation.success) {
			return next(
				new AppError({
					message: 'Validation error',
					status: 400,
					data: flattenZodErrors(validation.error),
				})
			);
		}

		const keyword = (req.query.keyword as string) || '';

		const result = await approvalService.getApprovers(keyword);

		return defaultResponse({
			response: res,
			success: true,
			status: 200,
			message: 'Get approvers successfully',
			data: result,
		});
	} catch (err) {
		next(err);
	}
}

export async function getDetail(req: Request, res: Response, next: NextFunction) {
	const result = await approvalService.getDetail(req.params.id);

	return defaultResponse({
		response: res,
		success: true,
		status: 200,
		message: 'Get approval successfully',
		data: result,
	});
}

export async function getReviewedPosition(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await approvalService.getDetail(req.params.id);

    const signatures = result?.signatures ?? [];

    const isReviewed =
      signatures.length > 0 &&
      signatures.every(s => s.positionX !== null && s.positionY !== null);

    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: 'Get signature reviewed successfully',
      data: {
        isReviewed,
      },
    });
  } catch (error) {
    next(error);
  }
}

