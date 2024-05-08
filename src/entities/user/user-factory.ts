import {EntityFactory} from "../entity-factory";
import {User} from "./user";
import {ObjectId, WithId} from "mongodb";

export class UserFactory extends EntityFactory<User>{
    toDatabase(user: User): object {
        return {
            _id: new ObjectId(user._id),
            name: user.name,
            email: user.email,
            contacts: user.contacts,
            firebaseId: user.firebaseId,
        }
    }

    toEntity(object: WithId<User>): User {
        const user = new User();
        user._id = object._id.toString();
        user.name = object.name;
        user.email = object.email;
        user.contacts = object.contacts;
        user.firebaseId = object.firebaseId;
        return user;
    }
}
