-- CreateTable
CREATE TABLE "ExecutionItem" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "taskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExecutionItem_taskId_idx" ON "ExecutionItem"("taskId");

-- AddForeignKey
ALTER TABLE "ExecutionItem" ADD CONSTRAINT "ExecutionItem_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
