import { Composer } from 'telegraf';
import { getQueue } from '../tgcalls';
import escapeHtml from '@youtwitface/escape-html';

export const queueHandler = Composer.command('queue', ctx => {
    const { chat } = ctx.message;

    if (chat.type !== 'supergroup') {
        return;
    }

    const queue = getQueue(chat.id);
    const message =
        queue && queue.length > 0
            ? queue.map((data, index) => {
                const { info, from } = data;
                return `<b>${index + 1} -</b> <a href="https://www.youtube.com/watch?v=${info.id}">${escapeHtml(info.title)}</a>\n<i>Requested By : <a href="tg://user?id=${from.id}">${from.f_name}</a></i>`
            }).join('\n')
            : 'The queue is empty.';

    ctx.replyWithHTML(message, { disable_web_page_preview: true });
});
