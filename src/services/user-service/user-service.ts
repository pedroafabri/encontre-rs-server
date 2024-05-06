import {UserRepository} from "../../repositories";
import {User} from "@entities";
import {EntityAlreadyExists} from "@errors";

export class UserService {

    static async createNewUser(name: string, email: string, firebaseId: string, contacts?: string) {
        const found = await UserRepository.findOne({ $or: [{ email: email},{ firebaseId: firebaseId }] });
        if (found) {
            throw new EntityAlreadyExists('User already exists.');
        }
        await UserRepository.create({name, email, firebaseId, contacts} as User);
    }
}
