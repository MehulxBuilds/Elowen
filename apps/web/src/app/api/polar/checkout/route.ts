import { NextRequest, NextResponse } from "next/server";
import { polar } from "@/lib/polar";
import { getSessionUser } from "@/lib/session";
import { client } from "@repo/db";

export async function GET(req: NextRequest) {
    const user = await getSessionUser(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = req.nextUrl.searchParams.get("productId");
    if (!productId) {
        return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const successUrl = new URL(
        "/dashboard/subscription?success=true",
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ).toString();

    // Look up user's existing Polar customer ID to link checkout
    const dbUser = await client.user.findUnique({
        where: { id: user.id },
        select: { polarCustomerId: true, polarSubscriptionId: true },
    });

    const checkout = await polar.checkouts.create({
        products: [productId],
        successUrl,
        metadata: {
            userId: user.id,
        },
        ...(dbUser?.polarCustomerId ? { customerId: dbUser.polarCustomerId } : {}),
        ...(dbUser?.polarSubscriptionId ? { subscriptionId: dbUser.polarSubscriptionId } : {}),
    });

    return NextResponse.json({ url: checkout.url });
}
