export const defaultResponse = ({ response, status, message = '', data = null, meta = null, traceId = '', success, }) => {
    const payload = {
        success,
        status,
        message,
        data,
    };
    if (traceId)
        payload['traceId'] = traceId;
    if (meta !== null)
        payload['meta'] = meta;
    response.status(status).json(payload);
};
