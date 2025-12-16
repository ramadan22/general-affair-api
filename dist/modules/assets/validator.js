import { z } from 'zod';
export const assetParamSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    serialNumber: z.string().optional(),
    image: z.url('Image is required and use valid url').optional(),
    isMaintenance: z.boolean().default(false),
    categoryId: z.string().min(1, 'Name is required'),
});
