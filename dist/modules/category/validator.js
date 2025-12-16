import { z } from 'zod';
export const categoryParamSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    prefix: z.string().min(1, 'Prefix is required'),
    isDevice: z.boolean().optional().refine(val => val !== undefined, {
        message: 'isDevice is required',
    }),
});
