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

    const { searchParams } = req.nextUrl;
    const year = parseInt(searchParams.get("year") ?? String(new Date().getUTCFullYear()));
    const month = parseInt(searchParams.get("month") ?? String(new Date().getUTCMonth() + 1));

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return NextResponse.json({ message: "Invalid year or month" }, { status: 400 });
    }

    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1)); // exclusive

    const rows = await client.userDailyUsage.findMany({
        where: { userId: session.userId, date: { gte: start, lt: end } },
        select: { date: true, tokenConsumed: true },
        orderBy: { date: "asc" },
    });

    // Build a full calendar for the month, filling 0 for missing days
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const byDay = new Map(
        rows.map((r) => [new Date(r.date).getUTCDate(), Number(r.tokenConsumed ?? 0)])
    );

    const data = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return { date, tokens: byDay.get(day) ?? 0 };
    });

    return NextResponse.json({ data });
}
