-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "url" TEXT,
    "title" TEXT,
    "summary" TEXT,
    "topics" TEXT,
    "tags" TEXT,
    "embedding" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'processing'
);

-- CreateTable
CREATE TABLE "Edge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "similarity" REAL NOT NULL,
    "explanation" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Edge_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Edge_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Edge_sourceId_idx" ON "Edge"("sourceId");

-- CreateIndex
CREATE INDEX "Edge_targetId_idx" ON "Edge"("targetId");

