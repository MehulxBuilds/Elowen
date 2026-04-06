"use client"

import { Check, X } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@repo/ui"
import { Button } from "@repo/ui"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useSearchParams, useRouter } from "next/navigation"
import { useMeQuery } from "@/hooks/use-me-query"

const PLAN_PRODUCT_IDS: Record<string, string | null> = {
    Basic: null, // Free tier, no checkout
    Pro: "25d47d4c-912b-47cb-ae73-0d4f2eb9175b",
    Enterprise: null, // Contact sales, handled separately
}

const TIER_TO_PLAN: Record<string, string> = {
    FREE: "Basic",
    PRO: "Pro",
    ENTERPRISE: "Enterprise",
}

const plans = [
    {
        name: "Basic",
        price: "$0",
        period: "/month",
        description: "Perfect for getting started",
        features: {
            availaible: [
                "10,000 tokens / day",
                "3 avatars",
                "Standard resolution",
                "Basic support",
                "API access",
            ],
            not_availaible: [
                "Advanced analytics",
                "Custom avatars",
                "SSO / SAML",
                "SLA guarantee",
            ],
        },
        cta: "Get Started",
        highlighted: false,
    },
    {
        name: "Pro",
        price: "$29",
        period: "/month",
        description: "Best for creators & teams",
        badge: "Popular",
        features: {
            availaible: [
                "100,000 tokens / day",
                "20 avatars",
                "High resolution",
                "Priority support",
                "API access",
                "Advanced analytics",
                "Custom avatars",
            ],
            not_availaible: [
                "SSO / SAML",
                "SLA guarantee",
            ],
        },
        cta: "Get Started",
        highlighted: true,
    },
    {
        name: "Enterprise",
        price: "$99",
        period: "/month",
        description: "For large-scale deployments",
        features: {
            availaible: [
                "Unlimited tokens",
                "Unlimited avatars",
                "4K resolution",
                "Dedicated support",
                "API access",
                "Advanced analytics",
                "Custom avatars",
                "SSO / SAML",
                "SLA guarantee",
            ],
            not_availaible: [],
        },
        cta: "Contact Sales",
        highlighted: false,
    },
]

export default function SubscriptionPage() {
    const [isLoading, setIsLoading] = useState(false)
    const searchParams = useSearchParams()
    const { data: user } = useMeQuery()

    const currentPlan = user ? TIER_TO_PLAN[user.subscriptionTier] ?? "Basic" : null

    const router = useRouter()

    useEffect(() => {
        if (searchParams.get("success") === "true") {
            (async () => {
                await new Promise(resolve => setTimeout(resolve, 2000))
                toast.success("Your subscription was successful!")
            })();
            router.replace("/dashboard/subscription")
        }
    }, [searchParams, router])

    const handleCheckout = async (planName: string) => {
        const productId = PLAN_PRODUCT_IDS[planName]
        if (!productId) {
            if (planName === "Basic") {
                toast.info("Basic tier is free! No checkout needed.")
            } else {
                toast.info("Please contact sales for Enterprise pricing.")
            }
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch(`/api/polar/checkout?productId=${productId}`)
            if (!res.ok) throw new Error("Failed to create checkout session")
            const data = await res.json()
            window.location.href = data.url
        } catch (error) {
            console.error("Checkout error:", error)
            toast.error("Failed to start checkout. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-8 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
                <p className="text-muted-foreground text-sm">
                    Choose the plan that fits your needs. Upgrade or downgrade at any time.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {plans.map((plan) => {
                    const isCurrentPlan = currentPlan === plan.name
                    return (
                        <Card
                            key={plan.name}
                            className={cn(
                                "relative flex flex-col",
                                plan.highlighted
                                    ? "border-orange-500 shadow-lg shadow-orange-400/20"
                                    : "",
                                isCurrentPlan
                                    ? "ring-2 ring-orange-500"
                                    : ""
                            )}
                        >
                            {plan.badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-lg shadow-white/10">
                                        {plan.badge}
                                    </span>
                                </div>
                            )}

                            <CardHeader className="flex flex-col gap-3 pt-6">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                                    {isCurrentPlan && (
                                        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full mx-2">
                                            Current Plan
                                        </span>
                                    )}
                                </div>
                                <CardDescription>{plan.description}</CardDescription>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <ul className="flex flex-col gap-2.5">
                                    {plan.features.availaible.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-primary shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                    {plan.features.not_availaible.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <X className="h-4 w-4" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className="w-full"
                                    variant={plan.highlighted ? "default" : "outline"}
                                    onClick={() => handleCheckout(plan.name)}
                                    disabled={isLoading || isCurrentPlan || plan.name === "Basic"}
                                >
                                    {isCurrentPlan ? "Current Plan" : isLoading ? "Loading..." : plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
};