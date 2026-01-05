/*
  Warnings:

  - Changed the type of `paymentProvider` on the `Policy` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `paymentStatus` on the `Policy` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `kind` on the `PolicyDocument` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `PolicyEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('DRAFT', 'PAID', 'ACTIVE', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "DocumentKind" AS ENUM ('PROPOSAL', 'CERTIFICATE', 'TERMS');

-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('SUPABASE', 'R2');

-- CreateEnum
CREATE TYPE "PolicyEventType" AS ENUM ('POLICY_CREATED', 'PAYMENT_CONFIRMED', 'DOCS_GENERATED', 'EMAIL_SENT', 'FINALIZE_RETRIED');

-- AlterTable
ALTER TABLE "Policy" ADD COLUMN     "status" "PolicyStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "stripePaymentIntentId" TEXT,
DROP COLUMN "paymentProvider",
ADD COLUMN     "paymentProvider" "PaymentProvider" NOT NULL,
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL;

-- AlterTable
ALTER TABLE "PolicyDocument" ADD COLUMN     "storageProvider" "StorageProvider" NOT NULL DEFAULT 'SUPABASE',
DROP COLUMN "kind",
ADD COLUMN     "kind" "DocumentKind" NOT NULL;

-- AlterTable
ALTER TABLE "PolicyEvent" DROP COLUMN "type",
ADD COLUMN     "type" "PolicyEventType" NOT NULL;

-- CreateIndex
CREATE INDEX "Policy_email_idx" ON "Policy"("email");

-- CreateIndex
CREATE INDEX "Policy_vrm_idx" ON "Policy"("vrm");

-- CreateIndex
CREATE INDEX "Policy_startAt_idx" ON "Policy"("startAt");

-- CreateIndex
CREATE UNIQUE INDEX "Policy_paymentProvider_paymentId_key" ON "Policy"("paymentProvider", "paymentId");

-- CreateIndex
CREATE INDEX "PolicyDocument_policyId_idx" ON "PolicyDocument"("policyId");

-- CreateIndex
CREATE INDEX "PolicyDocument_kind_idx" ON "PolicyDocument"("kind");

-- CreateIndex
CREATE INDEX "PolicyEvent_policyId_idx" ON "PolicyEvent"("policyId");

-- CreateIndex
CREATE INDEX "PolicyEvent_type_idx" ON "PolicyEvent"("type");
