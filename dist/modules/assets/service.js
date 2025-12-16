import { AppError } from '@/utils/appError';
import { assetRepository } from './repository';
import { categoryRepository } from '../category/repository';
function generateCode(prefix) {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0.12);
    const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${randomPart}`;
}
export const assetService = {
    create: async ({ name, serialNumber, isMaintenance, categoryId, image, }) => {
        const category = await categoryRepository.findById(categoryId);
        if (!category) {
            throw new AppError({ message: 'Category not exist', status: 404, data: { name } });
        }
        const assetBySerialNumber = await assetRepository.findBySerialNumber(serialNumber);
        if (assetBySerialNumber) {
            throw new AppError({
                message: 'Asset serial number already exist', status: 404, data: { serialNumber }
            });
        }
        const result = await assetRepository.create({
            name, code: generateCode(category.prefix), serialNumber, isMaintenance, categoryId, image,
        });
        return result;
    },
    get: async (page, size, search, name) => {
        const skip = (page - 1) * size;
        const where = search
            ? {
                OR: [
                    { name: { contains: search } },
                    { code: { contains: search } },
                    { serialNumber: { contains: search } },
                ],
            }
            : {};
        const query = name !== ''
            ? assetRepository.getByName(skip, size, { ...where, isDeleted: false, name })
            : assetRepository.get(skip, size, { ...where, isDeleted: false });
        const [assets, total] = await Promise.all([
            query,
            assetRepository.count(where, name),
        ]);
        return {
            data: assets,
            meta: {
                page,
                size,
                total,
                totalPages: Math.ceil(total / size),
            },
        };
    },
    update: async ({ id, name, serialNumber, isMaintenance, categoryId, image, }) => {
        const category = await categoryRepository.findById(categoryId);
        if (!category) {
            throw new AppError({ message: 'Category not exist', status: 404, data: { name } });
        }
        const assetById = await assetRepository.findById(id);
        const assetBySerialNumber = await assetRepository.findBySerialNumber(serialNumber);
        if (assetBySerialNumber && assetById.serialNumber !== serialNumber) {
            throw new AppError({
                message: 'Asset serial number already exist', status: 404, data: { serialNumber }
            });
        }
        const result = await assetRepository.update(id, {
            name, serialNumber, isMaintenance, categoryId, image,
        });
        return result;
    },
    delete: async (id) => {
        const assetById = await assetRepository.findById(id);
        if (!assetById) {
            throw new AppError({ message: 'Asset not exist', status: 404, data: { categoryId: id } });
        }
        const result = await assetRepository.delete(id);
        return result;
    }
};
