// import { AppError } from '@/utils/appError';
// import { assetRepository } from './repository';
// import { categoryRepository } from '../category/repository';

// function generateCode(prefix: string) {
// 	const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0.12);
// 	const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
// 	return `${prefix}-${timestamp}-${randomPart}`;
// }

export const approvalService = {
	create: async (params) => {

		console.log('here', params);

		// const category = await categoryRepository.findById(categoryId);

		// if (!category) {
		// 	throw new AppError({ message: 'Category not exist', status: 404, data: { name } });
		// }

		// const assetBySerialNumber = await assetRepository.findBySerialNumber(serialNumber);

		// if (assetBySerialNumber) {
		// 	throw new AppError({
		// 		message: 'Asset serial number already exist', status: 404, data: { serialNumber }
		// 	});
		// }

		// const result = await assetRepository.create({
		// 	name, code: generateCode(category.prefix), serialNumber, isMaintenance, categoryId, image,
		// });

		// return result;
	},
	// get: async (page: number, size: number, search: string) => {
	// 	const skip = (page - 1) * size;
		
	// 	const where = search
	// 		? {
	// 			OR: [
	// 				{ name: { contains: search } },
	// 				{ code: { contains: search } },
	// 				{ serialNumber: { contains: search } },
	// 			],
	// 		}
	// 		: {};

	// 	const [assets, total] = await Promise.all([
	// 		assetRepository.get(skip, size, { ...where, isDeleted: false }),
	// 		assetRepository.count(where),
	// 	]);

	// 	return {
	// 		data: assets,
	// 		meta: {
	// 			page,
	// 			size,
	// 			total,
	// 			totalPages: Math.ceil(total / size),
	// 		},
	// 	};
	// },
	// update: async ({
	// 	id,
	// 	name,
	// 	serialNumber,
	// 	isMaintenance,
	// 	categoryId,
	// 	image,
	// }: {
	// 	id: string,
	// 	name: string,
	// 	serialNumber: string,
	// 	isMaintenance: boolean,
	// 	categoryId: string,
	// 	image: string,
	// }) => {
	// 	const category = await categoryRepository.findById(categoryId);

	// 	if (!category) {
	// 		throw new AppError({ message: 'Category not exist', status: 404, data: { name } });
	// 	}

	// 	const assetById = await assetRepository.findById(id);
	// 	const assetBySerialNumber = await assetRepository.findBySerialNumber(serialNumber);

	// 	if (assetBySerialNumber && assetById.serialNumber !== serialNumber) {
	// 		throw new AppError({
	// 			message: 'Asset serial number already exist', status: 404, data: { serialNumber }
	// 		});
	// 	}

	// 	const result = await assetRepository.update(id, {
	// 		name, serialNumber, isMaintenance, categoryId, image,
	// 	});

	// 	return result;
	// },
	// delete: async (id: string) => {
	// 	const assetById = await assetRepository.findById(id);

	// 	if (!assetById) {
	// 		throw new AppError({ message: 'Asset not exist', status: 404, data: { categoryId: id } });
	// 	}

	// 	const result = await assetRepository.delete(id);
	
	// 	return result;
	// }
};
