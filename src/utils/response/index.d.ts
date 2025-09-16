/* eslint-disable @typescript-eslint/no-explicit-any */

import { Response } from 'express';

export type PaginationSorterTypes = {
  page: number;
  size: number;
  total?: number;
  totalPage?: number;
};

export type ListTypes<T = any> = T extends undefined ? never : T;

export type DefaultResponseParams<T = any> = {
	response: Response;
  success: boolean;
  status: number;
  message: string;
  traceId?: string;
  data?: ListTypes<T>;
  meta?: PaginationSorterTypes | null;
};
