import {User} from "../user";
import {ObjectId} from "mongodb";

type CONSTRUCTOR_PARAMS = {
    id?: string,
    name?: string,
    description?: string,
    foundBy?: User,
    animalType?: string
}

export class FoundAnimal {
    public id: string;
    public name: string;
    public description: string;
    public foundBy: User;
    public imageLink: string;
    public animalType: string;

    constructor({id, name, description, foundBy, animalType} : CONSTRUCTOR_PARAMS) {
        this.id = id ?? new ObjectId().toString();
        this.name = name;
        this.description = description;
        this.foundBy = foundBy;
        this.animalType = animalType;
    }
}
