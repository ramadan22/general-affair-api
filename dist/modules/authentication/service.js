import { authenticationRepository } from './repository';
import { AppError } from '@/utils/appError';
import bcrypt from 'bcrypt';
export const authenticationService = {
    findUserByEmail: async (email) => {
        const user = await authenticationRepository.findByEmail(email);
        if (!user) {
            throw new AppError({
                message: 'User not found',
                status: 404,
            });
        }
        return user;
    },
    findUserById: async (id) => {
        const user = await authenticationRepository.findById(id);
        if (!user) {
            throw new AppError({
                message: 'User not found',
                status: 404,
            });
        }
        return user;
    },
    findUser: async ({ email, password }) => {
        const user = await authenticationRepository.findByEmail(email);
        const validPassword = await bcrypt.compare(password, user?.password || '');
        if (!user || !validPassword) {
            throw new AppError({
                message: 'Email and password are incorrect!',
                status: 401,
                data: { email },
            });
        }
        return user;
    },
    updateNewPassword: async ({ id, oldPassword, newPassword, userPassword, isActive }) => {
        if (isActive) {
            const isMatch = await bcrypt.compare(oldPassword, userPassword);
            if (!isMatch) {
                throw new AppError({
                    message: 'Old password is incorrect',
                    status: 400,
                });
            }
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await authenticationRepository.update({ id, hashedPassword });
        return result;
    }
};
