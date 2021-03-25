import { Composer } from 'telegraf';
import { skip, getCurrentSong } from '../tgcalls';

export const skipHandler = Composer.command('skip', ctx => {
    const { chat } = ctx.message;

    if (chat.type !== 'supergroup') {
        return;
    }

    const skipped = skip(chat.id);
    ctx.reply(skipped ? 'Skipped.' : "There's no song playing.");
});

export const skipCallBack = Composer.action(/^skip:[a-zA-Z0-9]+$/, async ctx => {
    const chat = ctx.callbackQuery.message?.chat;

    let data: string = '';
    if ('data' in ctx.callbackQuery) data = ctx.callbackQuery.data;
    data = data.split(":")[1];

    if (!chat) {
        return await ctx.answerCbQuery("Invalid Request");
    }

    if (chat.type !== 'supergroup') {
        return;
    }

    const current = getCurrentSong(chat.id);
    if (current && (current.id !== data)) {
        return await ctx.answerCbQuery("Expired ...");
    }
    
    const skipped = skip(chat.id);

    return skipped ? await ctx.deleteMessage() : await ctx.answerCbQuery("There's no song playing..")
})