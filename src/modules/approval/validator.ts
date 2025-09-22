import { z } from 'zod';

export const approvalParamSchema = z.object({
  submissionType: z.enum([
    'PROCUREMENT',
    'MAINTENANCE',
    'WRITE_OFF',
    'ASSIGNMENT',
  ]),
  status: z.enum([
    'DRAFT',
    'WAITING_APPROVAL',
    'APPROVED',
    'REJECTED',
    'READY_ON_PROGRESS',
    'ON_PROGRESS',
    'ORDERED',
    'DONE',
  ]).default('DRAFT'),
  notes: z.string().optional(),
  createdById: z.string().min(1, 'createdById is required'),
  requestedForId: z.string().min(1, 'requestedForId is required'),
});

export type ApprovalParamInput = z.infer<typeof approvalParamSchema>;
