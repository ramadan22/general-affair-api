import { prisma } from '@/config/database';

export const authenticationRepository = {
	findByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email, isDeleted: false },
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
        password: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  },
  update: ({ id, hashedPassword }: { id: string, hashedPassword: string }) => {
    return prisma.user.update({
      where: { id },
      select: { isActive: true },
      data: {
        password: hashedPassword,
        isActive: true,
      },
    });
  }
};
