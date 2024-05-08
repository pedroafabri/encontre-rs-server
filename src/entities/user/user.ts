export class User {
    public _id: string;
    private _name: string;
    private _email: string;
    private _contacts: string;
    private _firebaseId: string

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get contacts(): string {
        return this._contacts;
    }

    set contacts(value: string) {
        this._contacts = value;
    }


    get firebaseId(): string {
        return this._firebaseId;
    }

    set firebaseId(value: string) {
        this._firebaseId = value;
    }
}
