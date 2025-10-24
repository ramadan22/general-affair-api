// types/express.d.ts
import 'express-serve-static-core';
import { Role } from '@/constants/Role';

declare module 'express-serve-static-core' {
  interface Request {
    traceId?: string;
    user?: {
      id: string;
      email: string;
      role: Role
    }
  }

  interface Response {
    // properti untuk menyimpan meta log
    logMeta?: Record<string, unknown>;

    // helper untuk menambahkan meta log
    addLogMeta?(meta: Record<string, unknown>): void;
  }
}
