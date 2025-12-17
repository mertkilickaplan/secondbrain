/*
  Warnings:

  - A unique constraint covering the columns `[sourceId,targetId]` on the table `Edge` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Edge_sourceId_targetId_key" ON "Edge"("sourceId", "targetId");
