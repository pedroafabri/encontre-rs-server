import { ServerError } from './server-error';

export class InvalidFileTypeError extends ServerError {
    constructor(message?: string) {
        super("InvalidFileTypeError", 400, message);
    }
}
