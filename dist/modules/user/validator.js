import { Role } from '@/constants/Role';
import { z } from 'zod';
export const registerUserSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    email: z.email({ message: 'Invalid email format' }),
    role: z.enum(Object.values(Role)),
});
export const updateUserSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    image: z.url('Image is required and use valid url'),
    socialMedia: z
        .array(z.object({
        name: z.enum([
            'FACEBOOK', 'INSTAGRAM', 'TWITTER', 'LINKEDIN'
        ]),
        url: z.string().url('Invalid URL'),
    }))
        .optional()
        .default([]),
    role: z.enum(Object.values(Role)),
});
