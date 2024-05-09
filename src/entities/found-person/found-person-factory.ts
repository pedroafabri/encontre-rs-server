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
            name: fp.name.length ? fp.name : "DESCONHECIDO",
            description: fp.description,
            foundBy: this._userFactory.toDatabase(fp.foundBy),
        }
    }

    toEntity(object: WithId<FoundPerson>): FoundPerson {
        return new FoundPerson({
            id: object._id.toString(),
            name: object.name,
            description: object.description,
            foundBy: this._userFactory.toEntity({_id: new ObjectId(object._id), ...object.foundBy}),
        });
    }

}
