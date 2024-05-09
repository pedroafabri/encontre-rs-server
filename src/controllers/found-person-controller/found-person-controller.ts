import {AUTH, GET, PATCH, POST} from "@decorators";
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
    async getFoundPeople(req: Request, res: Response, next: NextFunction) {
        try {
            const { search, page, limit } = req.query;
            const people = await FoundPersonService.getAllFoundPeople({
                search: search?.toString() ?? '',
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 20,
            });
            res.send(people);
        }catch(e){
            next(e);
        }
    }

    @GET('/found-person/:id')
    async getFoundPerson(req: Request, res: Response, next: NextFunction) {
        try {
            const found = await FoundPersonService.getFoundPerson(req.params.id);
            res.send(found);
        }catch(e) {
            next(e);
        }
    }

    @POST('/found-person')
    @AUTH()
    async createFoundPerson(req: Request, res: Response, next: NextFunction) {
        try {
            const multerHandler = promisify(upload.single("image"));

            await multerHandler(req, res);
            const file = req.file;
            if (!file) { next(new Error('Nenhum arquivo foi carregado')); }

            const { name, description } = req.body;
            await FoundPersonService.createFoundPerson(name, description, req['user'], file);
            res.sendStatus(200);
        } catch (e) {
            next(e);
        }
    }

    @PATCH('/found-person/:id')
    @AUTH()
    async updateFoundPerson(req: Request, res: Response, next: NextFunction) {
        try {
            const multerHandler = promisify(upload.single("image"));
            await multerHandler(req, res);

            const {id} = req.params;
            const { name, description } = req.body;
            const foundPerson = await FoundPersonService.updateFoundPerson(id, name, description, req.file);
            res.send(foundPerson);
        } catch(e) {
            next(e);
        }
    }
}
