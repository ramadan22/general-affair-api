import { z } from 'zod';
import { HistoryType } from '@prisma/client';

export const createHistorySchema = z.object({
	type: z.nativeEnum(HistoryType),
	description: z.string().optional(),
	assetId: z.string().uuid().optional(),
	approvalId: z.string().uuid().optional(),
	performedById: z.string().uuid().optional(),
	fromUserId: z.string().uuid().optional(),
	toUserId: z.string().uuid().optional(),
	metadata: z.any().optional(),
});

export type CreateHistoryInput = z.infer<typeof createHistorySchema>;
