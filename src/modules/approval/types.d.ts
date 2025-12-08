import { RequestStatus, SubmissionType } from '@/constants/Approval';

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

export interface SignaturePosition {
  id?: string;
  positionX: number;
  positionY: number;
}

export interface SignatureParam extends SignaturePosition {
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
