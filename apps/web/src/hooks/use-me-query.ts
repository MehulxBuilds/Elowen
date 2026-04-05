import { useQuery } from "@tanstack/react-query";

export type MeUser = {
    id: string;
    firstName: string;
    lastName: string | null;
    username: string | null;
    photoUrl: string | null;
    modelId: string | null;
    modelName: string | null;
    subscriptionTier: "FREE" | "PRO" | "ENTERPRISE";
    subscriptionStatus: "ACTIVE" | "INACTIVE" | "CANCELED" | null;
};

const fetchMe = async (): Promise<MeUser | null> => {
    const res = await fetch(`/api/auth/me`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
};

export const useMeQuery = () =>
    useQuery({
        queryKey: ["me"],
        queryFn: fetchMe,
        staleTime: 60_000,
        retry: false,
    });
