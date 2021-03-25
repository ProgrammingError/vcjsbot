import { Composer, deunionize, Markup } from 'telegraf';
import { addToQueue } from '../tgcalls';
import { getCurrentSong } from '../tgcalls';
import { getDuration } from '../utils';

export const playHandler = Composer.command('play', async ctx => {
    const { chat } = ctx.message;

    if (chat.type !== 'supergroup') {
        await ctx.reply('I can only play in groups.');
        return;
    }

    const [commandEntity] = ctx.message.entities!;
    const text = ctx.message.text.slice(commandEntity.length + 1) || deunionize(ctx.message.reply_to_message)?.text;

    if (!text) {
        await ctx.reply('You need to specify a YouTube URL / Search Keyword.');
        return;
    }

    const index = await addToQueue(chat, text);
    const song = getCurrentSong(chat.id);

    let message;

    switch (index) {
        case -1:
            await ctx.reply("Failed to download song ...")
            break;
        case 0:
            if (song) {
                const { id, title, duration } = song;
                ctx.replyWithPhoto(`https://img.youtube.com/vi/${id}/mqdefault.jpg`, {
                    caption: `<b>Playing : </b> <a href="https://www.youtube.com/watch?v=${id}">${title}</a>\n` +
                        `<b>Duration: </b>${getDuration(duration)}`,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback('Pause', `pause:${id}`),
                            Markup.button.callback('Skip', `skip:${id}`)
                        ]
                    ])
                })
            }
            break;
        default:
            message = ctx.replyWithHTML(`<b>Queued</b>\n${text}\n<b>at position ${index}.</b>`);
    }

});
