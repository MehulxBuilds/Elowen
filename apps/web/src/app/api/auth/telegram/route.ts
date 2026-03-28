import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { client } from "@repo/db";
import { server_env } from "@repo/env";
import { bot } from "@repo/bot";

function verifyTelegramHash(data: Record<string, string>): boolean {
    const { hash, ...fields } = data;
    const secret = crypto.createHash("sha256").update(server_env.YOUR_BOT_TOKEN).digest();
    const checkString = Object.keys(fields)
        .sort()
        .map((k) => `${k}=${fields[k]}`)
        .join("\n");
    const hmac = crypto.createHmac("sha256", secret).update(checkString).digest("hex");
    return hmac === hash;
}

export async function POST(req: NextRequest) {
    const data: Record<string, string> = await req.json();

    if (!data.id || !data.hash || !data.auth_date || !data.first_name) {
        return NextResponse.json({ message: "Missing required Telegram auth fields" }, { status: 400 });
    }

    if (Date.now() / 1000 - parseInt(data.auth_date) > 300) {
        return NextResponse.json({ message: "Auth data expired" }, { status: 401 });
    }

    if (!verifyTelegramHash(data)) {
        return NextResponse.json({ message: "Invalid Telegram auth hash" }, { status: 401 });
    }

    const user = await client.user.upsert({
        where: { telegramId: BigInt(data.id) },
        update: {
            firstName: data.first_name,
            lastName: data.last_name ?? null,
            username: data.username ?? null,
            photoUrl: data.photo_url ?? null,
            modelId: "arcee-ai/trinity-mini:free",
            modelName: "Arcee AI: Trinity Mini (free)",
        },
        create: {
            telegramId: BigInt(data.id),
            firstName: data.first_name,
            lastName: data.last_name ?? null,
            username: data.username ?? null,
            photoUrl: data.photo_url ?? null,
            modelId: "arcee-ai/trinity-mini:free",
            modelName: "Arcee AI: Trinity Mini (free)",
        },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await client.session.create({
        data: { token, userId: user.id, expiresAt },
    });

    bot.sendMessage(user?.telegramId as unknown as number, "Hey! Wellcome back to Elowen 🎀");

    const response = NextResponse.json({
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            photoUrl: user.photoUrl,
        },
    });

    response.cookies.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/",
    });

    return response;
}
