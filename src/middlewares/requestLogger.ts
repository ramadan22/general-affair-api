/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const traceId = req.traceId || 'no-trace-id';
    const context = `${req.method} ${req.originalUrl}`;
    const status = res.statusCode;

    // Kumpulkan meta tambahan kalau ada
    const meta: Record<string, unknown> = (res as any).logMeta || {};

    const logMessage = `${status} - ${duration}ms`;

    if (status >= 500) {
      logger.logError(new Error(logMessage), traceId, context, meta);
    } else if (status >= 400) {
      logger.logInfo(logMessage, traceId, context, { ...meta, level: 'warn' });
    } else {
      logger.logInfo(logMessage, traceId, context, { logs: meta });
    }
  });

  // Tambahan helper untuk controller / service
  (res as any).addLogMeta = (extra: Record<string, unknown>) => {
    if (!(res as any).logMeta) (res as any).logMeta = [];
    (res as any).logMeta.push(extra);
  };

  next();
};
