import { Context, MiddlewareFn } from 'telegraf';
import { logger as log } from '../bot';
import escapeHtml from '@youtwitface/escape-html';

const Logger: MiddlewareFn<Context> = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        await log(`<b>Error :</b> ${escapeHtml(err.toString())}`, "HTML");
    }
}

export default Logger;