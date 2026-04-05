import { Webhooks } from "@polar-sh/nextjs";
import { client, SubscriptionTier, SubscriptionStatus } from "@repo/db";

// Map Polar product IDs to subscription tiers
const PRODUCT_TIER_MAP: Record<string, SubscriptionTier> = {
    "25d47d4c-912b-47cb-ae73-0d4f2eb9175b": SubscriptionTier.PRO,
    // Add more product IDs as needed for Enterprise tier
};

export const POST = Webhooks({
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
    
    async onOrderCreated(payload) {
        console.log("Order created:", payload.data.id);

        const metadata = payload.data.metadata as { userId?: string };
        if (!metadata?.userId) {
            console.error("No userId in order metadata");
            return;
        }

        const userId = metadata.userId;
        const productId = payload.data.productId;
        const tier = (productId && PRODUCT_TIER_MAP[productId]) || SubscriptionTier.PRO;

        await client.user.update({
            where: { id: userId },
            data: {
                subscriptionTier: tier,
                subscriptionStatus: SubscriptionStatus.ACTIVE,
                polarCustomerId: payload.data.customerId,
                polarSubscriptionId: payload.data.subscriptionId,
            },
        });

        console.log(`User ${userId} upgraded to ${tier}`);
    },

    async onOrderUpdated(payload) {
        console.log("Order updated:", payload.data.id);
    },

    async onSubscriptionCreated(payload) {
        console.log("Subscription created:", payload.data.id);

        const metadata = payload.data.metadata as { userId?: string };
        if (!metadata?.userId) {
            console.error("No userId in subscription metadata");
            return;
        }

        const userId = metadata.userId;
        const productId = payload.data.productId;
        const tier = PRODUCT_TIER_MAP[productId] || SubscriptionTier.PRO;

        await client.user.update({
            where: { id: userId },
            data: {
                subscriptionTier: tier,
                subscriptionStatus: SubscriptionStatus.ACTIVE,
                polarCustomerId: payload.data.customerId,
                polarSubscriptionId: payload.data.id,
            },
        });

        console.log(`User ${userId} subscribed to ${tier}`);
    },

    async onSubscriptionUpdated(payload) {
        console.log("Subscription updated:", payload.data.id);

        const subscriptionId = payload.data.id;
        const status = payload.data.status;

        let subscriptionStatus: SubscriptionStatus;
        switch (status) {
            case "active":
                subscriptionStatus = SubscriptionStatus.ACTIVE;
                break;
            case "canceled":
                subscriptionStatus = SubscriptionStatus.CANCELED;
                break;
            case "incomplete":
            case "past_due":
            case "unpaid":
            default:
                subscriptionStatus = SubscriptionStatus.INACTIVE;
                break;
        }

        await client.user.update({
            where: { polarSubscriptionId: subscriptionId },
            data: {
                subscriptionStatus,
            },
        });

        console.log(`Subscription ${subscriptionId} updated to ${subscriptionStatus}`);
    },

    async onSubscriptionCanceled(payload) {
        console.log("Subscription canceled:", payload.data.id);

        const subscriptionId = payload.data.id;

        await client.user.update({
            where: { polarSubscriptionId: subscriptionId },
            data: {
                subscriptionStatus: SubscriptionStatus.CANCELED,
            },
        });

        console.log(`Subscription ${subscriptionId} canceled`);
    },

    async onCustomerStateChanged(payload) {
        console.log("Customer state changed:", payload.data.id);

        // Only mark inactive if the user currently has an active subscription in our DB
        // This prevents a race condition where this event fires before the subscription is provisioned
        const customerId = payload.data.id;
        const hasActiveSubscriptions = payload.data.activeSubscriptions.length > 0;

        if (!hasActiveSubscriptions) {
            const user = await client.user.findUnique({
                where: { polarCustomerId: customerId },
                select: { subscriptionStatus: true },
            });

            if (user?.subscriptionStatus === SubscriptionStatus.ACTIVE) {
                await client.user.update({
                    where: { polarCustomerId: customerId },
                    data: {
                        subscriptionStatus: SubscriptionStatus.INACTIVE,
                    },
                });

                console.log(`Customer ${customerId} has no active subscriptions, marked inactive`);
            }
        }
    },
});
