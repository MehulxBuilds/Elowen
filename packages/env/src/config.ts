import { z } from "zod";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

export const ServerEnvSchema = z.object({
    DATABASE_URL: z.string().url(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number(),
    REDIS_USERNAME: z.string().optional(),
    REDIS_PASSWORD: z.string().optional(),
    KAFKA_BROKER: z.string(),
    KAFKA_SSL: z.string(),
    SOCKET_PORT: z.coerce.number(),
    WEB_APP_URL: z.string().url(),
    YOUR_BOT_TOKEN: z.string(),
    NODE_ENV: z.string().optional(),
    GEMINI_API_KEY: z.string(),
    OPENROUTER_API_KEY: z.string().optional(),
    NEWS_API_KEY: z.string().optional().default("pub_d20c3202e78b42c7bba700a3d506c571"),
    TELEGRAM_WEBHOOK_URL: z.string().url().optional(),
    ARCJET_API: z.string().optional(),
});

export type ServerEnv = z.infer<typeof ServerEnvSchema>;
export const server_env = ServerEnvSchema.parse(process.env);