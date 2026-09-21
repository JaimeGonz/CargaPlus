/*
  Warnings:

  - A unique constraint covering the columns `[sessionId,exerciseId,order]` on the table `WorkoutSet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkoutSet_sessionId_exerciseId_order_key" ON "WorkoutSet"("sessionId", "exerciseId", "order");
