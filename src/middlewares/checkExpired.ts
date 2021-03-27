import { Context, MiddlewareFn } from 'telegraf';
import { getCurrentSong } from '../tgcalls';

const checkExpired: MiddlewareFn<Context> = async (ctx, next) => {
    if (ctx.callbackQuery) {
        if ('data' in ctx.callbackQuery) {
            let chat = ctx.callbackQuery.message?.chat;
            if (!chat) { // USELESS CHECKING to Satisfy TS
                return await ctx.answerCbQuery("Invalid Request");
            }
            let [_, id] = ctx.callbackQuery.data.split(":");
            let current = getCurrentSong(chat.id);

            if (current && (current.song.id !== id)) {
                await ctx.answerCbQuery("This Button is Expired ...");
                return setTimeout(async () => await ctx.deleteMessage(), 2500);
            } else {
                return next();
            }
        }
    } else {
        return next();
    }
}

export default checkExpired;