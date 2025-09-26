import { Request, Response, NextFunction } from 'express';
import { authenticationService } from './service';
import { defaultResponse } from '@/utils/response';
import {
  changePasswordSchema,
  loginAuthenticationSchema,
  secondChangePasswordSchema,
} from '@/modules/authentication/validator';
import { AppError } from '@/utils/appError';
import { flattenZodErrors } from '@/utils/flattenZod';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH || '';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const validation = loginAuthenticationSchema.safeParse(req.body);

    if (!validation.success) {
      throw new AppError({
				message: 'Validation error',
				status: 400,
				data: flattenZodErrors(validation.error),
			});
    }

    const { email, password } = req.body;
    const user = await authenticationService.findUser({ email, password });

		const data = {
      id: user?.id,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      image: user?.image,
      role: user?.role,
      socialMedia: user?.socialMedia,
      isActive: user?.isActive,
    };

		// generate jwt
    const token = jwt.sign(
      data,
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refresh = jwt.sign(
      data,
      JWT_SECRET_REFRESH,
      { expiresIn: '1d' }
    );

		res.addLogMeta({
			step: 'login success',
			email: user?.email,
			user: user?.firstName,
			role: user?.role
		});

    return defaultResponse({
    	response: res,
    	success: true,
    	status: 200,
    	message: 'Login successfully',
    	data: { accessToken: token, refreshToken: refresh },
    });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const validation = changePasswordSchema.safeParse({ newPassword, confirmPassword });

    const { email } = req.user;
    const user = await authenticationService.findUserByEmail(email);
    const isActive = user?.isActive;

    const secondValidation = secondChangePasswordSchema.safeParse({
      oldPassword,
      newPassword,
      confirmPassword,
      isActive,
    });

    if (!validation.success || !secondValidation.success) {
      throw new AppError({
				message: 'Validation error',
				status: 400,
				data: flattenZodErrors(validation.error || secondValidation.error),
			});
    }

    const result = await authenticationService.updateNewPassword({
      id: user?.id,
      userPassword: user?.password,
      oldPassword,
      newPassword,
      isActive,
    });

    return defaultResponse({
    	response: res,
    	success: true,
    	status: 200,
    	message: 'Password changed successfully',
    	data: result,
    });
  } catch (err) {
    next(err);
  }
}
