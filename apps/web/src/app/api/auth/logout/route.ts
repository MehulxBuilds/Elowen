import { NextRequest, NextResponse } from "next/server";
import { client } from "@repo/db";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("session")?.value;

    if (token) {
        await client.session.deleteMany({ where: { token } });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.delete("session");
    return response;
}
