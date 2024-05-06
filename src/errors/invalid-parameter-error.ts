import { ServerError } from './server-error';

export class InvalidParameterError extends ServerError {
    constructor(message?: string) {
        super("InvalidParameterError", 400, message);
    }
}
