/**
 * Custom application error class
 * Digunakan untuk melempar error dengan HTTP status code yang konsisten
 */
export class AppError extends Error {
  public readonly status: number;
  public readonly isOperational: boolean;
  public readonly data?: unknown;

  constructor({
    message,
    status = 500,
    isOperational = true,
    data,
  }: {
    message: string;
    status?: number;
    isOperational?: boolean;
    data?: unknown;
  }) {
    super(message);

    this.name = this.constructor.name;
    this.status = status;
    this.isOperational = isOperational;
    this.data = data;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace?.(this, this.constructor);
  }
}
