/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir))
    fs.mkdirSync(logDir);
const isProduction = process.env.NODE_ENV === 'production';
const projectRoot = process.cwd();
const logFormat = format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.errors({ stack: true }), format.printf(({ timestamp, message, stack, traceId, ...meta }) => {
    const prefix = `[${timestamp}]`;
    const trace = traceId ? ` [Trace ID: ${traceId}]` : '';
    let log = '';
    if (stack) {
        const lines = stack.split('\n').map(line => line.replace(projectRoot, ''));
        const firstLine = lines[0];
        const restLines = lines.slice(1).map(line => `    ${line}`);
        log += `${prefix}${trace} ${firstLine}\n${restLines.join('\n')}`;
    }
    else {
        log += `${prefix}${trace} ${message}`;
    }
    if (Object.keys(meta).length) {
        // Pretty-print the meta object (multi-line JSON)
        const formattedMeta = JSON.stringify(meta, null, isProduction ? 0 : 2);
        log += `\n${formattedMeta}`;
    }
    // Add blank line separator for readability
    log += '\n';
    return log;
}));
const logger = createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new DailyRotateFile({
            filename: path.join(logDir, 'app-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            createSymlink: true,
            symlinkName: 'app.log',
            auditFile: path.join(logDir, '.audit.json'),
            level: 'info',
        }),
    ],
});
if (!isProduction) {
    logger.add(new transports.Console({
        format: logFormat,
        level: 'info',
    }));
}
logger.logError = (err, traceId, context, extra) => {
    if (err instanceof Error) {
        const additional = extra || {};
        for (const key of Object.getOwnPropertyNames(err)) {
            if (!['message', 'stack', 'name'].includes(key)) {
                additional[key] = err[key];
            }
        }
        logger.error({
            name: err.name,
            message: err.message,
            stack: err.stack,
            traceId,
            context,
            ...additional,
        });
    }
    else {
        const safeMessage = typeof err === 'string'
            ? err
            : JSON.stringify(err, null, isProduction ? 0 : 2);
        logger.error({
            message: safeMessage,
            traceId,
            context,
            ...extra,
        });
    }
};
logger.logInfo = (message, traceId, context, extra) => {
    // Pretty print for objects
    const formattedExtra = extra
        ? JSON.parse(JSON.stringify(extra, null, isProduction ? 0 : 2))
        : undefined;
    logger.info({
        message,
        traceId,
        context,
        ...formattedExtra,
    });
};
export default logger;
