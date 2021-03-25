import { Composer } from 'telegraf';
import { skip, getCurrentSong } from '../tgcalls';

export const skipCBHandler = Composer.action('skip', async ctx => {
    const chat = ctx.callbackQuery.message?.chat;

    let data: string = '';
    if ('data' in ctx.callbackQuery) data = ctx.callbackQuery.data;
    data = data.split(":")[1];

    if (!chat) {
        await ctx.answerCbQuery("Invalid Request");
        return
    }

    if (chat.type !== 'supergroup') {
        return;
    }

    const current = getCurrentSong(chat.id);
    if (current && (current.id !== data)) {
        await ctx.answerCbQuery("Expired ...");
        return;
    }

    const skipped = skip(chat.id);

    return skipped ? await ctx.deleteMessage() : await ctx.answerCbQuery("There's no song playing..")
})