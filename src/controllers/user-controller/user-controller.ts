import {Request, Response, NextFunction} from "express";
import {POST, BodyValidator, PATCH, AUTH, DELETE} from '@decorators'
import {AuthenticateUserBodyValidator, CreateUserBodyValidator, UpdateUserBodyValidator} from "./validators";
import {UserService} from "../../services";

export class UserController {

    @POST('/user')
    @BodyValidator(CreateUserBodyValidator)
     async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, email, idToken, contacts} = req.body;
            await UserService.createNewUser(name, email, idToken, contacts);
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

    @PATCH('/user')
    @AUTH()
    @BodyValidator(UpdateUserBodyValidator)
    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, contacts} = req.body;
            await UserService.updateUser(req['user'], name, contacts);
            res.sendStatus(200);
        } catch(e) {
            next(e);
        }
    }

    @DELETE('/user')
    @AUTH()
    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            await UserService.deleteUser(req['user']);
            res.sendStatus(200);
        } catch(e) {
            next(e);
        }
    }
}
