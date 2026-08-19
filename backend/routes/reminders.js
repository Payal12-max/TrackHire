import { Router } from "express";
import { getAuth } from "@clerk/express";
import prisma from "../src/lib/prisma.js";

const router = Router();

function parseDate(value) {
  if (!value) return null;

  const d = new Date(value);

  return Number.isNaN(d.getTime()) ? null : d;
}

/*
=========================================================
GET REMINDERS
Only reminders belonging to logged-in user
=========================================================
*/
router.get("/", async (req, res) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated || !userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const reminders = await prisma.reminder.findMany({
      where: {
        application: {
          userId,
        },
      },

      include: {
        application: {
          select: {
            company: true,
            role: true,
          },
        },
      },

      orderBy: [
        {
          completed: "asc",
        },
        {
          dueAt: "asc",
        },
      ],
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
      }))
    );
  } catch (err) {
    console.error("GET reminders error:", err);

    res.status(500).json({
      error: "Failed to fetch reminders",
    });
  }
});

/*
=========================================================
CREATE REMINDER
Application must belong to logged-in user
=========================================================
*/
router.post("/", async (req, res) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated || !userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const b = req.body;

    if (!b.application_id || !b.title || !b.due_at) {
      return res.status(400).json({
        error: "application_id, title and due_at required",
      });
    }

    const applicationId = Number(b.application_id);

    if (!Number.isInteger(applicationId)) {
      return res.status(400).json({
        error: "Invalid application id",
      });
    }

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!application) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    const dueAt = parseDate(b.due_at);

    if (!dueAt) {
      return res.status(400).json({
        error: "Invalid due_at date",
      });
    }

    const reminder = await prisma.reminder.create({
      data: {
        applicationId,
        title: b.title,
        type: b.type || "Follow-up",
        dueAt,
        notes: b.notes || null,
      },
    });

    res.status(201).json(reminder);
  } catch (err) {
    console.error("POST reminder error:", err);

    res.status(500).json({
      error: "Failed to create reminder",
    });
  }
});

/*
=========================================================
UPDATE REMINDER
Only reminder belonging to logged-in user
=========================================================
*/
router.patch("/:id", async (req, res) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated || !userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "Invalid reminder id",
      });
    }

    const old = await prisma.reminder.findFirst({
      where: {
        id,
        application: {
          userId,
        },
      },
    });

    if (!old) {
      return res.status(404).json({
        error: "Reminder not found",
      });
    }

    let dueAt = old.dueAt;

    if (req.body.due_at !== undefined) {
      dueAt = parseDate(req.body.due_at);

      if (!dueAt) {
        return res.status(400).json({
          error: "Invalid due_at date",
        });
      }
    }

    const updatedReminder = await prisma.reminder.update({
      where: {
        id,
      },

      data: {
        title:
          req.body.title !== undefined
            ? req.body.title
            : old.title,

        type:
          req.body.type !== undefined
            ? req.body.type
            : old.type,

        dueAt,

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

/*
=========================================================
DELETE REMINDER
=========================================================
*/
router.delete("/:id", async (req, res) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated || !userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "Invalid reminder id",
      });
    }

    const existing = await prisma.reminder.findFirst({
      where: {
        id,
        application: {
          userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return res.status(404).json({
        error: "Reminder not found",
      });
    }

    await prisma.reminder.delete({
      where: {
        id,
      },
    });

    res.status(204).send();
  } catch (err) {
    console.error("DELETE reminder error:", err);

    res.status(500).json({
      error: "Failed to delete reminder",
    });
  }
});

export default router;