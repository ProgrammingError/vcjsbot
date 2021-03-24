import { Composer, deunionize } from 'telegraf';
import { addToQueue } from '../tgcalls';
import { getCurrentSong } from '../tgcalls';
import escapeHtml from '@youtwitface/escape-html';

export const playHandler = Composer.command('play', async ctx => {
    const { chat } = ctx.message;

    if (chat.type !== 'supergroup') {
        await ctx.reply('I can only play in groups.');
        return;
    }

    const [commandEntity] = ctx.message.entities!;
    const text = ctx.message.text.slice(commandEntity.length + 1) || deunionize(ctx.message.reply_to_message)?.text;

    if (!text) {
        await ctx.reply('You need to specify a YouTube URL.');
        return;
    }

    const index = await addToQueue(chat, text);
    const song = getCurrentSong(chat.id);
    
    let time = '';

    if (song.duration > 0) {
        time += ' - ';

        const hours = Math.floor(song.duration / 3600);
        const minutes = Math.floor(song.duration / 60) % 60;
        const seconds = (song.duration % 60).toString().padStart(2, '0');

        if (hours > 0) {
            time += `${hours}:${minutes.toString().padStart(2, '0')}:${seconds}`;
        } else {
            time += `${minutes}:${seconds}`;
        }
    }

    soong = `<b>Title:<b> <a href="https://youtu.be/${song.id}">${escapeHtml(song.title)}</a><break><b>Duration:</b> ${time}`;

    let message;

    switch (index) {
        case -1:
            message = 'Failed to download song.';
            break;

        case 0:
            message = `<b>Playing </b><break>${soong}`;
            break;

        default:
            message = `<b>Queued</b><break>${soong}<break><b>at position ${index}.</b>`;
    }

    await ctx.reply(message, {
        parse_mode: 'HTML',
    });
});
