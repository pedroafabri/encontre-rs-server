import { ServerError } from './server-error';

export class EntityAlreadyExists extends ServerError {
    constructor(message?: string) {
        super("EntityAlreadyExists", 400, message);
    }
}
