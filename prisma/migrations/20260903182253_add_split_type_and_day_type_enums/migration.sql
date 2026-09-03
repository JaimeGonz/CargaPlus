/*
  Warnings:

  - The `type` column on the `Routine` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DayType" AS ENUM ('PUSH', 'PULL', 'LEGS', 'UPPER', 'LOWER', 'FULL_BODY', 'SPECIALIZATION', 'OTHER');

-- AlterTable
ALTER TABLE "Routine" DROP COLUMN "type",
ADD COLUMN     "type" "DayType";
