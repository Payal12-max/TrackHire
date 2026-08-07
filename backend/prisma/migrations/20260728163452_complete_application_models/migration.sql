/*
  Warnings:

  - The values [APPLIED,OA,INTERVIEW,OFFER,REJECTED] on the enum `Stage` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Stage_new" AS ENUM ('Wishlist', 'Applied', 'Screening', 'Interview_R1', 'Interview_R2', 'Offer', 'Rejected');
ALTER TABLE "public"."Application" ALTER COLUMN "currentStage" DROP DEFAULT;
ALTER TABLE "Application" ALTER COLUMN "currentStage" TYPE "Stage_new" USING ("currentStage"::text::"Stage_new");
ALTER TABLE "StageHistory" ALTER COLUMN "fromStage" TYPE "Stage_new" USING ("fromStage"::text::"Stage_new");
ALTER TABLE "StageHistory" ALTER COLUMN "toStage" TYPE "Stage_new" USING ("toStage"::text::"Stage_new");
ALTER TYPE "Stage" RENAME TO "Stage_old";
ALTER TYPE "Stage_new" RENAME TO "Stage";
DROP TYPE "public"."Stage_old";
ALTER TABLE "Application" ALTER COLUMN "currentStage" SET DEFAULT 'Wishlist';
COMMIT;

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "appliedAt" TIMESTAMP(3),
ALTER COLUMN "jobType" DROP NOT NULL,
ALTER COLUMN "jobType" DROP DEFAULT,
ALTER COLUMN "currentStage" SET DEFAULT 'Wishlist';

-- CreateTable
CREATE TABLE "InterviewQuestion" (
    "id" SERIAL NOT NULL,
    "interviewId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "notes" TEXT,

    CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiAnalysis" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "type" TEXT,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InterviewQuestion_interviewId_idx" ON "InterviewQuestion"("interviewId");

-- CreateIndex
CREATE INDEX "AiAnalysis_applicationId_idx" ON "AiAnalysis"("applicationId");

-- AddForeignKey
ALTER TABLE "InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAnalysis" ADD CONSTRAINT "AiAnalysis_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
