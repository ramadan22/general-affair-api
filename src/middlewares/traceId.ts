// middleware/traceId.ts
import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from 'express';

export const traceIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const traceId = uuidv4();

  // Tambahkan ke objek request
  req.traceId = traceId;

  // Tambahkan ke response header untuk tracking antar sistem
  res.setHeader('X-Trace-Id', traceId);

  next();
};
