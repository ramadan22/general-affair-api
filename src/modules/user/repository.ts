import { prisma } from '@/config/database';
import { Role } from '@/constants/Role';

const baseUrl = process.env.FILE_PATH;

export const userRepository = {
  get: (skip: number, size: number, where: object) => {
    return prisma.user.findMany({
      skip,
      take: size,
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: {
          select: {
            id: true,
            storageKey: true,
          },
        },
        socialMedia: true,
        role: true,
        isActive: true,
        updatedAt: true,
        createdAt: true,
      }
    });
  },
  delete: (id: string) => {
    return prisma.user.update({
      where: { id },
      data: { updatedAt: new Date(), isDeleted: true }
    });
  },
  count: (where: object) => {
    return prisma.user.count({ where });
  },
  create: (data: { firstName: string; email: string; password: string; role: Role }) => {
    return prisma.user.create({
      data,
      select: {
        id: true,
        firstName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },
  update: async (id, data) => {
    const user = await prisma.user.update({
      data,
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: {
          select: {
            id: true,
            storageKey: true,
          },
        },
        socialMedia: true,
        isActive: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return {
      ...user,
      image: user.image
        ? `${baseUrl}/${user.image.storageKey}`
        : null,
      imageId: user.image
        ? user.image.id
        : null,
    };
  },
  findByEmail: (email: string) => {
    return prisma.user.findUnique({ where: { email, isDeleted: false } });
  },
  findById: async (id: string) => {
    const user = await prisma.user.findUnique({
      where: { id, isDeleted: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        socialMedia: true,
        role: true,
        teamLead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        image: {
          select: {
            id: true,
            storageKey: true,
          },
        },
        updatedAt: true,
        createdAt: true,
      },
    });

    return {
      ...user,
      image: user.image
        ? `${baseUrl}/${user.image.storageKey}`
        : null,
      imageId: user.image
        ? user.image.id
        : null,
    };
  },
};
