import { Request, Response, NextFunction } from 'express';
import { assetService } from './service';
import { defaultResponse } from '@/utils/response';
import { assetParamSchema } from '@/modules/assets/validator';
import { AppError } from '@/utils/appError';
import { flattenZodErrors } from '@/utils/flattenZod';

export async function create(req: Request, res: Response, next: NextFunction) {
	try {
		const validation = assetParamSchema.safeParse(req.body);

		if (!validation.success) {
			return next(
				new AppError({
					message: 'Validation error',
					status: 400,
					data: flattenZodErrors(validation.error),
				})
			);
		}

		const result = await assetService.create(req.body);

		return defaultResponse({
			response: res,
			success: true,
			status: 201,
			message: 'Asset create successfully',
			data: result,
		});
	} catch (err) {
		next(err);
	}
}

export async function get(req: Request, res: Response, next: NextFunction) {
	try {
		const page = Number(req.query.page) || 1;
		const size = Number(req.query.size) || 10;
		const keyword = (req.query.keyword as string) || '';
		const name = req.params.name || '';

		const result = await assetService.get(page, size, keyword, name);

		return defaultResponse({
			response: res,
			success: true,
			status: 200,
			message: 'Get assets successfully',
			data: result.data,
			meta: result.meta,
		});
	} catch (err) {
		next(err);
	}
}

export async function update(req: Request, res: Response, next: NextFunction) {
	try {
		const validation = assetParamSchema.safeParse(req.body);

		if (!validation.success) {
			return next(
				new AppError({
					message: 'Validation error',
					status: 400,
					data: flattenZodErrors(validation.error),
				})
			);
		}

		const id = req.params.id;
		const result = await assetService.update({ ...req.body, id });

		return defaultResponse({
			response: res,
			success: true,
			status: 200,
			message: 'Update assets successfully',
			data: result,
		});
	} catch (err) {
		next(err);
	}
}

export async function deleteAsset(req: Request, res: Response, next: NextFunction) {
	try {
		const id = req.params.id;
		await assetService.delete(id);

		return defaultResponse({
			response: res,
			success: true,
			status: 200,
			message: 'Delete asset successfully',
			data: null,
		});
	} catch (err) {
		next(err);
	}
}

export async function scanByCode(req: Request, res: Response, next: NextFunction) {
	try {
		const { code } = req.params;
		const data = await assetService.scanByCode(code);

		return defaultResponse({
			response: res,
			success: true,
			status: 200,
			message: 'Asset found successfully',
			data,
		});
	} catch (err) {
		next(err);
	}
}

