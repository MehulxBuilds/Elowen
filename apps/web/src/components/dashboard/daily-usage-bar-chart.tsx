"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChevronLeft, ChevronRight } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@repo/ui"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@repo/ui"
import { useDailyUsage } from "@/hooks/use-daily-usage"

const chartConfig = {
    tokens: {
        label: "Tokens",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]

export function DailyUsageBarChart() {
    const now = new Date()
    const [year, setYear] = React.useState(now.getFullYear())
    const [month, setMonth] = React.useState(now.getMonth() + 1)

    const { data, isLoading } = useDailyUsage(year, month)

    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1

    const totalTokens = React.useMemo(
        () => (data ?? []).reduce((acc, d) => acc + d.tokens, 0),
        [data]
    )

    function prevMonth() {
        if (month === 1) {
            setYear(y => y - 1)
            setMonth(12)
        } else {
            setMonth(m => m - 1)
        }
    }

    function nextMonth() {
        if (isCurrentMonth) return
        if (month === 12) {
            setYear(y => y + 1)
            setMonth(1)
        } else {
            setMonth(m => m + 1)
        }
    }

    return (
        <Card className="py-0">
            <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-6">
                    <CardTitle>Daily Token Usage</CardTitle>
                    <CardDescription>
                        {MONTH_NAMES[month - 1]} {year}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 sm:border-l">
                    <div className="flex flex-col gap-0.5 text-right">
                        <span className="text-xs text-muted-foreground">Total this month</span>
                        <span className="text-2xl font-bold leading-none">
                            {totalTokens.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                        <button
                            onClick={prevMonth}
                            className="rounded-md p-1.5 hover:bg-muted transition-colors"
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={nextMonth}
                            disabled={isCurrentMonth}
                            className="rounded-md p-1.5 hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Next month"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                {isLoading ? (
                    <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                        Loading...
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={data ?? []}
                            margin={{ left: 12, right: 12 }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const d = new Date(value + "T00:00:00")
                                    return d.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(v) =>
                                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                                }
                                width={40}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        className="w-[160px]"
                                        nameKey="tokens"
                                        labelFormatter={(value) =>
                                            new Date(value + "T00:00:00").toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                        }
                                    />
                                }
                            />
                            <Bar dataKey="tokens" fill="var(--color-tokens)" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
