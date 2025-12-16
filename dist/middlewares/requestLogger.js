/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '@/utils/logger';
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const traceId = req.traceId || 'no-trace-id';
        const context = `${req.method} ${req.originalUrl}`;
        const status = res.statusCode;
        // Kumpulkan meta tambahan kalau ada
        const meta = res.logMeta || {};
        const logMessage = `${status} - ${duration}ms`;
        if (status >= 500) {
            logger.logError(new Error(logMessage), traceId, context, meta);
        }
        else if (status >= 400) {
            logger.logInfo(logMessage, traceId, context, { ...meta, level: 'warn' });
        }
        else {
            logger.logInfo(logMessage, traceId, context, { logs: meta });
        }
    });
    // Tambahan helper untuk controller / service
    res.addLogMeta = (extra) => {
        if (!res.logMeta)
            res.logMeta = [];
        res.logMeta.push(extra);
    };
    next();
};
