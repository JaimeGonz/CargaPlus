/*
  Warnings:

  - The `splitType` column on the `Program` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SplitType" AS ENUM ('FULL_BODY', 'UPPER_LOWER', 'PUSH_PULL_LEGS', 'BRO_SPLIT', 'HYBRID', 'OTHER');

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "splitType",
ADD COLUMN     "splitType" "SplitType";
