import { Router } from "express";
import { getAuth } from "@clerk/express";
import prisma from "../src/lib/prisma.js";

const router = Router();

export const STAGES = [
  "Wishlist",
  "Applied",
  "Screening",
  "OA",
  "Interview_R1",
  "Interview_R2",
  "Offer",
  "Rejected",
];

const TERMINAL = ["Offer", "Rejected"];

function parseDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function formatApplication(app) {
  if (!app) return app;

  return {
    id: app.id,
    user_id: app.userId,
    company: app.company,
    role: app.role,
    jd_link: app.jdLink,
    jd_text: app.jdText,
    location: app.location,
    job_type: app.jobType,
    work_mode: app.workMode,
    source: app.source,
    salary: app.salary,
    notes: app.notes,
    current_stage: app.currentStage,
    applied_at: app.appliedAt,
    deadline: app.deadline,
    created_at: app.createdAt,
    updated_at: app.updatedAt,
  };
}

function formatHistory(item) {
  return {
    id: item.id,
    application_id: item.applicationId,
    from_stage: item.fromStage,
    to_stage: item.toStage,
    note: item.note,
    changed_at: item.changedAt,
  };
}

function formatReminder(item) {
  return {
    id: item.id,
    application_id: item.applicationId,
    title: item.title,
    type: item.type,
    due_at: item.dueAt,
    completed: item.completed,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

function formatInterview(item) {
  return {
    id: item.id,
    application_id: item.applicationId,
    round_name: item.roundName,
    interview_type: item.interviewType,
    scheduled_at: item.scheduledAt,
    difficulty: item.difficulty,
    performance: item.performance,
    reflection: item.reflection,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
    questions: item.questions ?? [],
  };
}

function formatAnalysis(item) {
  return {
    id: item.id,
    application_id: item.applicationId,
    result: item.result,
    created_at: item.createdAt,
  };
}

/*
=========================================================
GET ALL APPLICATIONS
Only return applications belonging to logged-in Clerk user
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

    const applications = await prisma.application.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.json(applications.map(formatApplication));
  } catch (error) {
    console.error("GET applications error:", error);

    res.status(500).json({
      error: "Failed to fetch applications",
    });
  }
});

/*
=========================================================
GET SINGLE APPLICATION
Must belong to logged-in user
=========================================================
*/
router.get("/:id", async (req, res) => {
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
        error: "Invalid application id",
      });
    }

    const app = await prisma.application.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        stageHistory: {
          orderBy: {
            changedAt: "desc",
          },
        },
        reminders: {
          orderBy: {
            dueAt: "asc",
          },
        },
        interviews: {
          orderBy: {
            scheduledAt: "desc",
          },
          include: {
            questions: true,
          },
        },
        analyses: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!app) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    res.json({
      ...formatApplication(app),
      history: app.stageHistory.map(formatHistory),
      reminders: app.reminders.map(formatReminder),
      interviews: app.interviews.map(formatInterview),
      analyses: app.analyses.map(formatAnalysis),
    });
  } catch (error) {
    console.error("GET application error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

/*
=========================================================
CREATE APPLICATION
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

    if (!b.company?.trim() || !b.role?.trim()) {
      return res.status(400).json({
        error: "company and role are required",
      });
    }

    const stage = b.current_stage || "Wishlist";

    if (!STAGES.includes(stage)) {
      return res.status(400).json({
        error: "Invalid stage",
      });
    }

    const user = await prisma.user.upsert({
      where: {
        id: userId,
      },
      update: {},
      create: {
        id: userId,
      },
    });

    const application = await prisma.application.create({
      data: {
        userId: user.id,

        company: b.company.trim(),
        role: b.role.trim(),

        jdLink: b.jd_link || null,
        jdText: b.jd_text || null,
        location: b.location || null,
        jobType: b.job_type || null,
        workMode: b.work_mode || null,
        source: b.source || null,
        salary: b.salary || null,
        notes: b.notes || null,

        currentStage: stage,

        appliedAt: parseDate(b.applied_at),
        deadline: parseDate(b.deadline),

        stageHistory: {
          create: {
            fromStage: null,
            toStage: stage,
            note: "Application created",
          },
        },
      },
    });

    res.status(201).json(formatApplication(application));
  } catch (error) {
    console.error("POST application error:", error);

    res.status(500).json({
      error: "Failed to create application",
    });
  }
});

/*
=========================================================
MOVE APPLICATION STAGE
=========================================================
*/
router.patch("/:id/stage", async (req, res) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated || !userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const id = Number(req.params.id);
    const { to_stage, note } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "Invalid application id",
      });
    }

    if (!STAGES.includes(to_stage)) {
      return res.status(400).json({
        error: "Invalid stage",
      });
    }

    const existing = await prisma.application.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    if (existing.currentStage === to_stage) {
      return res.json(formatApplication(existing));
    }

    if (TERMINAL.includes(existing.currentStage)) {
      return res.status(400).json({
        error: `Cannot move out of terminal stage ${existing.currentStage}`,
      });
    }

    const currentStageIndex = STAGES.indexOf(existing.currentStage);
    const targetStageIndex = STAGES.indexOf(to_stage);

    if (targetStageIndex < currentStageIndex) {
      return res.status(400).json({
        error: "Cannot move an application to a previous stage.",
      });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const application = await tx.application.update({
        where: {
          id,
        },
        data: {
          currentStage: to_stage,
          appliedAt:
            to_stage === "Applied" && !existing.appliedAt
              ? new Date()
              : existing.appliedAt,
        },
      });

      await tx.stageHistory.create({
        data: {
          applicationId: id,
          fromStage: existing.currentStage,
          toStage: to_stage,
          note: note || null,
        },
      });

      return application;
    });

    res.json(formatApplication(updated));
  } catch (error) {
    console.error("PATCH stage error:", error);

    res.status(500).json({
      error: "Failed to update stage",
    });
  }
});

/*
=========================================================
UPDATE APPLICATION
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
    const b = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "Invalid application id",
      });
    }

    const existing = await prisma.application.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    const application = await prisma.application.update({
      where: {
        id,
      },
      data: {
        company:
          b.company !== undefined ? b.company.trim() : existing.company,

        role:
          b.role !== undefined ? b.role.trim() : existing.role,

        jdLink:
          b.jd_link !== undefined ? b.jd_link || null : existing.jdLink,

        jdText:
          b.jd_text !== undefined ? b.jd_text || null : existing.jdText,

        location:
          b.location !== undefined ? b.location || null : existing.location,

        jobType:
          b.job_type !== undefined ? b.job_type || null : existing.jobType,

        workMode:
          b.work_mode !== undefined ? b.work_mode || null : existing.workMode,

        source:
          b.source !== undefined ? b.source || null : existing.source,

        salary:
          b.salary !== undefined ? b.salary || null : existing.salary,

        notes:
          b.notes !== undefined ? b.notes || null : existing.notes,

        appliedAt:
          b.applied_at !== undefined
            ? parseDate(b.applied_at)
            : existing.appliedAt,

        deadline:
          b.deadline !== undefined
            ? parseDate(b.deadline)
            : existing.deadline,
      },
    });

    res.json(formatApplication(application));
  } catch (error) {
    console.error("PATCH application error:", error);

    res.status(500).json({
      error: "Failed to update application",
    });
  }
});

/*
=========================================================
DELETE APPLICATION
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
        error: "Invalid application id",
      });
    }

    const existing = await prisma.application.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    await prisma.application.delete({
      where: {
        id,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("DELETE application error:", error);

    res.status(500).json({
      error: "Failed to delete application",
    });
  }
});

export default router;