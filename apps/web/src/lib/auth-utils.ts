"use server";

import { client } from "@repo/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AuthUser = {
    id: string;
    telegramId: bigint;
    firstName: string;
    lastName: string | null;
    username: string | null;
    photoUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
};

async function getSessionUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return null;

    const session = await client.session.findUnique({
        where: { token },
        include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) return null;

    return session.user;
}

export const requireAuth = async () => {
    const user = await getSessionUser();
    if (!user) redirect("/sign-in");
    return user;
};

export const requireUnAuth = async () => {
    const user = await getSessionUser();
    if (user) redirect("/");
    return null;
};

export const redirectToHomeIfSession = async () => {
    const user = await getSessionUser();
    if (user) redirect("/home");
    return null;
};

export const currentUser = async () => {
    const user = await getSessionUser();
    if (!user) redirect("/sign-in");
    return user;
};

export const logout = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (token) {
        await client.session.deleteMany({ where: { token } });
        cookieStore.delete("session");
    }
};

