/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getBearerToken } from '@/utils';
import { AppError } from '@/utils/appError';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: 'GA' | 'STAFF' };
}

export const checkUserToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = getBearerToken(req as any);
    if (!token) {
			throw new AppError({
				message: 'Unauthorized: No token provided',
				status: 401,
			});
		}

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
			throw new AppError({
				message: 'Invalid or expired token',
				status: 440,
			});
    }

    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
		
    next();
  } catch (err) {
   	next(err);
  }
};
