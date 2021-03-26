import { Composer, Markup } from 'telegraf';
import { pause, getCurrentSong } from '../tgcalls';
import { getDuration } from '../utils';
import escapeHtml from '@youtwitface/escape-html';
import checkExpired from '../middlewares/checkExpired';
import { logger as log } from '../bot';

export const pauseCBHandler = Composer.action(/^pause:[a-zA-Z0-9]+$/, checkExpired, async ctx => {
    console.log("Received Callback");
    const chat = ctx.callbackQuery.message?.chat;

    let data: string = '';
    if ('data' in ctx.callbackQuery) data = ctx.callbackQuery.data;
    console.log(`CB data : ${data}`)

    if (!chat) {
        await ctx.answerCbQuery("Invalid Request");
        return false;
    }

    const current = getCurrentSong(chat.id);
    const paused = pause(chat.id);
    console.log(`Paused`);
    if (!current) {
        console.log("NOTHING IS PLAYING");
        await ctx.answerCbQuery("There's nothing playing here.");
        return setTimeout(async () => await ctx.deleteMessage(), 1000);
    }

    const { id, title, duration } = current;
    if (paused) {
        console.log("EDITING MESSAGE ...");
        await ctx.editMessageCaption(`<b>Paused :</b> <a href="https://www.youtube.com/watch?v=${id}">${escapeHtml(title)}</a>\n` +
            `<b>Duration :</b> ${getDuration(duration)}\n` +
            `<b>Paused by :</b> <a href="tg://user?id=${ctx.from?.id}">${ctx.from?.first_name}</a>`, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback('Resume', `pause:${id}`),
                    Markup.button.callback('Skip', `skip${id}`)
                ]
            ])
        });
        return await ctx.answerCbQuery("Paused ...");
    } else {
        console.log("EDITING MESSAGE ...");
        await ctx.editMessageCaption(`<b>Playing :</b> <a href="https://www.youtube.com/watch?v=${id}">${escapeHtml(title)}</a>\n` +
            `<b>Duration :</b> ${getDuration(duration)}\n` +
            `<b>Resumed by :</b> <a href="tg://user?id=${ctx.from?.id}">${ctx.from?.first_name}</a>`, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback('Pause', `pause:${id}`),
                    Markup.button.callback('Skip', `skip:${id}`)
                ]
            ])
        });
        return await ctx.answerCbQuery("Resumed ...");
    }
})
