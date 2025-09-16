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
import bcrypt from 'bcrypt';
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
    const user = await authenticationService.findUnique(email);

		const validPassword = await bcrypt.compare(password, user?.password || '')
			|| user?.password === password;

    if (!validPassword) {
			throw new AppError({
				message: 'Email and password are incorrect!',
				status: 401,
				data: { email },
			});
    }

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

    const validation = changePasswordSchema.safeParse(req.body);
    const secondValidation = secondChangePasswordSchema.safeParse(req.body);

    if (!validation.success) {
      throw new AppError({
				message: 'Validation error',
				status: 400,
				data: flattenZodErrors(validation.error),
			});
    }

    const { email } = req.user;
    const user = await authenticationService.findUnique(email);

    if (!user) {
      throw new AppError({
				message: 'User not found',
				status: 404,
			});
    }

    if (user.isActive && !secondValidation.success) {
      throw new AppError({
				message: 'Validation error',
				status: 400,
				data: flattenZodErrors(secondValidation.error),
			});
    }

    if (newPassword !== confirmPassword) {
      throw new AppError({
				message: 'New password and confirm password do not match',
				status: 400,
			});
    }

    // Cek old password
    if (user.isActive) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new AppError({
          message: 'Old password is incorrect',
          status: 400,
        });
      }
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await authenticationService.changePassword({
      id: user?.id,
      hashedPassword,
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
