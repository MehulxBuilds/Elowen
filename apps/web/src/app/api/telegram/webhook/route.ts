import { NextRequest, NextResponse } from "next/server";
import { getProducer } from "@repo/kafka";
import { bot } from "@repo/bot";
import { client } from "@repo/db";
import aj from "@/lib/arcjet";
import { FreeLimit, PremiumLimit } from "@/lib/constants";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const msg = body.message;

    const decision = await aj.protect(req);
    if (decision.isDenied()) {
        bot.sendMessage(msg.chat.id, "⚠️ Too Many Requests\n\nPlease try again later.");
        return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }

    if (!msg?.text) {
        return NextResponse.json({ ok: true });
    }

    const user = await client.user.findUnique({
        where: {
            telegramId: BigInt(msg.from.id)
        },
        select: {
            sessions: true,
            id: true,
            userDailyUsages: true,
            userUsage: true,
            subscriptionStatus: true,
            subscriptionTier: true,
        }
    });

    const isPremium = user?.subscriptionStatus === "ACTIVE" && (user.subscriptionTier === "PRO" || user.subscriptionTier === "ENTERPRISE");
    const userLimit = isPremium ? PremiumLimit : FreeLimit;

    if (!user?.sessions || !user?.sessions.some((s) => s.expiresAt > new Date())) {
        await bot.sendMessage(msg.chat.id, "Please sign in first.");
        return NextResponse.json({ ok: true });
    };

    const chatId = msg.chat.id;
    const usage = user.userUsage;
    const tokensUsed = Number(usage?.tokenConsumed ?? 0);
    if (tokensUsed >= userLimit) {
        await bot.sendMessage(
            chatId,
            `⚠️ *Usage Limit Reached*\n\nYou've used all your free credits (${tokensUsed}/${userLimit}).\n\nPlease upgrade your plan to continue chatting.`,
            { parse_mode: "Markdown" }
        );
        return NextResponse.json({ ok: true });
    }

    const id = crypto.randomUUID();

    await getProducer("query").publishMessage({
        id,
        query: msg.text,
        role: "USER",
        type: "NORMAL",
        userId: user.id,
        chatId: String(chatId),
        createdAt: new Date(msg.date),
    });

    return NextResponse.json({ ok: true });
}

