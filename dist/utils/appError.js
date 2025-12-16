/**
 * Custom application error class
 * Digunakan untuk melempar error dengan HTTP status code yang konsisten
 */
export class AppError extends Error {
    status;
    isOperational;
    data;
    constructor({ message, status = 500, isOperational = true, data, }) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.isOperational = isOperational;
        this.data = data;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace?.(this, this.constructor);
    }
}
