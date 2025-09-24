export type SubmissionType = 'PROCUREMENT'; // | 'MAINTENANCE' | 'WRITE_OFF'  | 'ASSIGNMENT';

export type RequestStatus =
  | 'DRAFT'
  | 'WAITING_APPROVAL'
  | 'READY_ON_PROGRESS'
  | 'ON_PROGRESS'
  | 'DONE'
  | 'ORDERED';

export interface AssetParam {
  name: string;
  code: string;
  serialNumber?: string | null;
  image?: string | null;
  categoryId: string;
}

export interface BaseSignatureParam {
  email: string;
  name: string;
  image: string;
  signedAt?: string | null;
}

export type SignatureParam =
  | ({ userId: string } & Partial<BaseSignatureParam>)
  | (Omit<BaseSignatureParam, 'signedAt'> & { signedAt?: string | null });

export interface ApprovalParamInput {
  submissionType: SubmissionType;
  status?: RequestStatus;
  notes?: string;
  createdById: string;
  requestedForId?: string;
  // assets?: AssetParam[];
  // signatures?: SignatureParam[];
}
