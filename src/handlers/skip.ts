import { Composer } from 'telegraf';
import { skip } from '../tgcalls';

export const skipHandler = Composer.command('skip', ctx => {
    const { chat } = ctx.message;

    if (chat.type !== 'supergroup') {
        return;
    }

    const skipped = skip(chat.id);
    ctx.reply(skipped ? 'Skipped.' : "There's no song playing.");
});

export const skipCallBack = Composer.action('skip', async ctx => {
    const chat = ctx.callbackQuery.message?.chat;
    
    if (!chat) return await ctx.answerCbQuery("Invalid Request")

    if (chat.type !== 'supergroup') {
        return;
    }

    const skipped = skip(chat.id);
    
    return skipped ? await ctx.deleteMessage() : await ctx.answerCbQuery("There's no song playing..")
})