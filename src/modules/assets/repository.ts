import { prisma } from '@/config/database';
import { Prisma } from '@prisma/client';

export const assetRepository = {
	create: (data: {
    name: string;
    code: string;
    serialNumber?: string;
    isMaintenance?: boolean;
    image?: string | null;
    categoryId: string;
  }) => {
		return prisma.asset.create({
			data,
			select: {
				id: true,
				name: true,
				code: true,
				isMaintenance: true,
				serialNumber: true,
				image: true,
				createdAt: true,
				updatedAt: true,
				category: {
					select: {
						id: true,
						name: true,
						prefix: true,
						isDevice: true,
					},
				},
			}
		});
	},
	update: (
		id: string,
		data: {
			name: string;
			serialNumber?: string;
			isMaintenance?: boolean;
			image?: string | null;
			categoryId: string;
		}
	) => {
		return prisma.asset.update({
			data: { ...data, updatedAt: new Date() },
			where: { id, isDeleted: false },
			select: {
				id: true,
				name: true,
				code: true,
				isMaintenance: true,
				serialNumber: true,
				image: true,
				createdAt: true,
				updatedAt: true,
				category: {
					select: {
						id: true,
						name: true,
						prefix: true,
						isDevice: true,
					},
				},
			}
		});
	},
	get: (skip: number, size: number, where: object) => {
		return prisma.asset.findMany({
			skip,
			take: size,
			where,
			orderBy: { createdAt: 'desc' },
			select: {
				id: true,
				name: true,
				code: true,
				isMaintenance: true,
				serialNumber: true,
				image: true,
				createdAt: true,
				updatedAt: true,
				category: {
					select: {
						id: true,
						name: true,
						prefix: true,
						isDevice: true,
					},
				},
			}
		});
	},
	delete: (id: string) => {
		return prisma.asset.update({
			where: { id },
			data: { updatedAt: new Date(), isDeleted: true }
		});
	},
	count: (where: object) => {
		return prisma.asset.count({ where });
	},
	// findByName: (name: string) => {
	// 	return prisma.category.findFirst({
	// 		where: { name, isDeleted: false },
	// 	});
	// },
	findById: (id: string) => {
		return prisma.asset.findUnique({
			where: { id, isDeleted: false },
		});
	},
	findBySerialNumber: (serialNumber: string) => {
		return prisma.asset.findFirst({
			where: { serialNumber, isDeleted: false },
		});
	},
};
