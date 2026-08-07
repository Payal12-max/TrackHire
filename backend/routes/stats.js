import { Router } from "express";
import prisma from "../src/lib/prisma.js";
import { STAGES } from "./applications.js";

const router = Router();

export const LABELS = {
  Wishlist: "Wishlist",
  Applied: "Applied",
  OA: "Online Assessment",
  Screening: "Screening",
  Interview_R1: "Interview Round 1",
  Interview_R2: "Interview Round 2",
  Offer: "Offer",
  Rejected: "Rejected",
};

router.get("/", async (req, res) => {
  try {
    const apps = await prisma.application.findMany({
      include: {
        stageHistory: true,
      },
    });

    const reminders = await prisma.reminder.findMany();

    const total = apps.length;

    const applied = apps.filter(
      (a) => a.currentStage !== "Wishlist"
    ).length;

    // Applications currently in each stage
    const byStage = {};

    STAGES.forEach((stage) => {
      byStage[stage] = apps.filter(
        (a) => a.currentStage === stage
      ).length;
    });

    // Number of unique applications that have ever reached each stage
    const reached = {};

    STAGES.forEach((stage) => {
      reached[stage] = new Set(
        apps
          .flatMap((a) => a.stageHistory)
          .filter((h) => h.toStage === stage)
          .map((h) => h.applicationId)
      ).size;
    });

    // Applications by source
    const sourceMap = {};

    apps.forEach((a) => {
      const key = a.source || "Unknown";
      sourceMap[key] = (sourceMap[key] || 0) + 1;
    });

    const bySource = Object.entries(sourceMap).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    // Applications by month
    const monthMap = {};

    apps.forEach((a) => {
      const date = a.appliedAt || a.createdAt;

      if (!date) return;

      const month = new Date(date)
        .toISOString()
        .slice(0, 7);

      monthMap[month] = (monthMap[month] || 0) + 1;
    });

    const monthly = Object.entries(monthMap)
      .map(([month, count]) => ({
        month,
        count,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Reminder stats
    const openReminders = reminders.filter(
      (r) => !r.completed
    ).length;

    const overdue = reminders.filter(
      (r) =>
        !r.completed &&
        r.dueAt &&
        new Date(r.dueAt) < new Date()
    ).length;

    res.json({
      total,
      applied,
      offers: byStage.Offer || 0,
      rejections: byStage.Rejected || 0,
      offerRate:
        applied > 0
          ? Math.round((byStage.Offer / applied) * 100)
          : 0,
      byStage,
      reached,
      bySource,
      monthly,
      openReminders,
      overdue,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to load stats",
    });
  }
});

export default router;