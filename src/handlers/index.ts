import { bot } from '../bot';

import { playHandler } from './play';
import { queueHandler } from './queue';
import { pauseHandler, pauseCBHandler } from './pause';
import { skipHandler, skipCallBack } from './skip';
import { songHandler } from './current';

export const initHandlers = (): void => {
    bot.use(playHandler);
    bot.use(queueHandler);
    bot.use(pauseHandler, pauseCBHandler);
    bot.use(skipHandler, skipCallBack);
    bot.use(songHandler);
};
