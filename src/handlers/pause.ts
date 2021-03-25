import { Composer, Markup } from 'telegraf';
import { pause, getCurrentSong } from '../tgcalls';

export const pauseHandler = Composer.command(['pause', 'resume'], async ctx => {
    const { chat } = ctx.message;

    if (chat.type !== 'supergroup') {
        return;
    }

    const paused = pause(chat.id);
    const message = paused === null ? "There's nothing playing here." : paused ? 'Paused.' : 'Resumed.';

    await ctx.reply(message);
});


export const pauseCBHandler = Composer.action(/^pause:[a-zA-Z0-9]+$/, async ctx => { // Thanks to @MKRhere for Regex
    const chat = ctx.callbackQuery.message?.chat;

    if (!chat) return await ctx.answerCbQuery("Invalid Request");

    const paused = pause(chat.id);
    const current = getCurrentSong(chat.id);
    if (!current) return ctx.answerCbQuery("There's nothing playing here.")
    const { id, title } = current;
    if (paused) {
        return await ctx.editMessageCaption(`<b>Paused : </b> <a href="https://www.youtube.com/watch?v=${id}">${title}</a>`, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback('Resume', `pause:${id}`),
                    Markup.button.callback('Skip', 'skip')
                ]
            ])
        });
    } else {
        return await ctx.editMessageCaption(`<b>Resumed : </b> <a href="https://www.youtube.com/watch?v=${id}">${title}</a>`, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback('Pause', `pause:${id}`),
                    Markup.button.callback('Skip', 'skip')
                ]
            ])
        });
    }
})
