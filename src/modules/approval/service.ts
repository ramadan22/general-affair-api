import { approvalRepository } from '@/modules/approval/repository';
import { ApprovalPayloads, RequestStatus } from './types';
import { removeObjectKeys } from '@/utils';
import { AppError } from '@/utils/appError';

export const approvalService = {
	create: async (params: ApprovalPayloads) => {
		const {
			submissionType,
			status,
			notes,
			requestedForId,
			createdById,
			signatures,
			assets
		} = params;

		const approval = await approvalRepository.create({
			submissionType,
			status,
			notes,
			requestedForId,
			createdById,
		});

		const approvalSignatures = await Promise.all(
			signatures.map(async (signature) => {
				const result = await approvalRepository.createApprovalSignature(
					approval.id,
					signature,
				);
				return removeObjectKeys(result, ['approvalId']);
			})
		);

		const approvalAssets = await Promise.all(
			assets.map(async (asset) => {
				const result = await approvalRepository.createApprovalAssets(
					approval.id,
					asset,
				);
				return removeObjectKeys(result, ['approvalId']);
			})
		);

		return {
			...approval,
			sigantures: approvalSignatures,
			assets: approvalAssets,
		};
	},
	get: async (page: number, size: number, search: string) => {
		const skip = (page - 1) * size;
		
		const where = search
			? {
				OR: [
					{ submissionType: { contains: search.toUpperCase() } },
					{ status: { contains: search.toUpperCase() } },
					{ notes: { contains: search } },
				],
			}
			: {};

		const [approvals, total] = await Promise.all([
			approvalRepository.get(skip, size, { ...where, isDeleted: false }),
			approvalRepository.count(where),
		]);

		return {
			data: approvals,
			meta: {
				page,
				size,
				total,
				totalPages: Math.ceil(total / size),
			},
		};
	},
	update: async (params: ApprovalPayloads & { id: string }) => {
		const approval = await approvalRepository.findById(params.id);

		if (!approval) {
			throw new AppError({
				message: 'Approval not exist', status: 404, data: { approvalId: params.id }
			});
		}

		const {
			submissionType,
			status,
			notes,
			requestedForId,
			createdById,
			signatures,
			assets
		} = params;

		const result = await approvalRepository.update(params.id, {
			submissionType,
			status,
			notes,
			requestedForId,
			createdById,
		});

		const approvalSignatures = await Promise.all(
			signatures.map(async (signature) => {
				if (signature.id) {
					const result = await approvalRepository.updateApprovalSignature(
						signature.id,
						signature
					);

					return removeObjectKeys(result, ['approvalId', 'isDeleted']);
				} else {
					const result = await approvalRepository.createApprovalSignature(
						approval.id,
						signature
					);

					return removeObjectKeys(result, ['approvalId', 'isDeleted']);
				}
			})
		);

		const approvalAssets = await Promise.all(
			assets.map(async (asset) => {
				if (asset.id) {
					const result = await approvalRepository.updateApprovalAssets(
						asset.id,
						asset
					);

					return removeObjectKeys(result, ['approvalId', 'isDeleted']);
				} else {
					const result = await approvalRepository.createApprovalAssets(
						approval.id,
						asset
					);

					return removeObjectKeys(result, ['approvalId', 'isDeleted']);
				}
			})
		);

		return {
			...result,
			sigantures: approvalSignatures,
			assets: approvalAssets,
		};
	},
	updateStatus: async (params: { status: RequestStatus, id: string }) => {
		const approval = await approvalRepository.findById(params.id);

		if (!approval) {
			throw new AppError({
				message: 'Approval not exist', status: 404, data: { approvalId: params.id }
			});
		}

		const result = await approvalRepository.updateStatus(params.id, {
			status: params.status
		});

		return result;
	},
	delete: async (id: string) => {
		const approvalById = await approvalRepository.findById(id);

		if (!approvalById) {
			throw new AppError({
				message: 'Approval not exist', status: 404, data: { approvalId: id }
			});
		}

		const result = await approvalRepository.delete(id);
	
		return result;
	}
};
