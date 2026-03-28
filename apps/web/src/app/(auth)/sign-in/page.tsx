"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
declare global {
    interface Window {
        onTelegramAuth: (user: Record<string, string>) => void;
    }
}

export default function SignInPage() {
    const router = useRouter();
    const widgetRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
        if (!botUsername) return;

        window.onTelegramAuth = async (user) => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/auth/telegram`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(user),
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.message ?? "Authentication failed");
                }

                router.push("/dashboard");
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Something went wrong");
                setLoading(false);
            }
        };

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute("data-telegram-login", botUsername);
        script.setAttribute("data-size", "large");
        script.setAttribute("data-onauth", "onTelegramAuth(user)");
        script.setAttribute("data-request-access", "write");
        script.setAttribute("data-radius", "12");

        widgetRef.current?.appendChild(script);

        return () => {
            delete (window as Partial<Window>).onTelegramAuth;
        };
    }, [router]);

    return (
        <div className="relative min-h-screen overflow-hidden bg-black font-sans text-zinc-300 flex items-center justify-center">
            {/* Background glows */}
            <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-orange-600 blur-[150px] opacity-20 pointer-events-none" />
            <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-red-600 blur-[150px] opacity-20 pointer-events-none" />

            {/* Grid texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)]" />

            <div className="relative z-10 w-full max-w-sm mx-auto px-6 flex flex-col items-center gap-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 40 40">
                        <path fill="#F06225" d="M20 0c11.046 0 20 8.954 20 20v14a6 6 0 0 1-6 6H21v-8.774c0-2.002.122-4.076 1.172-5.78a10 10 0 0 1 6.904-4.627l.383-.062a.8.8 0 0 0 0-1.514l-.383-.062a10 10 0 0 1-8.257-8.257l-.062-.383a.8.8 0 0 0-1.514 0l-.062.383a9.999 9.999 0 0 1-4.627 6.904C12.85 18.878 10.776 19 8.774 19H.024C.547 8.419 9.29 0 20 0Z" />
                        <path fill="#F06225" d="M0 21h8.774c2.002 0 4.076.122 5.78 1.172a10.02 10.02 0 0 1 3.274 3.274C18.878 27.15 19 29.224 19 31.226V40H6a6 6 0 0 1-6-6V21ZM40 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                    </svg>
                    <span className="text-2xl font-bold tracking-tight text-white">Elowen</span>
                </div>

                {/* Card */}
                <div className="w-full bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 mb-2">
                            Welcome back
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Sign in with your Telegram account to continue.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center gap-5 text-sm text-zinc-400 py-3">
                            <svg className="animate-spin h-4 w-4 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            <p>
                                Signing you in...
                            </p>
                        </div>
                    ) : (
                        <div ref={widgetRef} />
                    )}

                    {error && (
                        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 text-center">
                            {error}
                        </p>
                    )}
                </div>

                <p className="text-xs text-zinc-600 text-center">
                    By signing in, you agree to our terms of service.
                </p>
            </div>
        </div>
    );
}
