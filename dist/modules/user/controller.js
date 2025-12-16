import { userService } from './service';
import { defaultResponse } from '@/utils/response';
import { registerUserSchema, updateUserSchema } from '@/modules/user/validator';
import { AppError } from '@/utils/appError';
import { flattenZodErrors } from '@/utils/flattenZod';
export async function getUsers(req, res, next) {
    try {
        const page = Number(req.query.page) || 1;
        const size = Number(req.query.size) || 10;
        const keyword = req.query.keyword || '';
        const users = await userService.getUsers(page, size, keyword);
        return defaultResponse({
            response: res,
            success: true,
            status: 200,
            message: 'Get users successfully',
            data: users.data,
            meta: users.meta,
        });
    }
    catch (err) {
        next(err);
    }
}
export async function deleteUser(req, res, next) {
    try {
        const id = req.params.id;
        await userService.deleteUser(id);
        return defaultResponse({
            response: res,
            success: true,
            status: 200,
            message: 'Delete user successfully',
            data: null,
        });
    }
    catch (err) {
        next(err);
    }
}
export async function updateUser(req, res, next) {
    try {
        const validation = updateUserSchema.safeParse(req.body);
        if (!validation.success) {
            return next(new AppError({
                message: 'Validation error',
                status: 400,
                data: flattenZodErrors(validation.error),
            }));
        }
        const { id } = req.params;
        const user = await userService.update({ ...req.body, id });
        return defaultResponse({
            response: res,
            success: true,
            status: 200,
            message: 'User updated successfully',
            data: user,
        });
    }
    catch (err) {
        next(err);
    }
}
export async function register(req, res, next) {
    try {
        const validation = registerUserSchema.safeParse(req.body);
        if (!validation.success) {
            return next(new AppError({
                message: 'Validation error',
                status: 400,
                data: flattenZodErrors(validation.error),
            }));
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
    }
    catch (err) {
        next(err);
    }
}
export async function updateProfile(req, res, next) {
    try {
        const validation = updateUserSchema.safeParse(req.body);
        if (!validation.success) {
            return next(new AppError({
                message: 'Validation error',
                status: 400,
                data: flattenZodErrors(validation.error),
            }));
        }
        const { id } = req.user;
        const user = await userService.update({ ...req.body, id });
        return defaultResponse({
            response: res,
            success: true,
            status: 200,
            message: 'Update profile successfully',
            data: user,
        });
    }
    catch (err) {
        next(err);
    }
}
export async function getProfile(req, res, next) {
    try {
        const { id } = req.user;
        const user = await userService.getById(id);
        return defaultResponse({
            response: res,
            success: true,
            status: 200,
            message: 'Get profile successfully',
            data: user,
        });
    }
    catch (err) {
        next(err);
    }
}
