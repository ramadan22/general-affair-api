import { z } from 'zod';

export const uploadSchema = z.object({
  type: z.enum(['image', 'file'], {
    message: 'Type must be either \'image\' or \'file\'',
  }),
  usage: z
    .string()
    .min(1, 'Usage is required')
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: 'Usage can only contain letters, numbers, hyphens, and underscores',
    }),
});

export type UploadInput = z.infer<typeof uploadSchema>;
