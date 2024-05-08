import {AUTH, POST} from "../../decorators";
import {Request, Response, NextFunction} from "express";
import multer from "multer";
import { promisify } from "util";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024, // limit file size to 2MB
    },
});

export class FoundPersonController {

    @POST('/found-person')
    @AUTH()
    async createFoundPerson(request: Request, response: Response, next: NextFunction) {
        const multerHandler = promisify(upload.single("image"));

        await multerHandler(request, response);
        const fileDetails = request.file;
        if (fileDetails) {
            console.log('Arquivo carregado:', fileDetails.originalname);
        } else {
            next(new Error('Nenhum arquivo foi carregado'));
        }

        response.status(200).send('Upload bem-sucedido');
    }
}
