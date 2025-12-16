import { prisma } from '@/config/database';
import { Role } from '@prisma/client';
export const approvalRepository = {
    create: (data) => {
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
                    },
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
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        });
    },
    createApprovalSignature: (approvalId, data) => {
        return prisma.approvalSignature.create({
            data: { ...data, approvalId },
        });
    },
    createApprovalAssets: (approvalId, data) => {
        return prisma.approvalAsset.create({
            data: { ...data, approvalId },
        });
    },
    update: (id, data) => {
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
                    },
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
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        });
    },
    updateApprovalSignature: (id, data) => {
        return prisma.approvalSignature.update({
            where: { id },
            data: {
                userId: data?.userId ?? null,
                name: data?.name ?? null,
                email: data?.email ?? null,
                isDeleted: data?.isDeleted ?? false,
                updatedAt: new Date(),
            },
        });
    },
    updateApprovalAssets: (id, data) => {
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
                updatedAt: new Date(),
            },
        });
    },
    updateStatus: (id, data) => {
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
                    },
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
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        });
    },
    updatePosition: (id, data) => {
        return prisma.approvalSignature.update({
            data: { ...data, updatedAt: new Date() },
            where: { id, isDeleted: false },
            select: {
                id: true,
                positionX: true,
                positionY: true,
                updatedAt: true
            },
        });
    },
    get: (skip, size, where) => {
        const selectFieldUser = {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
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
                        category: {
                            select: {
                                id: true,
                                name: true,
                                prefix: true,
                                isDevice: true,
                            },
                        },
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
                            },
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
                        positionX: true,
                        positionY: true,
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
    delete: (id) => {
        return prisma.approval.update({
            where: { id },
            data: { updatedAt: new Date(), isDeleted: true },
        });
    },
    count: (where) => {
        return prisma.approval.count({ where: { ...where, isDeleted: false } });
    },
    findById: (id) => {
        return prisma.approval.findUnique({
            where: { id, isDeleted: false },
        });
    },
    findDetailById: (id) => {
        return prisma.approval.findUnique({
            where: { id, isDeleted: false },
            select: {
                id: true,
                submissionType: true,
                status: true,
                notes: true,
                createdAt: true,
                updatedAt: true,
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
                requestedFor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
                assets: {
                    where: { isDeleted: false },
                    select: {
                        id: true,
                        name: true,
                        serialNumber: true,
                        image: true,
                        isMaintenance: true,
                        category: {
                            select: {
                                id: true,
                                name: true,
                                prefix: true,
                            },
                        },
                        asset: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                                serialNumber: true,
                                image: true,
                                isMaintenance: true,
                            },
                        },
                    },
                },
                signatures: {
                    where: { isDeleted: false },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        image: true,
                        positionX: true,
                        positionY: true,
                        signedAt: true,
                        updatedAt: true,
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                image: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });
    },
    signatureFindById: (id) => {
        return prisma.approvalSignature.findMany({
            where: { approvalId: id },
        });
    },
    findApprovers: (search) => {
        const where = {
            role: {
                in: [Role.MANAGER, Role.LEAD, Role.COORDINATOR, Role.GA],
            },
            isDeleted: false,
        };
        if (search && search.trim() !== '') {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        return prisma.user.findMany({
            where,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                image: true,
                isActive: true,
                updatedAt: true,
                createdAt: true,
            },
            orderBy: {
                firstName: 'asc',
            },
        });
    },
    signApproval: (id, data) => {
        return prisma.approvalSignature.update({
            data: { ...data, signedAt: new Date(), updatedAt: new Date() },
            where: { id, isDeleted: false },
        });
    },
    findLatestSignature: async (userId) => {
        return prisma.approvalSignature.findFirst({
            where: {
                userId,
                isDeleted: false,
                image: {
                    not: null,
                },
                approval: {
                    status: 'DONE',
                    isDeleted: false,
                },
            },
            orderBy: {
                signedAt: 'desc',
            },
        });
    }
};
