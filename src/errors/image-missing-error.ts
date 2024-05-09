import { ServerError } from './server-error';

export class ImageMissingError extends ServerError {
    constructor(message?: string) {
        super("ImageMissingError", 400, message);
    }
}
