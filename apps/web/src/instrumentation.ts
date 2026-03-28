export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { setupWebhook } = await import("@repo/bot");
        if (process.env.TELEGRAM_WEBHOOK_URL) {
            await setupWebhook(`${process.env.TELEGRAM_WEBHOOK_URL}/api/telegram/webhook`);
        }
    }
}
