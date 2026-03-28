"use client";

import { useState } from "react";
import { LogOut, Settings, CreditCard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@repo/ui";
import { Button } from "@repo/ui";
import { Badge } from "@repo/ui";
import { logout } from "@/lib/auth-utils";
import { useMeQuery } from "@/hooks/use-me-query";
import { useRouter } from "next/navigation";

interface UserButtonProps {
    onSettings?: () => void;
    onBilling?: () => void;
    showBadge?: boolean;
    badgeText?: string;
    badgeVariant?: "default" | "secondary" | "destructive" | "outline";
    size?: "sm" | "md" | "lg";
}

export default function UserButton({
    onSettings,
    onBilling,
    showBadge = false,
    badgeText = "Pro",
    badgeVariant = "default",
    size = "sm",
}: UserButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: user, isLoading: isFetching } = useMeQuery();

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout();
            router.push("/sign-in");
        } catch {
            // ignore
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = () => {
        if (user?.firstName) {
            const parts = [user.firstName, user.lastName].filter(Boolean);
            return parts.map((p) => p![0]).join("").toUpperCase().slice(0, 2);
        }
        return "U";
    };

    const displayName = user
        ? [user.firstName, user.lastName].filter(Boolean).join(" ")
        : null;

    const avatarSizes = { sm: "h-6 w-6", md: "h-7 w-7", lg: "h-12 w-12" };

    if (isFetching) {
        return <div className={`${avatarSizes[size]} rounded-full bg-muted animate-pulse`} />;
    }

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={`relative ${avatarSizes[size]} rounded-full p-0 hover:bg-accent`}
                    disabled={isLoading}
                >
                    <Avatar className={avatarSizes[size]}>
                        <AvatarImage src={user.photoUrl ?? ""} alt={displayName ?? "User"} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                            {getInitials()}
                        </AvatarFallback>
                    </Avatar>
                    {showBadge && (
                        <Badge
                            variant={badgeVariant}
                            className="absolute -bottom-1 -right-1 h-5 px-1 text-xs"
                        >
                            {badgeText}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center space-x-3 py-1">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user.photoUrl ?? ""} alt={displayName ?? "User"} />
                            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                                {getInitials()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-0.5">
                            <p className="text-sm font-medium leading-none">{displayName}</p>
                            {user.username && (
                                <p className="text-xs text-muted-foreground">@{user.username}</p>
                            )}
                            {showBadge && (
                                <Badge variant={badgeVariant} className="w-fit mt-1">
                                    {badgeText}
                                </Badge>
                            )}
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {onBilling && (
                    <DropdownMenuItem onClick={onBilling} className="cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Billing
                    </DropdownMenuItem>
                )}

                {onSettings && (
                    <DropdownMenuItem onClick={onSettings} className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="cursor-pointer text-destructive focus:text-destructive"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoading ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
