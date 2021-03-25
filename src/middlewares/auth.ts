import { Context, MiddlewareFn } from 'telegraf';
import client from '../redis';
import { promisify } from 'util';

const regex = /^\/([^@\s]+)@?(?:(\S+)|)\s?([\s\S]+)?$/i; // Credit -> https://github.com/telegraf/telegraf-command-parts/blob/da799b344b723e09c0c936bd5fbdd344bda4033e/index.js#L3
const getAsync = promisify(client.get).bind(client);

const Auth: MiddlewareFn<Context> = async (ctx, next) => {
    let sudos: string | string[] | null;
    sudos = await getAsync('SUDOS');
    if (sudos && (typeof (sudos) === 'string')) {
        sudos = sudos.split(" ");
    }
    let owner = await getAsync('OWNER');
    let id = ctx.from?.id.toString();

    if ((id && sudos && (typeof(sudos) === 'object') && sudos.includes(id)) || (id === owner)) {
        next();
    } else {
        if (ctx.message && 'text' in ctx.message && regex.exec(ctx.message.text)) {
            return;
        } else if (ctx.callbackQuery) {
            return ctx.answerCbQuery("You aren't authorized ...", {
                show_alert: true
            })
        }
        else {
            return;
        }
    }
}

export default Auth;