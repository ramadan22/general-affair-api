import { AppError } from '@/utils/appError';
import { categoryRepository } from './repository';

export const categoryService = {
	create: async ({
		name, prefix, isDevice
	}: {
		name: string, prefix: string, isDevice: boolean
	}) => {
		const category = await categoryRepository.findByName(name);

		if (category) {
			throw new AppError({ message: 'Category already exist', status: 400, data: { name } });
		}

		const result = await categoryRepository.create({ name, prefix, isDevice });

		return result;
	},
	get: async (page: number, size: number, search: string) => {
		const skip = (page - 1) * size;
		
		const where = search
			? {
				OR: [
					{ firstName: { contains: search } },
					{ lastName: { contains: search } },
					{ email: { contains: search } },
				],
			}
			: {};

		const [categories, total] = await Promise.all([
			categoryRepository.get(skip, size, { ...where, isDeleted: false }),
			categoryRepository.count(where),
		]);

		return {
			data: categories,
			meta: {
				page,
				size,
				total,
				totalPages: Math.ceil(total / size),
			},
		};
	},
	update: async ({
		id, name, prefix, isDevice
	}: {
		id: string, name: string, prefix: string, isDevice: boolean
	}) => {
		const categoryByName = await categoryRepository.findByName(name);

		if (categoryByName) {
			throw new AppError({ message: 'Category already exist', status: 400, data: { name } });
		}

		const categoryById = await categoryRepository.findById(id);

		if (!categoryById) {
			throw new AppError({ message: 'Category not exist', status: 400, data: { categoryId: id } });
		}

		const result = await categoryRepository.update(id, {
			name,
			prefix,
			isDevice,
			updatedAt: new Date(),
		});

		return result;
	},
	delete: async (id: string) => {
		const categoryById = await categoryRepository.findById(id);

		if (!categoryById) {
			throw new AppError({ message: 'Category not exist', status: 400, data: { categoryId: id } });
		}

		const result = await categoryRepository.delete(id);
	
		return result;
	}
};
