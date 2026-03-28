import TelegramBot from "node-telegram-bot-api";
import { server_env } from "@repo/env";

const YOUR_BOT_TOKEN = server_env.YOUR_BOT_TOKEN || "";

export const bot = new TelegramBot(YOUR_BOT_TOKEN, {
    polling: false,
});

export function startBot() {
    bot.deleteWebHook().then(() => {
        bot.startPolling();
        console.log("Bot Started Running");
    });

    bot.on("polling_error", (error) => {
        console.error("[polling_error]", error.message);
    });

    process.on("SIGINT", () => bot.stopPolling());
    process.on("SIGTERM", () => bot.stopPolling());
}

export async function setupWebhook(webhookUrl: string) {
    await bot.setWebHook(webhookUrl);
    console.log(`[bot] Webhook set to: ${webhookUrl}`);
}