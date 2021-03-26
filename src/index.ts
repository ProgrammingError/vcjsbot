import { bot } from './bot';
import { initHandlers } from './handlers';
import { initMiddleWares } from './middlewares';
import env from './env';

(async () => {
    initMiddleWares();
    initHandlers();
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    await bot.launch();
    await bot.telegram.sendMessage(env.LOG_CHANNEL, `@${bot.botInfo?.username} is running...`);
})();
