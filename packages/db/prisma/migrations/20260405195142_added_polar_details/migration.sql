/*
  Warnings:

  - A unique constraint covering the columns `[polarCustomerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[polarSubscriptionId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "polarCustomerId" TEXT,
ADD COLUMN     "polarSubscriptionId" TEXT,
ADD COLUMN     "subscriptionStatus" "SubscriptionStatus",
ADD COLUMN     "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'FREE';

-- CreateIndex
CREATE UNIQUE INDEX "User_polarCustomerId_key" ON "User"("polarCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_polarSubscriptionId_key" ON "User"("polarSubscriptionId");
