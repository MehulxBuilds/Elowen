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
import { useCurrentTierUsage } from "@/hooks/use-user-usage"

const TIER_LIMITS: Record<string, number> = {
  FREE: 10_000,
  PRO: 100_000,
  ENTERPRISE: Infinity,
}

const TIER_COLORS: Record<string, string> = {
  FREE: "#eab308",
  PRO: "#22c55e",
  ENTERPRISE: "#3b82f6",
}

const chartConfig = {
  tokens: {
    label: "Tokens",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function CurrentTierChartRadial() {
  const { data, isLoading } = useCurrentTierUsage()

  const tier = data?.user?.subscriptionTier || "FREE"
  const tierLabel = tier.slice(0, 1) + tier.slice(1).toLowerCase()
  const tokenConsumed = Number(data?.tokenConsumed || 0)
  const dailyLimit = TIER_LIMITS[tier] || TIER_LIMITS.FREE

  const pct = dailyLimit === Infinity ? 0 : Math.min(tokenConsumed / dailyLimit, 1)
  const endAngle = 90 - Math.max(pct, 0.005) * 360

  const chartData = [{ tokens: tokenConsumed, fill: TIER_COLORS[tier] || TIER_COLORS.FREE }]

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Current Tier</CardTitle>
        <CardDescription>
          <span
            className="inline-block rounded-md px-2 py-0.5 text-center text-xs font-semibold"
            style={{
              color: TIER_COLORS[tier],
              backgroundColor: `${TIER_COLORS[tier]}20`,
            }}
          >
            {tierLabel}
          </span>
        </CardDescription>
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
                            {tokenConsumed >= 1000
                              ? `${(tokenConsumed / 1000).toFixed(1)}k`
                              : tokenConsumed.toLocaleString()}
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
          {dailyLimit === Infinity
            ? "Unlimited tokens"
            : `${Math.max(dailyLimit - tokenConsumed, 0).toLocaleString()} tokens remaining`}
        </div>
        <div className="leading-none text-muted-foreground px-4">
          {dailyLimit === Infinity
            ? "Enterprise tier — no daily limit"
            : `${Math.round(pct * 100)}% of ${tierLabel} daily limit has been used`}
        </div>
      </CardFooter>
    </Card>
  )
}
