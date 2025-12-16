// middleware/traceId.ts
import { v4 as uuidv4 } from 'uuid';
export const traceIdMiddleware = (req, res, next) => {
    const traceId = uuidv4();
    // Tambahkan ke objek request
    req.traceId = traceId;
    // Tambahkan ke response header untuk tracking antar sistem
    res.setHeader('X-Trace-Id', traceId);
    next();
};
