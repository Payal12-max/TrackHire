/*
  Warnings:

  - You are about to drop the column `answer` on the `InterviewQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `InterviewQuestion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "result" TEXT;

-- AlterTable
ALTER TABLE "InterviewQuestion" DROP COLUMN "answer",
DROP COLUMN "notes",
ADD COLUMN     "answerNotes" TEXT,
ADD COLUMN     "difficulty" INTEGER,
ADD COLUMN     "solved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "topic" TEXT;

-- CreateIndex
CREATE INDEX "Interview_scheduledAt_idx" ON "Interview"("scheduledAt");
