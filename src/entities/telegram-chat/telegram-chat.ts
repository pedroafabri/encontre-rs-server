import {ObjectId} from "mongodb";

type CONSTRUCTOR_PARAMS = {
    id?: string,
    telegramId: number
}

export class TelegramChat {
    public id: string;
    public telegramId: number;

    constructor({id, telegramId} :CONSTRUCTOR_PARAMS) {
        this.id = id ?? new ObjectId().toString();
        this.telegramId = telegramId;
    }
}
