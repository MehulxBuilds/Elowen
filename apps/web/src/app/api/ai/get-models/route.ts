import { NextRequest, NextResponse } from "next/server";
import { server_env } from "@repo/env";
import { getSessionUser } from "@/lib/session";

export async function GET(req: NextRequest) {
    const user = await getSessionUser(req);
    if (!user) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
            Authorization: `Bearer ${server_env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
    }

    const data = await response.json() as { data: any[] };

    const models = data.data
        .filter((model) => {
            const promptPrice = parseFloat(model.pricing?.prompt || "0");
            const completionPrice = parseFloat(model.pricing?.completion || "0");
            return promptPrice === 0 && completionPrice === 0;
        })
        .map((model) => ({
            id: model.id,
            name: model.name,
            description: model.description,
            context_length: model.context_length,
            architecture: model.architecture,
            pricing: model.pricing,
            top_provider: model.top_provider,
        }));

    return NextResponse.json({ models });
}
