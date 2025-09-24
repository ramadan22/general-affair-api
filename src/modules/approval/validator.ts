import { z } from 'zod';

const assetSchema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  code: z.string().min(1, 'Asset code is required'),
  serialNumber: z.string().min(1, 'Serial number is required'),
  image: z.union([
    z.url('Image must be a valid url'),
    z.literal('').transform(() => null)
  ]).nullable().optional(),
  categoryId: z.string().min(1, 'categoryId is required'),
});

export const approvalParamSchema = z.object({
  submissionType: z.enum([
    'PROCUREMENT',
    'MAINTENANCE',
    'WRITE_OFF',
    'ASSIGNMENT',
  ]),
  status: z
    .enum([
      'DRAFT',
      'WAITING_APPROVAL',
      'READY_ON_PROGRESS',
      'ON_PROGRESS',
      'DONE',
      'REJECTED',
    ])
    .default('DRAFT'),
  notes: z.string().optional(),
  // createdById: z.string().min(1, 'createdById is required'),
  requestedForId: z.string().min(1, 'requestedForId is required'),
  // assets: z.array(assetSchema).min(1, 'At least one asset is required'),
});

export type ApprovalParamInput = z.infer<typeof approvalParamSchema>;
export type AssetInput = z.infer<typeof assetSchema>;
