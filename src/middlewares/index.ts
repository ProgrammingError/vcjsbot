import { bot } from '../bot';

import Auth from './auth';
import Logger from './logger';
import checkExpired from './checkExpired';

export const initMiddleWares = (): void => {
    bot.use(Logger);
    bot.use(Auth);
    bot.use(checkExpired);
}