import { prisma } from '@/config/database';
import { ApprovalParamInput, AssetParam, RequestStatus, SignatureParam } from './types';

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
					}
				},
				createdAt: true,
				updatedAt: true,
			},
		});
	},
	createApprovalSignature: (approvalId: string, data: SignatureParam) => {
		return prisma.approvalSignature.create({
			data: { ...data, approvalId },
		});
	},
	createApprovalAssets: (approvalId: string, data: AssetParam) => {
		return prisma.approvalAsset.create({
			data: { ...data, approvalId },
		});
	},
	update: (id: string, data: ApprovalParamInput) => {
		return prisma.approval.update({
			data: { ...data, updatedAt: new Date() },
			where: { id, isDeleted: false },
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
					}
				},
				createdAt: true,
				updatedAt: true,
			},
		});
	},
	updateApprovalSignature: (id: string, data: SignatureParam) => {
		return prisma.approvalSignature.update({
			where: { id },
			data: {
				userId: data?.userId ?? null,
				name: data?.name ?? null,
				email: data?.email ?? null,
				isDeleted: data?.isDeleted ?? false,
				updatedAt: new Date()
			},
		});
	},
	updateApprovalAssets: (id: string, data: AssetParam) => {
		return prisma.approvalAsset.update({
			where: { id },
			data: {
				assetId: data?.assetId ?? null,
				name: data?.name ?? null,
				isMaintenance: data?.isMaintenance ?? null,
				serialNumber: data?.serialNumber ?? null,
				image: data?.image ?? null,
				categoryId: data?.categoryId ?? null,
				isDeleted: data?.isDeleted ?? false,
				updatedAt: new Date()
			},
		});
	},
	updateStatus: (id: string, data: { status: RequestStatus }) => {
		return prisma.approval.update({
			data: { ...data, updatedAt: new Date() },
			where: { id, isDeleted: false },
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
					}
				},
				createdAt: true,
				updatedAt: true,
			},
		});
	},
	get: (skip: number, size: number, where: object) => {
		const selectFieldUser = {
			id: true,
			firstName: true,
			lastName: true,
			email: true,
			image: true,
			socialMedia: true,
			role: true,
			isActive: true,
		};

		return prisma.approval.findMany({
			skip,
			take: size,
			where,
			orderBy: { createdAt: 'desc' },
			select: {
				id: true,
				submissionType: true,
				status: true,
				notes: true,
				createdBy: { select: selectFieldUser },
				requestedFor: { select: selectFieldUser },
				assets: {
					where: { isDeleted: false },
					select: {
						id: true,
						name: true,
						image: true,
						isMaintenance: true,
						serialNumber: true,
						categoryId: true,
						asset: {
							select: {
								id: true,
								name: true,
								code: true,
								isMaintenance: true,
								serialNumber: true,
								image: true,
								category: {
									select: {
										id: true,
										name: true,
										prefix: true,
										isDevice: true,
									},
								},
							}
						},
						updatedAt: true,
					},
				},
				signatures: {
					where: { isDeleted: false },
					select: {
						id: true,
						email: true,
						name: true,
						image: true,
						signedAt: true,
						user: { select: selectFieldUser },
						updatedAt: true,
					},
				},
				createdAt: true,
				updatedAt: true,
			},
		});
	},
	delete: (id: string) => {
		return prisma.approval.update({
			where: { id },
			data: { updatedAt: new Date(), isDeleted: true }
		});
	},
	count: (where: object) => {
		return prisma.approval.count({ where: { ...where, isDeleted: false } });
	},
	// findByName: (name: string) => {
	// 	return prisma.category.findFirst({
	// 		where: { name, isDeleted: false },
	// 	});
	// },
	findById: (id: string) => {
		return prisma.approval.findUnique({
			where: { id, isDeleted: false },
		});
	},
	signatureFindById: (id: string) => {
		return prisma.approvalSignature.findMany({
			where: { approvalId: id },
		});
	},
};
