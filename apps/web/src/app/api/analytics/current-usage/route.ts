import { cookies } from "next/headers";
import { client } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const session = await client.session.findUnique({
        where: { token },
        select: { userId: true, expiresAt: true },
    });

    if (!session || session.expiresAt < new Date()) {
        return NextResponse.json({ message: "Session expired" }, { status: 401 });
    }

    const currentUsage = await client.userUsage.findFirst({
        where: { userId: session.userId },
        select: { tokenConsumed: true, user: { select: { subscriptionStatus: true, subscriptionTier: true } } },
    });

    return NextResponse.json({ data: currentUsage });
};