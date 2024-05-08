import {User} from "../user";

export class FoundPerson {
    private _id: string;
    private _name: string;
    private _description: string;
    private _foundBy: User


    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get foundBy(): User {
        return this._foundBy;
    }

    set foundBy(value: User) {
        this._foundBy = value;
    }
}
