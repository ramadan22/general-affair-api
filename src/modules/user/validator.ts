import { z } from 'zod';

export const registerUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  email: z.email({ message: 'Invalid email format' }),
  role: z.enum(['GA', 'STAFF']),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
