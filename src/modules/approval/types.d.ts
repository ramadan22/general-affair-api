export type SubmissionType = 'PROCUREMENT'; // | 'MAINTENANCE' | 'WRITE_OFF'  | 'ASSIGNMENT';

export type RequestStatus =
  | 'DRAFT'
  | 'WAITING_APPROVAL'
  | 'READY_ON_PROGRESS'
  | 'ON_PROGRESS'
  | 'DONE'
  | 'ORDERED';

export interface AssetParam {
  id?: string;
  assetId: string;
  name?: string;
  isMaintenance?: boolean;
  serialNumber?: string | null;
  image?: string | null;
  categoryId?: string;
  isDeleted?: boolean;
}

export interface SignatureParam {
  id?: string;
  userId: string
  email: string;
  name: string;
  image: string;
  approvalId: string;
  signedAt?: string | null;
  isDeleted?: boolean;
}

export interface ApprovalParamInput {
  submissionType: SubmissionType;
  status?: RequestStatus;
  notes?: string;
  createdById: string;
  requestedForId?: string;
}

export type ApprovalPayloads = ApprovalParamInput & {
  signatures: SignatureParam[]
  assets: AssetParam[]
};
