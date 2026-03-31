"use client";

import { useMeQuery } from "@/hooks/use-me-query";
import LogoutButton from "@/components/layout/logout-button";
import { useAvatar } from "@/components/use-create-avatar";
import { Button } from "@repo/ui";
import { LogOutIcon, UserIcon, AtSignIcon, BotIcon } from "lucide-react";

export default function ProfilePage() {
    const { data: me, isLoading } = useMeQuery();
    const avatarUrl = useAvatar(me?.firstName ?? "user");

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col min-h-0">
                {/* Hero skeleton */}
                <div className="h-64 bg-muted/30 animate-pulse" />
                {/* Rows skeleton */}
                <div className="flex-1 p-8 space-y-3 max-w-2xl w-full mx-auto">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-[72px] rounded-2xl bg-muted/30 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (!me) return null;

    const fullName = [me.firstName, me.lastName].filter(Boolean).join(" ");
    const photoSrc = me.photoUrl ?? avatarUrl;

    const rows = [
        { icon: UserIcon, label: "Full name", value: fullName },
        { icon: AtSignIcon, label: "Username", value: me.username ? `@${me.username}` : "Not set" },
        { icon: BotIcon, label: "AI model", value: me.modelName ?? "Not selected" },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-black font-sans text-zinc-300 flex flex-col items-center justify-center">

            {/* Background glows */}
            <div className="absolute z-0 -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600 blur-[150px] opacity-20 pointer-events-none" />
            <div className="absolute z-0 -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600 blur-[150px] opacity-20 pointer-events-none" />

            {/* Grid texture */}
            <div className="absolute z-0 inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

            {/* ── Hero ── */}
            <div className="relative z-10 flex flex-col items-center justify-end pb-10 pt-16 overflow-hidden">
                {/* Glow */}
                <div className="absolute pointer-events-none" />
                {/* Dot grid */}
                <div className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                {/* Avatar */}
                <div className="relative z-10 mb-5">
                    <img
                        src={photoSrc}
                        alt={fullName}
                        className="size-24 rounded-full object-cover ring-4 ring-white/10 shadow-2xl"
                    />
                    <span className="absolute bottom-0.5 right-0.5 size-4 rounded-full bg-emerald-500 ring-2 ring-background" />
                </div>

                <h1 className="relative z-10 text-3xl font-bold tracking-tight text-white">{fullName}</h1>
                <h1 className="relative z-10 text-[14px] font-medium text-neutral-400">The official account for telegram</h1>
                {me.username && (
                    <p className="relative z-10 text-sm text-white/50 mt-1">@{me.username}</p>
                )}
            </div>

            {/* ── Info ── */}
            <div className="relative z-10 flex-1 flex flex-col max-w-2xl w-full mx-auto px-6 py-8 gap-8">

                <div className="rounded-2xl border divide-y overflow-hidden bg-neutral-950">
                    {rows.map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted border shrink-0">
                                <Icon className="size-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground leading-none mb-1">
                                    {label}
                                </p>
                                <p className="text-sm font-medium truncate">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Logout */}
                <div className="flex items-center justify-between px-5 py-4 rounded-2xl border bg-neutral-950 hover:bg-neutral-900/80 transition-colors">
                    <div>
                        <p className="text-sm font-semibold">Sign out</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Logged in as {me.username ? `@${me.username}` : me.firstName}
                        </p>
                    </div>
                    <LogoutButton>
                        <Button variant="destructive" size="sm" className="gap-2 rounded-xl hover:bg-red-900/40 transition-color duration-200">
                            <LogOutIcon className="size-3.5" />
                            Log out
                        </Button>
                    </LogoutButton>
                </div>
            </div>
        </div>
    );
}
