import {AUTH, GET, POST} from "../../decorators";
import {Request, Response, NextFunction} from "express";
import multer from "multer";
import { promisify } from "util";
import {FoundPersonService} from "../../services/found-person-service";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024, // limit file size to 2MB
    },
});

export class FoundPersonController {

    @GET('/found-person')
    @AUTH()
    async getFoundPeople(req: Request, res: Response, next: NextFunction) {
        try {
            const people = await FoundPersonService.getAllFoundPeople();
            res.send(people);
        }catch(e){
            next(e);
        }
    }

    @POST('/found-person')
    @AUTH()
    async createFoundPerson(req: Request, res: Response, next: NextFunction) {
        const multerHandler = promisify(upload.single("image"));

        await multerHandler(req, res);
        const file = req.file;
        if (!file) { next(new Error('Nenhum arquivo foi carregado')); }

        const { name, description } = req.body;
        await FoundPersonService.createFoundPerson(name, description, req['user'], file);
        res.sendStatus(200);
    }
}
