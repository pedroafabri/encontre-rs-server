import { ServerError } from './server-error';

export class WrongBodyError extends ServerError {
  constructor(message?: string) {
    super("WrongBodyError", 400, message);
  }
}
