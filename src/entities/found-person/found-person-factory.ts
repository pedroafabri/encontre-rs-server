import {EntityFactory} from "../entity-factory";
import {FoundPerson} from "./found-person";
import {ObjectId, WithId} from "mongodb";
import {UserFactory} from "../user";

export class FoundPersonFactory extends EntityFactory<FoundPerson>{

    private readonly _userFactory: UserFactory;

    constructor() {
        super();
        this._userFactory = new UserFactory();
    }

    toDatabase(fp: FoundPerson): object {
        return {
            _id: new ObjectId(fp.id),
            name: fp.name,
            description: fp.description,
            foundBy: this._userFactory.toDatabase(fp.foundBy),
        }
    }

    toEntity(object: WithId<FoundPerson>): FoundPerson {
        const fp = new FoundPerson();
        fp.id = object._id.toString();
        fp.name = object.name;
        fp.description = object.description;
        fp.foundBy = this._userFactory.toEntity(object.foundBy);
        return fp;
    }
}
