import { z } from 'zod';

export const loginAuthenticationSchema = z.object({
  email: z
    .email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .nonempty('Password is required'),
});

export type LoginInput = z.infer<typeof loginAuthenticationSchema>;

export const changePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, 'New password must be at least 6 characters')
    .nonempty('New password is required'),
  confirmPassword: z
    .string()
    .min(6, 'Confirm password must be at least 6 characters')
    .nonempty('Confirm password is required'),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const secondChangePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(6, 'Old password must be at least 6 characters')
    .nonempty('Old password is required'),
  newPassword: z
    .string()
    .min(6, 'New password must be at least 6 characters')
    .nonempty('New password is required'),
  confirmPassword: z
    .string()
    .min(6, 'Confirm password must be at least 6 characters')
    .nonempty('Confirm password is required'),
});

export type SecondChangePasswordInput = z.infer<typeof secondChangePasswordSchema>;
