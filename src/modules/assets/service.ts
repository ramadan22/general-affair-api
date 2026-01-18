import { AppError } from '@/utils/appError';
import { assetRepository } from './repository';
import { categoryRepository } from '../category/repository';

function generateCode(prefix: string) {
	const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0.12);
	const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
	return `${prefix}-${timestamp}-${randomPart}`;
}

export const assetService = {
	create: async ({
		name, serialNumber, isMaintenance, categoryId, image,
	}: {
		name: string, serialNumber: string, isMaintenance: boolean, categoryId: string, image: string
	}) => {
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
	get: async (page: number, size: number, search: string, name?: string) => {
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
			assetRepository.count({ ...where, isDeleted: false }, name),
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
	update: async ({
		id,
		name,
		serialNumber,
		isMaintenance,
		categoryId,
		image,
	}: {
		id: string,
		name: string,
		serialNumber: string,
		isMaintenance: boolean,
		categoryId: string,
		image: string,
	}) => {
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
	delete: async (id: string) => {
		const assetById = await assetRepository.findById(id);

		if (!assetById) {
			throw new AppError({ message: 'Asset not exist', status: 404, data: { categoryId: id } });
		}

		const result = await assetRepository.delete(id);

		return result;
	},
	scanByCode: async (code: string) => {
		const { prisma } = await import('@/config/database');

		// 1. Find asset with category details
		const asset = await assetRepository.findByCodeWithDetails(code);

		if (!asset) {
			throw new AppError({
				message: 'Asset not found',
				status: 404,
				data: { code },
			});
		}

		// 2. Get current assignment (latest ASSIGNMENT history)
		const latestAssignment = await prisma.history.findFirst({
			where: {
				assetId: asset.id,
				type: 'ASSIGNMENT',
			},
			orderBy: { createdAt: 'desc' },
			include: {
				approval: {
					select: {
						id: true,
						submissionType: true,
						status: true,
						requestedFor: {
							select: {
								id: true,
								firstName: true,
								lastName: true,
								email: true,
								role: true,
							},
						},
					},
				},
				performedBy: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						email: true,
						role: true,
					},
				},
			},
		});

		// 3. Get full history
		const histories = await prisma.history.findMany({
			where: { assetId: asset.id },
			orderBy: { createdAt: 'desc' },
			include: {
				approval: {
					select: {
						id: true,
						submissionType: true,
						status: true,
						notes: true,
					},
				},
				performedBy: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						email: true,
						role: true,
					},
				},
			},
		});

		// 4. Build response
		return {
			...asset,
			currentAssignment: latestAssignment
				? {
					user: latestAssignment.approval?.requestedFor || null,
					assignedAt: latestAssignment.createdAt,
					approvalId: latestAssignment.approvalId,
				}
				: null,
			history: histories,
		};
	},
};
