import { NextRequest } from "next/server";
import { client } from "@repo/db";

export async function getSessionUser(req: NextRequest) {
    const token = req.cookies.get("session")?.value;
    if (!token) return null;

    const session = await client.session.findUnique({
        where: { token },
        include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) return null;
    return session.user;
}
