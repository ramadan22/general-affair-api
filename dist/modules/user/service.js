import { removeObjectKeys } from '@/utils';
import { userRepository } from './repository';
import { AppError } from '@/utils/appError';
import bcrypt from 'bcrypt';
function generateNumericPassword() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
export const userService = {
    getUsers: async (page, size, search) => {
        const skip = (page - 1) * size;
        const where = search
            ? {
                OR: [
                    { firstName: { contains: search } },
                    { lastName: { contains: search } },
                    { email: { contains: search } },
                ],
            }
            : {};
        const [users, total] = await Promise.all([
            userRepository.get(skip, size, { ...where, isDeleted: false }),
            userRepository.count(where),
        ]);
        return {
            data: users,
            meta: {
                page,
                size,
                total,
                totalPages: Math.ceil(total / size),
            },
        };
    },
    deleteUser: async (id) => {
        const user = await userRepository.delete(id);
        return user;
    },
    register: async (firstName, email, role) => {
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new AppError({ message: 'Email already registered', status: 400, data: { email } });
        }
        const plainPassword = generateNumericPassword();
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const user = await userRepository.create({
            firstName,
            email,
            password: hashedPassword,
            role,
        });
        return { ...user, plainPassword };
    },
    update: async (params) => {
        const userById = await userRepository.findById(params.id);
        if (!userById) {
            throw new AppError({ message: 'User not exist', status: 400, data: { userId: params.id } });
        }
        const user = await userRepository.update(params.id, removeObjectKeys({
            ...params,
            updatedAt: new Date(),
        }, ['id']));
        return user;
    },
    getById: async (id) => {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new AppError({
                message: 'User profile not found!',
                status: 404,
                data: null,
            });
        }
        return user;
    },
};
