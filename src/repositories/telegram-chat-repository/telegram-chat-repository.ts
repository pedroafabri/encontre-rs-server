import {BaseRepository} from "../base-repository";
import {TelegramChatFactory} from "@entities/telegram-chat/telegram-chat-factory";
import {TelegramChat} from "@entities/telegram-chat";

class TelegramChatRepository extends BaseRepository<TelegramChat> {
  constructor() {
    super('TelegramChats', new TelegramChatFactory());
  }
}

export default new TelegramChatRepository();
