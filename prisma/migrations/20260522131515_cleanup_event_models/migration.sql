/*
  Warnings:

  - You are about to drop the column `createdAt` on the `EggProduction` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `FeedLog` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `FeedLog` table. All the data in the column will be lost.
  - You are about to drop the column `fedAt` on the `FeedLog` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Flock` table. All the data in the column will be lost.
  - You are about to drop the column `condition` on the `HealthRecord` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `HealthRecord` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `MortalityRecord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Flock` will be added. If there are existing duplicate values, this will fail.
  - Made the column `quantityKg` on table `FeedLog` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `diagnosis` to the `HealthRecord` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('FEED', 'MEDICATION', 'INVENTORY', 'LABOR', 'TRANSPORT', 'OTHER');

-- DropForeignKey
ALTER TABLE "Farm" DROP CONSTRAINT "Farm_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Flock" DROP CONSTRAINT "Flock_farmId_fkey";

-- AlterTable
ALTER TABLE "EggProduction" DROP COLUMN "createdAt",
ALTER COLUMN "recordedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "FeedLog" DROP COLUMN "cost",
DROP COLUMN "createdAt",
DROP COLUMN "fedAt",
ADD COLUMN     "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "quantityKg" SET NOT NULL;

-- AlterTable
ALTER TABLE "Flock" DROP COLUMN "notes";

-- AlterTable
ALTER TABLE "HealthRecord" DROP COLUMN "condition",
DROP COLUMN "createdAt",
ADD COLUMN     "diagnosis" TEXT NOT NULL,
ALTER COLUMN "medication" DROP NOT NULL,
ALTER COLUMN "recordedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MortalityRecord" DROP COLUMN "createdAt",
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "recordedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "flockId" TEXT,
    "type" "ExpenseType" NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlockNote" (
    "id" TEXT NOT NULL,
    "flockId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlockNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Expense_flockId_farmId_idx" ON "Expense"("flockId", "farmId");

-- CreateIndex
CREATE INDEX "FlockNote_flockId_recordedAt_idx" ON "FlockNote"("flockId", "recordedAt");

-- CreateIndex
CREATE INDEX "EggProduction_flockId_recordedAt_idx" ON "EggProduction"("flockId", "recordedAt");

-- CreateIndex
CREATE INDEX "FeedLog_flockId_recordedAt_idx" ON "FeedLog"("flockId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Flock_name_key" ON "Flock"("name");

-- CreateIndex
CREATE INDEX "HealthRecord_flockId_recordedAt_idx" ON "HealthRecord"("flockId", "recordedAt");

-- CreateIndex
CREATE INDEX "MortalityRecord_flockId_recordedAt_idx" ON "MortalityRecord"("flockId", "recordedAt");

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flock" ADD CONSTRAINT "Flock_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_flockId_fkey" FOREIGN KEY ("flockId") REFERENCES "Flock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlockNote" ADD CONSTRAINT "FlockNote_flockId_fkey" FOREIGN KEY ("flockId") REFERENCES "Flock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
