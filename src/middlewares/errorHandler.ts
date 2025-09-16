import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/appError';
import { defaultResponse } from '@/utils/response';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import logger from '@/utils/logger';

export function errorHandler(
  err: Error | unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const traceId = (req as Request).traceId || 'no-trace-id';
  
  let errName = '';
  if (err instanceof Error) errName = err.name;

  logger.logError(err, traceId, `${req.method} ${req.originalUrl}`);

  res.setHeader('X-Trace-Id', traceId);

  if (err instanceof AppError) {
    return defaultResponse({
      response: res,
      status: err.status,
      message: err.message,
      success: false,
      data: err.data,
      traceId,
    });
  }

  if (err instanceof PrismaClientKnownRequestError || errName === 'PrismaClientKnownRequestError') {
    return defaultResponse({
      response: res,
      status: 400,
      message: 'Database request error',
      success: false,
      traceId,
    });
  }

  if (err instanceof PrismaClientValidationError || errName === 'PrismaClientValidationError') {
    return defaultResponse({
      response: res,
      status: 400,
      message: 'Database validation error',
      success: false,
      traceId,
    });
  }

  // generic Error
  if (err instanceof Error) {
    return defaultResponse({
      response: res,
      status: 500,
      message: err.message || 'Internal Server Error',
      success: false,
      traceId,
    });
  }

  return defaultResponse({
    response: res,
    status: 500,
    message: 'Unknown error',
    success: false,
    traceId,
  });
}
