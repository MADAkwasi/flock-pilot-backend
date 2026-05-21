/*
  Warnings:

  - You are about to drop the column `quantity` on the `Flock` table. All the data in the column will be lost.
  - Added the required column `currentCount` to the `Flock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flockType` to the `Flock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialCount` to the `Flock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Flock` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FlockType" AS ENUM ('BROILER', 'LAYER');

-- CreateEnum
CREATE TYPE "FlockStatus" AS ENUM ('ACTIVE', 'SOLD', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Flock" DROP COLUMN "quantity",
ADD COLUMN     "currentCount" INTEGER NOT NULL,
ADD COLUMN     "flockType" "FlockType" NOT NULL,
ADD COLUMN     "initialCount" INTEGER NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "FlockStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "Flock_farmId_idx" ON "Flock"("farmId");
