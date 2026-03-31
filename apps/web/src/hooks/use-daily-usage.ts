import { useQuery } from "@tanstack/react-query";

export type DailyUsageEntry = { date: string; tokens: number };

const fetchDailyUsage = async (year: number, month: number): Promise<DailyUsageEntry[]> => {
    const res = await fetch(`/api/analytics/daily-usage?year=${year}&month=${month}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
};

export const useDailyUsage = (year: number, month: number) =>
    useQuery({
        queryKey: ["daily-usage", year, month],
        queryFn: () => fetchDailyUsage(year, month),
        staleTime: 60_000,
    });
