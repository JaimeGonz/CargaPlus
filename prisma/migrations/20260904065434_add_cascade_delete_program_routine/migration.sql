-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_programId_fkey";

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
