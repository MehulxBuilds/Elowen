export { client } from "./db";
export type * from "@prisma/client";
export { Prisma, SubscriptionTier, SubscriptionStatus } from "@prisma/client";

import { Prisma } from "@prisma/client";
export const Decimal = Prisma.Decimal;