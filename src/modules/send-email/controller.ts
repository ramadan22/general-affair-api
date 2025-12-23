import { Request, Response, NextFunction } from 'express';
import { defaultResponse } from '@/utils/response';
import { mailService } from './service';

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
	try {
		const result = await mailService.sendResetPassword(req.body);

		return defaultResponse({
			response: res,
			success: true,
			status: 200,
			message: 'Email sent successfully',
			data: result,
		});
	} catch (err) {
		next(err);
	}
}
