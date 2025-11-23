import { approvalRepository } from '@/modules/approval/repository';
import { ApprovalPayloads, SignaturePosition } from './types';
import { removeObjectKeys } from '@/utils';
import { AppError } from '@/utils/appError';
import { RequestStatus } from '@/constants/Approval';
import { userService } from '@/modules/user/service';
import { formatDateToWIB } from '@/lib/dateFns';
import { id } from 'date-fns/locale';

export const approvalService = {
  create: async (params: ApprovalPayloads) => {
    const {
      submissionType,
      status,
      notes,
      requestedForId,
      createdById,
      signatures,
      assets,
    } = params;

    const profile = await userService.getById(createdById);

    const approval = await approvalRepository.create({
      submissionType,
      status,
      notes,
      requestedForId,
      createdById,
    });

    let approvalAssets = null;
    let approvalSignatures = null;

    if (profile.role === 'GA') {
      if (assets?.length > 0) {
        approvalAssets = await Promise.all(
          assets.map(async (asset) => {
            const result = await approvalRepository.createApprovalAssets(
              approval.id,
              asset
            );
            return removeObjectKeys(result, ['approvalId']);
          })
        );
      }

      if (approvalSignatures?.length > 0) {
        approvalSignatures = await Promise.all(
          signatures.map(async (signature) => {
            const result = await approvalRepository.createApprovalSignature(
              approval.id,
              signature
            );
            return removeObjectKeys(result, ['approvalId']);
          })
        );
      }
    }

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

    const mappedApprovals = approvals.map((item) => {
      return {
        ...item,
        createdAt: formatDateToWIB(`${item.createdAt}`),
        updatedAt: formatDateToWIB(`${item.updatedAt}`),
      };
    });

    return {
      data: mappedApprovals,
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
        message: 'Approval not exist',
        status: 404,
        data: { approvalId: params.id },
      });
    }

    const {
      submissionType,
      status,
      notes,
      requestedForId,
      createdById,
      signatures,
      assets,
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
  updateStatus: async (params: { status: RequestStatus; id: string }) => {
    const approval = await approvalRepository.findById(params.id);

    if (!approval) {
      throw new AppError({
        message: 'Approval not exist',
        status: 404,
        data: { approvalId: params.id },
      });
    }

    const result = await approvalRepository.updateStatus(params.id, {
      status: params.status,
    });

    return result;
  },
  updatePosition: async (params: {
    signatures: SignaturePosition[];
    id: string;
  }) => {
    const approval = await approvalRepository.findDetailById(params.id);

    if (!approval) {
      throw new AppError({
        message: 'Approval not exist',
        status: 404,
        data: { approvalId: params.id },
      });
    }

    const updateSignaturePromises = approval.signatures.map(sig => {
      const found = params.signatures.find((item) => item.id === sig.id);

      if (!found) return Promise.resolve(null);

      return approvalRepository.updatePosition(sig.id, {
				positionX: found.positionX,
				positionY: found.positionY,
			});
    });

    const result = await Promise.all(updateSignaturePromises);

    return result;
  },
  delete: async (id: string) => {
    const approvalById = await approvalRepository.findById(id);

    if (!approvalById) {
      throw new AppError({
        message: 'Approval not exist',
        status: 404,
        data: { approvalId: id },
      });
    }

    const result = await approvalRepository.delete(id);

    return result;
  },
  getApprovers: async (search?: string) => {
    const users = await approvalRepository.findApprovers(search);

    const mappedUsers = users.map((user) => ({
      id: user.id,
      fullName: `${user.firstName} ${user.lastName || ''}`.trim(),
      email: user.email,
      role: user.role,
    }));

    return mappedUsers;
  },
  getDetail: async (id: string) => {
    const approval = await approvalRepository.findDetailById(id);

    return approval;
  },
};
