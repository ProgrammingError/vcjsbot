import { Composer } from 'telegraf';
import { skip } from '../tgcalls';
import checkExpired from '../middlewares/checkExpired';
import Auth from '../middlewares/auth';

export const skipCBHandler = Composer.action(/^skip:[a-zA-Z0-9.\-_]+$/, Auth, checkExpired, async ctx => {
    const chat = ctx.callbackQuery.message?.chat;

    if (!chat) {
        await ctx.answerCbQuery("Invalid Request");
        return
    }

    if (chat.type !== 'supergroup') {
        return;
    }

    const skipped = skip(chat.id);

    if (skipped) {
        await ctx.answerCbQuery("Skipped ...");
        setTimeout(async () => await ctx.deleteMessage(), 1000);
    } else {
        await ctx.answerCbQuery("There's no song playing..")
    }
})
