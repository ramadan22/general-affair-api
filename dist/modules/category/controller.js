import { categoryService } from './service';
import { defaultResponse } from '@/utils/response';
import { categoryParamSchema } from '@/modules/category/validator';
import { AppError } from '@/utils/appError';
import { flattenZodErrors } from '@/utils/flattenZod';
export async function create(req, res, next) {
    try {
        const validation = categoryParamSchema.safeParse(req.body);
        if (!validation.success) {
            return next(new AppError({
                message: 'Validation error',
                status: 400,
                data: flattenZodErrors(validation.error),
            }));
        }
        const category = await categoryService.create(req.body);
        return defaultResponse({
            response: res,
            success: true,
            status: 201,
            message: 'Category create successfully',
            data: category,
        });
    }
    catch (err) {
        next(err);
    }
}
export async function get(req, res, next) {
    try {
        const page = Number(req.query.page) || 1;
        const size = Number(req.query.size) || 10;
        const keyword = req.query.keyword || '';
        const result = await categoryService.get(page, size, keyword);
        return defaultResponse({
            response: res,
            success: true,
            status: 200,
            message: 'Get categories successfully',
            data: result.data,
            meta: result.meta,
        });
    }
    catch (err) {
        next(err);
    }
}
export async function update(req, res, next) {
    try {
        const validation = categoryParamSchema.safeParse(req.body);
        if (!validation.success) {
            return next(new AppError({
                message: 'Validation error',
                status: 400,
                data: flattenZodErrors(validation.error),
            }));
        }
        const id = req.params.id;
        const result = await categoryService.update({ ...req.body, id });
        return defaultResponse({
            response: res,
            success: true,
            status: 200,
            message: 'Update category successfully',
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
}
export async function deleteCategory(req, res, next) {
    try {
        const id = req.params.id;
        await categoryService.delete(id);
        return defaultResponse({
            response: res,
            success: true,
            status: 200,
            message: 'Delete category successfully',
            data: null,
        });
    }
    catch (err) {
        next(err);
    }
}
