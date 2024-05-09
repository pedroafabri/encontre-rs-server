import { ServerError } from './server-error';

export class EntityNotFoundError extends ServerError {
    constructor(message?: string) {
        super("EntityNotFoundError", 404, message);
    }
}
