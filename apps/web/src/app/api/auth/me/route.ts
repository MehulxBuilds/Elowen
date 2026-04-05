import { cookies } from "next/headers";
import { client } from "@repo/db";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const session = await client.session.findUnique({
        where: { token },
        include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
        return NextResponse.json({ message: "Session expired or invalid" }, { status: 401 });
    }

    const { user } = session;
    return NextResponse.json({
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            photoUrl: user.photoUrl,
            modelId: user.modelId,
            modelName: user.modelName,
            subscriptionTier: user.subscriptionTier,
            subscriptionStatus: user.subscriptionStatus,
        },
    });
}
