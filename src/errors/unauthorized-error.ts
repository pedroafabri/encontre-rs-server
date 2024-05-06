import { ServerError } from './server-error';

export class UnauthorizedError extends ServerError {
  constructor(message?: string) {
    super("UnauthorizedError", 401, message);
  }
}