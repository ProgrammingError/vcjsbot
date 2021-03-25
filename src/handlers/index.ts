import { bot } from '../bot';

import { playHandler } from './play';
import { queueHandler } from './queue';
import { pauseCBHandler } from './pause-resume';
import { skipCBHandler } from './skip';
import { songHandler } from './current';

export const initHandlers = (): void => {
    bot.use(playHandler);
    bot.use(queueHandler);
    bot.use(pauseCBHandler);
    bot.use(skipCBHandler);
    bot.use(songHandler);
};
