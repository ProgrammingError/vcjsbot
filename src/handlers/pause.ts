import { Composer, Markup } from 'telegraf';
import { pause, getCurrentSong } from '../tgcalls';
import { getDuration } from '../utils';

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

    let data: string = '';
    if ('data' in ctx.callbackQuery) data = ctx.callbackQuery.data;
    data = data.split(":")[1];

    if (!chat) {
        await ctx.answerCbQuery("Invalid Request");
        return;
    }

    const paused = pause(chat.id);
    const current = getCurrentSong(chat.id);
    if (!current) {
        await ctx.answerCbQuery("There's nothing playing here.");
        return;
    }
    if (current.id !== data) {
        await ctx.answerCbQuery("Expired ...");
        return;
    }

    const { id, title, duration } = current;
    if (paused) {
        await ctx.editMessageCaption(`<b>Paused :</b> <a href="https://www.youtube.com/watch?v=${id}">${title}</a>\n` +
            `<b>Duration :</b> ${getDuration(duration)}`, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback('Resume', `pause:${id}`),
                    Markup.button.callback('Skip', 'skip')
                ]
            ])
        });
        return await ctx.answerCbQuery("Paused ...");
    } else {
        await ctx.editMessageCaption(`<b>Resumed : </b> <a href="https://www.youtube.com/watch?v=${id}">${title}</a>\n` +
            `<b>Duration :</b> ${getDuration(duration)}`, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback('Pause', `pause:${id}`),
                    Markup.button.callback('Skip', 'skip')
                ]
            ])
        });
        return await ctx.answerCbQuery("Resumed ...");
    }
})
