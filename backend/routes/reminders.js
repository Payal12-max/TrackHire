import { Router } from "express";
import prisma from "../src/lib/prisma.js";

const router = Router();

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d) ? null : d;
}

router.get("/", async (req, res) => {
  try {
    const reminders = await prisma.reminder.findMany({
      include: {
        application: {
          select: {
            company: true,
            role: true,
          },
        },
      },
      orderBy: [{ completed: "asc" }, { dueAt: "asc" }],
    });

    res.json(
      reminders.map((r) => ({
        id: r.id,
        application_id: r.applicationId,
        title: r.title,
        type: r.type,
        due_at: r.dueAt,
        notes: r.notes,
        completed: r.completed,
        company: r.application.company,
        role: r.application.role,
      })),
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});

router.post("/", async (req, res) => {
  try {
    const b = req.body;

    if (!b.application_id || !b.title || !b.due_at)
      return res.status(400).json({
        error: "application_id, title and due_at required",
      });

    const reminder = await prisma.reminder.create({
      data: {
        applicationId: Number(b.application_id),
        title: b.title,
        type: b.type || "Follow-up",
        dueAt: parseDate(b.due_at),
        notes: b.notes || null,
      },
    });

    res.status(201).json(reminder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create reminder" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "Invalid reminder id",
      });
    }

    const old = await prisma.reminder.findUnique({
      where: { id },
    });

    if (!old) {
      return res.status(404).json({
        error: "Reminder not found",
      });
    }

    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: {
        title:
          req.body.title !== undefined
            ? req.body.title
            : old.title,

        type:
          req.body.type !== undefined
            ? req.body.type
            : old.type,

        dueAt:
          req.body.due_at !== undefined
            ? parseDate(req.body.due_at)
            : old.dueAt,

        notes:
          req.body.notes !== undefined
            ? req.body.notes
            : old.notes,

        completed:
          req.body.completed !== undefined
            ? Boolean(req.body.completed)
            : old.completed,
      },
    });

    console.log(
      `Reminder ${id} updated. Completed:`,
      updatedReminder.completed
    );

    res.json(updatedReminder);
  } catch (err) {
    console.error("PATCH reminder error:", err);

    res.status(500).json({
      error: "Update failed",
    });
  }
});

export default router;
