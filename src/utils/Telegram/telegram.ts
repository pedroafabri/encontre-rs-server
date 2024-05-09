import {Context, Input, Telegraf} from "telegraf";
import {FoundPerson} from "@entities/found-person";
import {TelegramChatRepository} from "../../repositories";
import {TelegramChat} from "@entities/telegram-chat";
import {bold, fmt, link} from "telegraf/format";

export class Telegram{
    public static instance: Telegram = null;

    private readonly _bot:  Telegraf;

    constructor() {
        this._bot = new Telegraf(process.env.TELEGRAM_TOKEN);
        this.initAction();
        this._bot.launch().then(() => console.log('===> TELEGRAM BOT INITIALIZED!'));
    }

    public static initialize() {
        if(this.instance !== null) {
            throw new Error('Telegram already initialized. Are you calling Telegram.initialize() twice?');
        }

        this.instance = new Telegram();
    }

    public async notifyNewFoundPerson(person: FoundPerson) {
        const chats = await TelegramChatRepository.find({});

        for(const chat of chats) {
            await this._bot.telegram.sendPhoto(chat.telegramId, Input.fromURL(person.imageLink), {caption: fmt`
                ${bold('PESSOA ENCONTRADA:')}\n${person.name}\n\nConhece essa pessoa? ${link('Entre em contato.', `https://encontrers.com.br/${person.id}`)}
            `})

        }

    }

    private initAction() {
        this._bot.start(this.start.bind(this));
        this._bot.command('sair', this.quit.bind(this));
    }

    private async start(ctx: Context) {
        const chatId = ctx.chat.id;
        const exists = await TelegramChatRepository.findOne({telegramId: chatId});
        if(exists) {
            return ctx.reply('Opa, você já está cadastrado! É só esperar as notificações chegarem!')
        }
        await TelegramChatRepository.create(new TelegramChat({telegramId: chatId}));
        await ctx.reply('Seja bem vindo ao EncontreRSBot!\nVou te notificar sempre que alguém for cadastrado na plataforma, ok?\n\nE você pode escrever "/sair" para parar de receber mensagens a qualquer momento, ok?\n\nEspero que encontre quem está procurando ❤️‍');
    }

    private async quit(ctx: Context) {
        const chatId = ctx.chat.id;
        await TelegramChatRepository.delete({telegramId: chatId});
        await ctx.reply(`Espero que eu tenha te ajudado! Se quiser voltar a receber notificações é só escrever "/start"!`);
    }


}
