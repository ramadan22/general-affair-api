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

export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters')
      .nonempty('New password is required'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters')
      .nonempty('Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirm password do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const secondChangePasswordSchema = z
  .object({
    isActive: z.boolean(),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.isActive || (data.oldPassword !== undefined && data.oldPassword !== ''),
    {
      message: 'Old password is required',
      path: ['oldPassword'],
    }
  )
  .refine(
    (data) => !data.isActive || (data.newPassword !== undefined && data.newPassword !== ''),
    {
      message: 'New password is required',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => !data.isActive || (data.confirmPassword !== undefined && data.confirmPassword !== ''),
    {
      message: 'Confirm password is required',
      path: ['confirmPassword'],
    }
  )
  .refine(
    (data) => !data.isActive || (!!data.oldPassword && data.oldPassword.length >= 6),
    {
      message: 'Old password must be at least 6 characters',
      path: ['oldPassword'],
    }
  )
  .refine(
    (data) => !data.isActive || (!!data.newPassword && data.newPassword.length >= 6),
    {
      message: 'New password must be at least 6 characters',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => !data.isActive || (!!data.confirmPassword && data.confirmPassword.length >= 6),
    {
      message: 'Confirm password must be at least 6 characters',
      path: ['confirmPassword'],
    }
  )
  .refine(
    (data) => !data.isActive
    || (!!data.newPassword && !!data.confirmPassword && data.newPassword === data.confirmPassword),
    {
      message: 'New password and confirm password do not match',
      path: ['confirmPassword'],
    }
  );

export type SecondChangePasswordInput = z.infer<typeof secondChangePasswordSchema>;
