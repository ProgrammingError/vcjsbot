import { bot } from './bot';
import { initHandlers } from './handlers';
import Auth from './middlewares/auth';

(async () => {
    bot.use(Auth);
    initHandlers();
    await bot.telegram.deleteWebhook({drop_pending_updates: true});
    await bot.launch();
    console.log(`@${bot.botInfo?.username} is running...`);
})();
