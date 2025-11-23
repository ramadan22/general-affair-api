export enum SubmissionType {
  PROCUREMENT = 'PROCUREMENT',
  MAINTENANCE = 'MAINTENANCE',
  WRITE_OFF = 'WRITE_OFF',
  ASSIGNMENT = 'ASSIGNMENT',
}

export enum RequestStatus {
  DRAFT = 'DRAFT',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  DONE = 'DONE',
  REJECT = 'REJECT',
}

export const SubmissionTypeLabel: Record<SubmissionType, string> = {
  [SubmissionType.PROCUREMENT]: 'Procurement',
  [SubmissionType.MAINTENANCE]: 'Maintenance',
  [SubmissionType.WRITE_OFF]: 'Asset Write-Off',
  [SubmissionType.ASSIGNMENT]: 'Asset Assignment',
};

export const RequestStatusLabel: Record<RequestStatus, string> = {
  [RequestStatus.DRAFT]: 'Draft',
  [RequestStatus.WAITING_APPROVAL]: 'Waiting for Approval',
  [RequestStatus.DONE]: 'Completed',
  [RequestStatus.REJECT]: 'Rejected',
};
