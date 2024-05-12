import {EntityFactory} from "../entity-factory";
import {ObjectId, WithId} from "mongodb";
import {UserFactory} from "../user";
import {TelegramChat} from "./telegram-chat";

export class TelegramChatFactory extends EntityFactory<TelegramChat>{

    private readonly _userFactory: UserFactory;

    constructor() {
        super();
        this._userFactory = new UserFactory();
    }

    toDatabase(chat: TelegramChat): object {
        return {
            _id: new ObjectId(chat.id),
            telegramId: chat.telegramId,
            peopleNotification: chat.peopleNotification,
            animalsNotification: chat.animalsNotification,
        }
    }

    toEntity(object: WithId<TelegramChat>): TelegramChat {
        return new TelegramChat({
            id: object._id.toString(),
            telegramId: object.telegramId,
            peopleNotification: object.peopleNotification,
            animalsNotification: object.animalsNotification,
        });
    }

}
