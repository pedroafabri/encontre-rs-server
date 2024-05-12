import {AUTH, DELETE, GET, PATCH, POST} from "@decorators";
import {Request, Response, NextFunction} from "express";
import multer from "multer";
import { promisify } from "util";
import {FoundAnimalService} from "../../services/found-animal-service";
import {fileFilter} from "@utils";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: Number(process.env.IMAGE_MAX_SIZE_IN_MB) * 1024 * 1024, // limit file size to 2MB
    },
    fileFilter
});

export class FoundAnimalController {

    @GET('/found-animal')
    async getFoundPeople(req: Request, res: Response, next: NextFunction) {
        try {
            const { search, page, limit } = req.query;
            const people = await FoundAnimalService.getAllFoundAnimals({
                search: search?.toString() ?? '',
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 20,
            });
            res.send(people);
        }catch(e){
            next(e);
        }
    }

    @GET('/found-animal/:id')
    async getFoundPerson(req: Request, res: Response, next: NextFunction) {
        try {
            const found = await FoundAnimalService.getFoundAnimal(req.params.id);
            res.send(found);
        }catch(e) {
            next(e);
        }
    }

    @POST('/found-animal')
    @AUTH()
    async createFoundPerson(req: Request, res: Response, next: NextFunction) {
        try {
            const multerHandler = promisify(upload.single("image"));

            await multerHandler(req, res);
            const file = req.file;
            if (!file) { next(new Error('Nenhum arquivo foi carregado')); }

            const { name, description, animalType } = req.body;
            await FoundAnimalService.createFoundAnimal(name, description, req['user'], file, animalType);
            res.sendStatus(200);
        } catch (e) {
            next(e);
        }
    }

    @PATCH('/found-animal/:id')
    @AUTH()
    async updateFoundPerson(req: Request, res: Response, next: NextFunction) {
        try {
            const multerHandler = promisify(upload.single("image"));
            await multerHandler(req, res);

            const {id} = req.params;
            const { name, description, animalType } = req.body;
            const foundPerson = await FoundAnimalService.updateFoundAnimal(id, name, description, animalType, req.file, req['user']);
            res.send(foundPerson);
        } catch(e) {
            next(e);
        }
    }

    @DELETE('/found-animal/:id')
    @AUTH()
    async deleteFoundPerson(req: Request, res: Response, next: NextFunction) {
        try{
            const {id} = req.params;
            await FoundAnimalService.deleteFoundAnimal(id, req['user']);
            res.sendStatus(200);
        } catch(e) {
            next(e);
        }
    }
}
