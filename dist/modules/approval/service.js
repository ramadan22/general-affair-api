import { approvalRepository } from '@/modules/approval/repository';
import { removeObjectKeys } from '@/utils';
import { AppError } from '@/utils/appError';
import { RequestStatus } from '@/constants/Approval';
import { userService } from '@/modules/user/service';
import { formatDateToWIB } from '@/lib/dateFns';
import { Role } from '@/constants/Role';
const buildApprovalWhere = (userId, role, search) => {
    const searchFilter = search
        ? {
            OR: [
                { submissionType: { contains: search.toUpperCase() } },
                { status: { contains: search.toUpperCase() } },
                { notes: { contains: search } },
            ],
        }
        : {};
    // 👉 Role GA = full access
    if (role === Role.GA) {
        return {
            ...searchFilter,
            isDeleted: false,
        };
    }
    // 👉 Role selain GA = hanya data yang berhubungan dengan user
    return {
        ...searchFilter,
        AND: [
            { isDeleted: false },
            {
                OR: [
                    { createdById: userId },
                    { requestedForId: userId },
                    { signatures: { some: { userId } } },
                ],
            },
        ],
    };
};
export const approvalService = {
    create: async (params) => {
        const { submissionType, status, notes, requestedForId, createdById, signatures, assets, } = params;
        const profile = await userService.getById(createdById);
        const approval = await approvalRepository.create({
            submissionType,
            status,
            notes,
            requestedForId: requestedForId || null,
            createdById,
        });
        let approvalAssets = null;
        let approvalSignatures = null;
        if (profile.role === 'GA') {
            if (assets?.length > 0) {
                approvalAssets = await Promise.all(assets.map(async (asset) => {
                    const result = await approvalRepository.createApprovalAssets(approval.id, asset);
                    return removeObjectKeys(result, ['approvalId']);
                }));
            }
            if (approvalSignatures?.length > 0) {
                approvalSignatures = await Promise.all(signatures.map(async (signature) => {
                    const result = await approvalRepository.createApprovalSignature(approval.id, signature);
                    return removeObjectKeys(result, ['approvalId']);
                }));
            }
        }
        return {
            ...approval,
            sigantures: approvalSignatures,
            assets: approvalAssets,
        };
    },
    get: async ({ page, size, search, userId, role, }) => {
        const skip = (page - 1) * size;
        const where = buildApprovalWhere(userId, role, search);
        const [approvals, total] = await Promise.all([
            approvalRepository.get(skip, size, { ...where, isDeleted: false }),
            approvalRepository.count(where),
        ]);
        const mappedApprovals = approvals.map(item => {
            const signatures = item.signatures.map(signature => ({
                ...signature,
                signedAt: signature.signedAt !== null ? formatDateToWIB(`${signature.signedAt}`) : null
            }));
            return {
                ...item,
                createdAt: formatDateToWIB(`${item.createdAt}`),
                updatedAt: formatDateToWIB(`${item.updatedAt}`),
                signatures,
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
    update: async (params) => {
        const approval = await approvalRepository.findById(params.id);
        if (!approval) {
            throw new AppError({
                message: 'Approval not exist',
                status: 404,
                data: { approvalId: params.id },
            });
        }
        const { submissionType, status, notes, requestedForId, createdById, signatures, assets, } = params;
        const result = await approvalRepository.update(params.id, {
            submissionType,
            status,
            notes,
            requestedForId,
            createdById,
        });
        const approvalSignatures = await Promise.all(signatures.map(async (signature) => {
            if (signature.id) {
                const result = await approvalRepository.updateApprovalSignature(signature.id, signature);
                return removeObjectKeys(result, ['approvalId', 'isDeleted']);
            }
            else {
                const result = await approvalRepository.createApprovalSignature(approval.id, signature);
                return removeObjectKeys(result, ['approvalId', 'isDeleted']);
            }
        }));
        const approvalAssets = await Promise.all(assets.map(async (asset) => {
            if (asset.id) {
                const result = await approvalRepository.updateApprovalAssets(asset.id, asset);
                return removeObjectKeys(result, ['approvalId', 'isDeleted']);
            }
            else {
                const result = await approvalRepository.createApprovalAssets(approval.id, asset);
                return removeObjectKeys(result, ['approvalId', 'isDeleted']);
            }
        }));
        return {
            ...result,
            sigantures: approvalSignatures,
            assets: approvalAssets,
        };
    },
    updateStatus: async (params) => {
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
    updatePosition: async (params) => {
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
            if (!found)
                return Promise.resolve(null);
            return approvalRepository.updatePosition(sig.id, {
                positionX: found.positionX,
                positionY: found.positionY,
            });
        });
        const result = await Promise.all(updateSignaturePromises);
        return result;
    },
    delete: async (id) => {
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
    getApprovers: async (search) => {
        const users = await approvalRepository.findApprovers(search);
        const mappedUsers = users.map((user) => ({
            id: user.id,
            fullName: `${user.firstName} ${user.lastName || ''}`.trim(),
            email: user.email,
            role: user.role,
        }));
        return mappedUsers;
    },
    getDetail: async (id) => {
        const approval = await approvalRepository.findDetailById(id);
        return approval;
    },
    signApproval: async (params) => {
        const result = await approvalRepository.signApproval(params.id, {
            image: params.image,
        });
        return result;
    },
    checkAndUpdate: async (params) => {
        const approvalDetail = await approvalRepository.findDetailById(params.id);
        const unSign = approvalDetail.signatures.find(item => !item.image || !item.signedAt);
        if (!unSign) {
            await approvalRepository.updateStatus(params.id, {
                status: RequestStatus.DONE,
            });
        }
    },
    getPreviousSignature: async (params) => {
        const signature = await approvalRepository.findLatestSignature(params.userId);
        return signature;
    }
};
