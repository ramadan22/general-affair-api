import { authenticationRepository } from './repository';
import { AppError } from '@/utils/appError';

function generateNumericPassword(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

export const authenticationService = {
	findUnique: async (email: string) => {
		const result = await authenticationRepository.findByEmail(email);
		return result;
	},
	changePassword: async ({ id, hashedPassword }: { id: string, hashedPassword: string }) => {
		const result = await authenticationRepository.update({ id, hashedPassword });
		return result;
	}
};
