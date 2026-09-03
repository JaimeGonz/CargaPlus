/*
  Warnings:

  - You are about to drop the column `isActive` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `weeklyFrequency` on the `Routine` table. All the data in the column will be lost.
  - Added the required column `programId` to the `Routine` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SetType" AS ENUM ('NORMAL', 'WARMUP', 'DROPSET', 'FAILURE', 'OTHER');

-- AlterTable
ALTER TABLE "Routine" DROP COLUMN "isActive",
DROP COLUMN "weeklyFrequency",
ADD COLUMN     "dayOfWeek" INTEGER,
ADD COLUMN     "programId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WorkoutSet" ADD COLUMN     "setType" "SetType" NOT NULL DEFAULT 'NORMAL';

-- CreateTable
CREATE TABLE "Program" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "splitType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
