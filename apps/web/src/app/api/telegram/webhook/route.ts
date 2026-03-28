import { NextRequest, NextResponse } from "next/server";
import { getProducer } from "@repo/kafka";
import { bot } from "@repo/bot";
import { client } from "@repo/db";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const msg = body.message;

    console.log(msg);

    if (!msg?.text) {
        return NextResponse.json({ ok: true });
    }

    const user = await client.user.findUnique({
        where: { telegramId: BigInt(msg.from.id) },
    });

    if (!user) {
        await bot.sendMessage(msg.chat.id, "Please sign in first.");
        return NextResponse.json({ ok: true });
    };

    const chatId = msg.chat.id;
    console.log("[bot] message:", msg.text, "userId:", user.id);
    // await bot.sendMessage(chatId, "pong");

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

