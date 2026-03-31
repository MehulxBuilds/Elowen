"use client"

import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@repo/ui"
import { ChartContainer, type ChartConfig } from "@repo/ui"
import { useDailyUsage } from "@/hooks/use-daily-usage"

const DAILY_LIMIT = 10_000

const chartConfig = {
    tokens: {
        label: "Tokens",
        color: "#f4500a",
    },
} satisfies ChartConfig

export function DailyUsageRadialChart() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const todayStr = `${year}-${String(month).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

    const { data, isLoading } = useDailyUsage(year, month)

    const todayTokens = data?.find((d) => d.date === todayStr)?.tokens || 0;
    const pct = Math.min(todayTokens / DAILY_LIMIT, 1)
    const endAngle = 90 - Math.max(pct, 0.005) * 360

    const remaining = Math.max(DAILY_LIMIT - todayTokens, 0)
    const isExceeded = todayTokens > DAILY_LIMIT

    const chartData = [{ tokens: todayTokens, fill: "var(--color-tokens)" }]

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Today&apos;s Usage</CardTitle>
                <CardDescription>Daily limit: {DAILY_LIMIT.toLocaleString()} tokens</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {isLoading ? (
                    <div className="flex aspect-square max-h-[250px] mx-auto items-center justify-center text-sm text-muted-foreground">
                        Loading...
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                    >
                        <RadialBarChart
                            data={chartData}
                            startAngle={90}
                            endAngle={endAngle}
                            innerRadius={65}
                            outerRadius={95}
                        >
                            <PolarGrid
                                gridType="circle"
                                radialLines={false}
                                stroke="none"
                                className="first:fill-muted last:fill-background"
                                polarRadius={[86, 74]}
                            />
                            <RadialBar dataKey="tokens" background />
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-4xl font-bold"
                                                    >
                                                        {todayTokens >= 1000
                                                            ? `${(todayTokens / 1000).toFixed(1)}k`
                                                            : todayTokens.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        tokens used
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </PolarRadiusAxis>
                        </RadialBarChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
               <div className="flex items-center gap-2 leading-none font-medium">
                    {isExceeded
                        ? `${(todayTokens - DAILY_LIMIT).toLocaleString()} tokens over limit`
                        : `${remaining.toLocaleString()} tokens remaining`}
                </div>
                <div className="leading-none text-muted-foreground px-8">
                    {Math.round(pct * 100)}% of daily limit has been used
                </div>
            </CardFooter>
        </Card>
    )
}
