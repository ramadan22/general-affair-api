import { prisma } from '@/config/database';

export const userRepository = {
  create: (data: { firstName: string; email: string; password: string; role: 'GA' | 'STAFF' }) => {
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

  findByEmail: (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },
};
