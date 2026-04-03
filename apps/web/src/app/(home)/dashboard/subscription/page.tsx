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
    return (
        <div className="flex flex-col gap-8 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
                <p className="text-muted-foreground text-sm">
                    Choose the plan that fits your needs. Upgrade or downgrade at any time.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {plans.map((plan) => (
                    <Card
                        key={plan.name}
                        className={cn(
                            "relative flex flex-col",
                            plan.highlighted
                                ? "border-primary shadow-lg shadow-primary/10"
                                : ""
                        )}
                    >
                        {plan.badge && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                                    {plan.badge}
                                </span>
                            </div>
                        )}

                        <CardHeader className="flex flex-col gap-3 pt-6">
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
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
                            >
                                {plan.cta}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
