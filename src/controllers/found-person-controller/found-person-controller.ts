import {AUTH, POST} from "../../decorators";
import {Request, Response, NextFunction} from "express";

export class FoundPersonController {

    @POST('/found-person')
    @AUTH()
    async createFoundPerson(req: Request, res: Response, next: NextFunction) {
        try {
            //TODO: Call service
        } catch(e) {
            next(e);
        }
    }
}
