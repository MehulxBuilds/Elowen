import { useQuery } from "@tanstack/react-query";

const fetchCurrentTierUsage = async () => {
    const res = await fetch(`/api/analytics/current-usage`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
};

export const useCurrentTierUsage = () =>
    useQuery({
        queryKey: ["user-usage"],
        queryFn: () => fetchCurrentTierUsage(),
        staleTime: 60_000,
    });
