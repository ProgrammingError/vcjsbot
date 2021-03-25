import { Composer, Markup } from 'telegraf';
import { pause, getCurrentSong } from '../tgcalls';
import { getDuration } from '../utils';
import escapeHtml from '@youtwitface/escape-html';

export const pauseCBHandler = Composer.action('pause', async ctx => {
    const chat = ctx.callbackQuery.message?.chat;

    let data: string = '';
    if ('data' in ctx.callbackQuery) data = ctx.callbackQuery.data;
    data = data.split(":")[1];

    if (!chat) {
        await ctx.answerCbQuery("Invalid Request");
        return false;
    }

    const paused = pause(chat.id);
    const current = getCurrentSong(chat.id);
    if (!current) {
        await ctx.answerCbQuery("There's nothing playing here.");
        return setTimeout(async () => await ctx.deleteMessage(), 5000);
    }

    const { id, title, duration } = current;
    if (paused) {
        await ctx.editMessageCaption(`<b>Paused :</b> <a href="https://www.youtube.com/watch?v=${id}">${escapeHtml(title)}</a>\n` +
            `<b>Duration :</b> ${getDuration(duration)}`, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback('Resume', `pause`),
                    Markup.button.callback('Skip', 'skip')
                ]
            ])
        });
        return await ctx.answerCbQuery("Paused ...");
    } else {
        await ctx.editMessageCaption(`<b>Playing :</b> <a href="https://www.youtube.com/watch?v=${id}">${escapeHtml(title)}</a>\n` +
            `<b>Duration :</b> ${getDuration(duration)}`, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback('Pause', `pause`),
                    Markup.button.callback('Skip', 'skip')
                ]
            ])
        });
        return await ctx.answerCbQuery("Resumed ...");
    }
})
