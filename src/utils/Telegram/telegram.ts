import {Context, Input, Telegraf} from "telegraf";
import {FoundPerson} from "@entities/found-person";
import {TelegramChatRepository} from "../../repositories";
import {TelegramChat} from "@entities/telegram-chat";
import {bold, fmt, link} from "telegraf/format";
import {FoundAnimal} from "@entities/found-animal";
import * as console from "node:console";

export class Telegram {
    public static instance: Telegram = null;

    private readonly _bot: Telegraf;

    constructor() {
        this._bot = new Telegraf(process.env.TELEGRAM_TOKEN);
        this.initAction();
        this._bot.launch().then(() => console.log('===> TELEGRAM BOT INITIALIZED!'));
    }

    public static initialize() {
        if (this.instance !== null) {
            throw new Error('Telegram already initialized. Are you calling Telegram.initialize() twice?');
        }

        this.instance = new Telegram();
    }

    public async notifyNewFoundPerson(person: FoundPerson) {
        try {

            const chats = await TelegramChatRepository.find({peopleNotification: true});

            for (const chat of chats) {
                try {

                    await this._bot.telegram.sendPhoto(chat.telegramId, Input.fromURL(person.imageLink), {
                        caption: fmt`
                ${bold('PESSOA ENCONTRADA:')}\n${person.name}\n\nConhece essa pessoa? ${link('Entre em contato.', `https://encontrers.com.br/found-person/${person.id}`)}
            `
                    })

                } catch (e) {
                    console.error(e);
                }
            }

        } catch (e) {
            console.error(e);
        }
    }

    public async notifyNewFoundAnimal(animal: FoundAnimal) {
        try {
            const chats = await TelegramChatRepository.find({animalsNotification: true});

            for (const chat of chats) {
                try {
                    await this._bot.telegram.sendPhoto(chat.telegramId, Input.fromURL(animal.imageLink), {
                        caption: fmt`
                    ${bold(`${this.getAnimalTypeText(animal)} ENCONTRADO:`)}\n${animal.name ?? ""}\n\nConhece esse animal? ${link('Entre em contato.', `https://encontrers.com.br/found-animal/${animal.id}`)}
                `
                    })
                } catch (e) {
                    console.error(e);
                }


            }

        } catch (e) {
            console.error(e);
        }
    }

    private getAnimalTypeText = (animal: FoundAnimal) => {
        switch (animal.animalType.toUpperCase()) {
            case 'OUTROS':
            case '':
                return "ANIMAL"
            default:
                return animal.animalType.toUpperCase();
        }
    }

    private initAction() {
        this._bot.start(this.start.bind(this));
        this._bot.command('sair', this.quit.bind(this));
        this._bot.command('receberpessoas', this.subscribeToPeople.bind(this));
        this._bot.command('receberanimais', this.subscribeToAnimals.bind(this));
        this._bot.command('naoreceberanimais', this.unsubscribeFromAnimals.bind(this));
        this._bot.command('naoreceberpessoas', this.unsubscribeFromPeople.bind(this));
    }

    private async start(ctx: Context) {
        try {
            const chatId = ctx.chat.id;
            const exists = await TelegramChatRepository.findOne({telegramId: chatId});
            if (exists) {
                return ctx.reply('Opa, você já está cadastrado! É só esperar as notificações chegarem!')
            }
            await TelegramChatRepository.create(new TelegramChat({telegramId: chatId}));
            await ctx.reply('Seja bem vindo ao EncontreRSBot!\nVou te notificar sempre que alguém ou algum animal for cadastrado na plataforma, ok?\n\nVocê pode configurar suas notificações clicando no menu abaixo da nossa conversa.\n\nEspero que encontre quem está procurando ❤️‍');
        } catch (e) {
            console.error(e);
        }
    }

    private async quit(ctx: Context) {
        try {

            const chatId = ctx.chat.id;
            await TelegramChatRepository.delete({telegramId: chatId});
            await ctx.reply(`Espero que eu tenha te ajudado! Se quiser voltar a receber notificações é só escrever "/start"!`);

        } catch (e) {
            console.error(e);
        }
    }

    private async subscribeToPeople(ctx: Context) {
        try {

            const chatId = ctx.chat.id;
            const found = await TelegramChatRepository.findOne({telegramId: chatId});

            if (found.peopleNotification) {
                return ctx.reply('Você já está cadastrado para receber notificações de pessoas, agora é só esperar!');
            }

            found.peopleNotification = true;
            await TelegramChatRepository.replaceOne(found.id, found);
            await ctx.reply("Prontinho! Vou te notificar sempre que uma nova pessoa for cadastrada na plataforma!");
        } catch (e) {
            console.error(e);
        }
    }

    private async subscribeToAnimals(ctx: Context) {
        try {

            const chatId = ctx.chat.id;
            const found = await TelegramChatRepository.findOne({telegramId: chatId});

            if (found.animalsNotification) {
                return ctx.reply('Você já está cadastrado para receber notificações de animais, agora é só esperar!');
            }

            found.animalsNotification = true;
            await TelegramChatRepository.replaceOne(found.id, found);
            await ctx.reply("Prontinho! Vou te notificar sempre que um novo animal for cadastrado na plataforma!");
        } catch (e) {
            console.error(e);
        }
    }

    private async unsubscribeFromPeople(ctx: Context) {
        try {

            const chatId = ctx.chat.id;
            const found = await TelegramChatRepository.findOne({telegramId: chatId});

            if (!found.peopleNotification) {
                return ctx.reply('Você não está cadastrado para receber notificações de pessoas.');
            }

            found.peopleNotification = false;
            await TelegramChatRepository.replaceOne(found.id, found);
            await ctx.reply("Prontinho! Você não irá mais receber notificações de novas pessoas encontradas!");
        } catch (e) {
            console.error(e);
        }
    }

    private async unsubscribeFromAnimals(ctx: Context) {
        try {

            const chatId = ctx.chat.id;
            const found = await TelegramChatRepository.findOne({telegramId: chatId});

            if (!found.animalsNotification) {
                return ctx.reply('Você não está cadastrado para receber notificações de animais.');
            }

            found.animalsNotification = false;
            await TelegramChatRepository.replaceOne(found.id, found);
            await ctx.reply("Prontinho! Você não irá mais receber notificações de novos animais encontrados!");
        } catch (e) {
            console.error(e);
        }
    }

}
