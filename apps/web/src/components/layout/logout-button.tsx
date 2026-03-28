"use client";

import { logout } from "@/lib/auth-utils";
import { useRouter } from "next/navigation";
import React from "react";

const LogoutButton = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/sign-in");
    };

    return (
        <span className={className} onClick={handleLogout}>
            {children}
        </span>
    );
};

export default LogoutButton;
