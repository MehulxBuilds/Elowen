"use client";

import { Toaster } from "@repo/ui";
import QueryProvider from "./query-client";
import { ThemeProvider } from "./theme-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
                <Toaster position="top-right" />
            </ThemeProvider>
        </QueryProvider>
    );
};

export default Providers;