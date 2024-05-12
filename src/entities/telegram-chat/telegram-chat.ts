import {ObjectId} from "mongodb";

type CONSTRUCTOR_PARAMS = {
    id?: string,
    telegramId: number,
    peopleNotification?: boolean,
    animalsNotification?: boolean
}

export class TelegramChat {
    public id: string;
    public telegramId: number;
    public peopleNotification: boolean;
    public animalsNotification: boolean;

    constructor({id, telegramId, peopleNotification, animalsNotification} :CONSTRUCTOR_PARAMS) {
        this.id = id ?? new ObjectId().toString();
        this.telegramId = telegramId;
        this.peopleNotification = peopleNotification ?? true;
        this.animalsNotification = animalsNotification ?? true;
    }
}
