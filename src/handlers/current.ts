import { Composer, Markup } from 'telegraf';
import { getCurrentSong } from '../tgcalls';
import { getDuration } from '../utils';
import escapeHtml from '@youtwitface/escape-html';

export const songHandler = Composer.command('current', ctx => {
    const { chat } = ctx.message;

    if (chat.type !== 'supergroup') {
        return;
    }

    const song = getCurrentSong(chat.id);

    if (song === null) {
        ctx.reply('There is no song playing.');
        return;
    }

    const { id, title, duration } = song
    return ctx.replyWithPhoto(`https://img.youtube.com/vi/${id}/hqdefault.jpg`, {
        caption: `<b>Playing : </b> <a href="https://www.youtube.com/watch?v=${id}">${escapeHtml(title)}</a>\n` +
            `<b>Duration: </b>${getDuration(duration)}`,
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
            [
                Markup.button.callback('Pause', `pause:${id}`),
                Markup.button.callback('Skip', `skip:${id}`)
            ]
        ])
    })
});
