import { userRepository } from './repository';
import { AppError } from '@/utils/appError';
import bcrypt from 'bcrypt';

function generateNumericPassword(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const userService = {
  register: async (firstName: string, email: string, role: 'GA' | 'STAFF') => {

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
};
