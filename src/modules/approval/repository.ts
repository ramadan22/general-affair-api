import { prisma } from '@/config/database';
import { Prisma } from '@prisma/client';
import { ApprovalParamInput } from './types';

export const approvalRepository = {
	create: (data: ApprovalParamInput) => {
		return prisma.approval.create({
			data,
			select: {
				id: true,
				submissionType: true,
				status: true,
				notes: true,
				createdBy: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						email: true,
						image: true,
						socialMedia: true,
						role: true,
						isActive: true,
						isManager: true,
						manager: true,
					}
				},
				requestedFor: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						email: true,
						image: true,
						socialMedia: true,
						role: true,
						isActive: true,
						isManager: true,
						manager: true,
					}
				},
				createdAt: true,
				updatedAt: true,
			},
		});
	},
	// update: (id: string, data: Prisma.CategoryCreateInput) => {
	// 	return prisma.category.update({
	// 		data,
	// 		where: { id, isDeleted: false },
	// 		select: {
	// 			id: true,
	// 			name: true,
	// 			prefix: true,
	// 			isDevice: true,
	// 			createdAt: true,
	// 			updatedAt: true,
	// 		},
	// 	});
	// },
	// get: (skip: number, size: number, where: object) => {
	// 	return prisma.category.findMany({
	// 		skip,
	// 		take: size,
	// 		where,
	// 		orderBy: { createdAt: 'desc' },
	// 		select: {
	// 			id: true,
	// 			name: true,
	// 			prefix: true,
	// 			isDevice: true,
	// 			createdAt: true,
	// 			updatedAt: true,
	// 		}
	// 	});
	// },
	// delete: (id: string) => {
	// 	return prisma.category.update({
	// 		where: { id },
	// 		data: { updatedAt: new Date(), isDeleted: true }
	// 	});
	// },
	// count: (where: object) => {
	// 	return prisma.category.count({ where });
	// },
	// findByName: (name: string) => {
	// 	return prisma.category.findFirst({
	// 		where: { name, isDeleted: false },
	// 	});
	// },
	// findById: (id: string) => {
	// 	return prisma.category.findUnique({
	// 		where: { id, isDeleted: false },
	// 	});
	// },
};
