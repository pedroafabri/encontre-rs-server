import {EntityFactory} from "../entity-factory";
import {ObjectId, WithId} from "mongodb";
import {UserFactory} from "../user";
import {FoundAnimal} from "./found-animal";

export class FoundAnimalFactory extends EntityFactory<FoundAnimal>{

    private readonly _userFactory: UserFactory;

    constructor() {
        super();
        this._userFactory = new UserFactory();
    }

    toDatabase(fa: FoundAnimal): object {
        return {
            _id: new ObjectId(fa.id),
            name: fa.name?.length ? fa.name : "NÃO POSSUI",
            description: fa.description,
            foundBy: this._userFactory.toDatabase(fa.foundBy),
            animalType: fa.animalType,
        }
    }

    toEntity(object: WithId<FoundAnimal>): FoundAnimal {
        return new FoundAnimal({
            id: object._id.toString(),
            name: object.name,
            description: object.description,
            foundBy: this._userFactory.toEntity({_id: new ObjectId(object._id), ...object.foundBy}),
            animalType: object.animalType,
        });
    }



}
