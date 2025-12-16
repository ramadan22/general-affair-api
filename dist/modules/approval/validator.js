import { RequestStatus, SubmissionType } from '@/constants/Approval';
import { z } from 'zod';
export const approvalParamSchema = z.object({
    submissionType: z.enum(Object.values(SubmissionType)),
    status: z.enum(Object.values(RequestStatus)).default('DRAFT'),
    notes: z.string().optional(),
});
export const updateStatusSchema = z.object({
    status: z.enum(Object.values(RequestStatus)),
});
export const approverQuerySchema = z.object({
    keyword: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 2, { message: 'Keyword must be at least 2 characters when provided' }),
});
