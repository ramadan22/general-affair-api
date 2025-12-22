import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/appError';
import { Role } from '@/constants/Role';

export const checkGARole = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = (req as any).user;

	if (!user || user.role !== Role.GA) {
		return next(new AppError({
			message: 'Access denied. GA role required.',
			status: 403
		}));
	}

	next();
};

export const checkRole = (allowedRoles: Role[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = (req as any).user;

		if (!user || !allowedRoles.includes(user.role)) {
			return next(new AppError({
				message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
				status: 403
			}));
		}

		next();
	};
};
