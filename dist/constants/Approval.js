export var SubmissionType;
(function (SubmissionType) {
    SubmissionType["PROCUREMENT"] = "PROCUREMENT";
    SubmissionType["MAINTENANCE"] = "MAINTENANCE";
    SubmissionType["WRITE_OFF"] = "WRITE_OFF";
    SubmissionType["ASSIGNMENT"] = "ASSIGNMENT";
})(SubmissionType || (SubmissionType = {}));
export var RequestStatus;
(function (RequestStatus) {
    RequestStatus["DRAFT"] = "DRAFT";
    RequestStatus["WAITING_APPROVAL"] = "WAITING_APPROVAL";
    RequestStatus["DONE"] = "DONE";
    RequestStatus["REJECT"] = "REJECT";
})(RequestStatus || (RequestStatus = {}));
export const SubmissionTypeLabel = {
    [SubmissionType.PROCUREMENT]: 'Procurement',
    [SubmissionType.MAINTENANCE]: 'Maintenance',
    [SubmissionType.WRITE_OFF]: 'Asset Write-Off',
    [SubmissionType.ASSIGNMENT]: 'Asset Assignment',
};
export const RequestStatusLabel = {
    [RequestStatus.DRAFT]: 'Draft',
    [RequestStatus.WAITING_APPROVAL]: 'Waiting for Approval',
    [RequestStatus.DONE]: 'Completed',
    [RequestStatus.REJECT]: 'Rejected',
};
