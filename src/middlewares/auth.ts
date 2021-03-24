import { Context, MiddlewareFn } from 'telegraf';
import client from '../redis';
import { promisify } from 'util';

const getAsync = promisify(client.get).bind(client);

const Auth: MiddlewareFn<Context> = async (ctx, next) => {
    let sudos: string | string[] | null;
    sudos = await getAsync('SUDOS');
    if (sudos) {
        sudos = sudos.split(" ");
    }
    let owner = await getAsync('OWNER');
    let id = ctx.from?.id.toString();

    if ((id && sudos && sudos.includes(id)) || (id == owner)) {
        next();
    } else {
        ctx.reply("You are not authorized to use my Commands");
    }
}

export default Auth;