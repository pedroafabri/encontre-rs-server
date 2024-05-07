import {UserRepository} from "../../repositories";
import {User} from "@entities";
import {EntityAlreadyExists, UnauthorizedError} from "@errors";
import {Firebase} from "@utils";
import {JWT} from "@utils";

export class UserService {

    static async createNewUser(name: string, email: string, idToken: string, contacts?: string) {
        const decoded = await Firebase.instance.validateIDToken(idToken).catch((err) => {throw new UnauthorizedError(err.message)});

        const found = await UserRepository.findOne({ $or: [{ email: email},{ firebaseId: decoded.uid }] });
        if (found) {
            throw new EntityAlreadyExists('User already exists.');
        }
        await UserRepository.create({name, email, firebaseId: decoded.uid, contacts} as User);
    }

    static async authenticate(idToken: string): Promise<string> {
        const decoded = await Firebase.instance.validateIDToken(idToken).catch((err) => {throw new UnauthorizedError(err.message)});

        const firebaseUser = await Firebase.instance.getUser(decoded.uid).catch((err) => {throw new UnauthorizedError(err.message)});
        if(!firebaseUser) { throw new UnauthorizedError('User not found at Firebase.'); }

        const user = await UserRepository.findOne({ firebaseId: decoded.uid });
        if(!user) { throw new UnauthorizedError('User does not exist on database.'); }

        return JWT.Sign({id: user.id});
    }
}
