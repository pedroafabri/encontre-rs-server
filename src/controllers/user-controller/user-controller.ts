import {Request, Response, NextFunction} from "express";
import {POST, BodyValidator} from '@decorators'
import {AuthenticateUserBodyValidator, CreateUserBodyValidator} from "./validators";
import {UserService} from "../../services";

export class UserController {

    @POST('/user')
    @BodyValidator(CreateUserBodyValidator)
     async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, email, firebaseId, contacts} = req.body;
            await UserService.createNewUser(name, email, firebaseId, contacts);
            res.sendStatus(200);
        } catch(e) {
            next(e);
        }
    }

    @POST('/user/authenticate')
    @BodyValidator(AuthenticateUserBodyValidator)
    async authenticateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {idToken} = req.body;
            const token = await UserService.authenticate(idToken)
            res.send({token});
        } catch(e) {
            next(e);
        }
    }
}
