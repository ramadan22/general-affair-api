import { Request, Response, NextFunction } from 'express';
import { userService } from './service';
import { defaultResponse } from '@/utils/response';
import { registerUserSchema } from '@/modules/user/validator';
import { AppError } from '@/utils/appError';
import { flattenZodErrors } from '@/utils/flattenZod';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
      const validation = registerUserSchema.safeParse(req.body);

      if (!validation.success) {
        return next(
          new AppError({
            message: 'Validation error',
            status: 400,
            data: flattenZodErrors(validation.error),
          })
        );
      }

      const { firstName, email, role } = req.body;
      const user = await userService.register(firstName, email, role);

      return defaultResponse({
        response: res,
        success: true,
        status: 201,
        message: 'User registered successfully',
        data: user,
      });
    } catch (err) {
      next(err);
    }
}
