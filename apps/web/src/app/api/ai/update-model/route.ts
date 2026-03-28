import { NextRequest, NextResponse } from "next/server";
import { client } from "@repo/db";
import { bot } from "@repo/bot";
import { z } from "zod";
import { getSessionUser } from "@/lib/session";

const updateModelSchema = z.object({
    modelName: z.string(),
    modelId: z.string(),
});

export async function POST(req: NextRequest) {
    const user = await getSessionUser(req);
    if (!user) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { success, data } = updateModelSchema.safeParse(body);

    if (!success) {
        return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const updatedUser = await client.user.update({
        where: { id: user.id },
        data: { modelId: data.modelId, modelName: data.modelName },
    });

    await bot.sendMessage(
        Number(updatedUser.telegramId),
        `Your AI model has been updated to *${data.modelName}* 🥳`,
        { parse_mode: "Markdown" }
    );

    return NextResponse.json({ success: true, message: "Model saved successfully" });
}
