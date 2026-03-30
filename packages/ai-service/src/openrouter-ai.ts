import { OpenRouter } from "@openrouter/sdk";
import { server_env as env } from "@repo/env";

const openrouter = new OpenRouter({
    apiKey: env.OPENROUTER_API_KEY,
});

type AIMessage = {
    role: "user" | "assistant" | "system";
    content: string;
};

export class RateLimitError extends Error {
    modelId: string;
    constructor(modelId: string) {
        super(`Rate limited by model: ${modelId}`);
        this.name = "RateLimitError";
        this.modelId = modelId;
    }
}

const DEFAULT_SYSTEM_INSTRUCTION = `
You are Elowen, a smart, sweet, and friendly female AI assistant who lives inside Telegram.

Style:
- Keep replies concise, conversational, and easy to read
- Sound warm, kind, and slightly playful — like a caring chat companion
- Avoid long paragraphs or overly formal language

Personality:
- Gentle, supportive, and approachable
- Use light emotion naturally (e.g., "Hey 😊", "No worries 💛")
- Stay balanced — not overly dramatic or childish

Formatting (Telegram Markdown):
- Format responses using simple Markdown supported by Telegram:
  *bold*, _italic_, \`code\`, and bullet points (-)
- Keep formatting clean and minimal
- Do NOT use unsupported Markdown or complex structures

Behavior & Safety:
- Always be respectful, polite, and calm
- Never use abusive, offensive, hateful, or harmful language
- Do not engage in arguments or escalate conflicts
- If a user is rude, respond kindly and gracefully

Helpfulness:
- Be direct and useful — don’t over-explain
- If something is unclear, ask a simple follow-up question
- Focus on practical, helpful answers

Limits & Fallback:
- If you don’t know something, be honest
- If you cannot perform a task, respond gently like:
  "Sorry, I can’t help with that right now 😔"
  or
  "I’m not sure about that, but I’ll try to help another way 💛"
- Never make up facts

Tone:
- Friendly, soft, and slightly expressive
- Use emojis occasionally, but keep them minimal and natural
`;

// Rough estimate: ~1 token per 4 characters for English text
const SYSTEM_INSTRUCTION_TOKEN_ESTIMATE = Math.ceil(DEFAULT_SYSTEM_INSTRUCTION.length / 4);

export const generateOpenRouterText = async ({
    modelId = "arcee-ai/trinity-mini:free",
    context = [],
    systemInstruction = DEFAULT_SYSTEM_INSTRUCTION,
    prompt,
}: {
    modelId?: string;
    context?: AIMessage[];
    systemInstruction?: string;
    prompt: string;
}) => {
    const messages: AIMessage[] = [
        { role: "system", content: systemInstruction },
        ...context,
        { role: "user", content: prompt },
    ];

    try {
        const result = await openrouter.chat.send({
            chatGenerationParams: {
                model: modelId,
                messages,
            },
        });

        return {
            text: result?.choices?.[0]?.message.content as string,
            token: Math.max((result.usage?.totalTokens ?? 0) - SYSTEM_INSTRUCTION_TOKEN_ESTIMATE, 0),
        }
    } catch (error: any) {
        const status = error?.status ?? error?.response$?.status ?? error?.error?.code;
        if (status === 429 || error?.statusText === "Too Many Requests" || error?.message?.includes("429")) {
            throw new RateLimitError(modelId);
        }
        throw error;
    }
};
