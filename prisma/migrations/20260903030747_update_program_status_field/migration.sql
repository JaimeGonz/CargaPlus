/*
  Warnings:

  - You are about to drop the column `isActive` on the `Program` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('ACTIVE', 'AVAILABLE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "isActive",
ADD COLUMN     "status" "ProgramStatus" NOT NULL DEFAULT 'AVAILABLE';
