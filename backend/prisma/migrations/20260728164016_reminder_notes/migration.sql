-- DropIndex
DROP INDEX "Reminder_applicationId_idx";

-- DropIndex
DROP INDEX "Reminder_dueAt_idx";

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "notes" TEXT;
