import { Router } from "express";
import prisma from "../src/lib/prisma.js";

const router = Router();

function parseDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function formatQuestion(question) {
  return {
    id: question.id,
    interview_id: question.interviewId,
    question: question.question,
    topic: question.topic,
    difficulty: question.difficulty,
    solved: question.solved,
    answer_notes: question.answerNotes,
  };
}

function formatInterview(interview) {
  return {
    id: interview.id,
    application_id: interview.applicationId,
    round_name: interview.roundName,
    interview_type: interview.interviewType,
    scheduled_at: interview.scheduledAt,
    difficulty: interview.difficulty,
    performance: interview.performance,
    result: interview.result,
    reflection: interview.reflection,
    created_at: interview.createdAt,
    updated_at: interview.updatedAt,

    company: interview.application?.company,
    role: interview.application?.role,

    questions: interview.questions?.map(formatQuestion) || [],
  };
}

router.get("/", async (req, res) => {
  try {
    const interviews = await prisma.interview.findMany({
      include: {
        application: {
          select: {
            company: true,
            role: true,
          },
        },
        questions: true,
      },
      orderBy: {
        scheduledAt: {
          sort: "desc",
          nulls: "last",
        },
      },
    });

    res.json(interviews.map(formatInterview));
  } catch (error) {
    console.error("GET interviews error:", error);

    res.status(500).json({
      error: "Failed to fetch interviews",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const b = req.body;
    const applicationId = Number(b.application_id);

    if (!Number.isInteger(applicationId) || !b.round_name?.trim()) {
      return res.status(400).json({
        error: "application_id and round_name required",
      });
    }

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
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

    const scheduledAt = parseDate(b.scheduled_at);

    if (b.scheduled_at && !scheduledAt) {
      return res.status(400).json({
        error: "Invalid scheduled_at date",
      });
    }

    const questions = Array.isArray(b.questions)
      ? b.questions
          .filter((question) => question.question?.trim())
          .map((question) => ({
            question: question.question.trim(),
            topic: question.topic || null,
            difficulty:
              question.difficulty !== undefined &&
              question.difficulty !== null
                ? Number(question.difficulty)
                : null,
            solved: Boolean(question.solved),
            answerNotes: question.answer_notes || null,
          }))
      : [];

    const interview = await prisma.interview.create({
      data: {
        applicationId,
        roundName: b.round_name.trim(),
        interviewType: b.interview_type || null,
        scheduledAt,
        difficulty:
          b.difficulty !== undefined && b.difficulty !== null
            ? Number(b.difficulty)
            : null,
        performance:
          b.performance !== undefined && b.performance !== null
            ? Number(b.performance)
            : null,
        result: b.result || null,
        reflection: b.reflection || null,

        questions: {
          create: questions,
        },
      },
      include: {
        application: {
          select: {
            company: true,
            role: true,
          },
        },
        questions: true,
      },
    });

    res.status(201).json(formatInterview(interview));
  } catch (error) {
    console.error("POST interview error:", error);

    res.status(500).json({
      error: "Failed to create interview",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "Invalid interview id",
      });
    }

    const existing = await prisma.interview.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return res.status(404).json({
        error: "Interview not found",
      });
    }

    await prisma.interview.delete({
      where: {
        id,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("DELETE interview error:", error);

    res.status(500).json({
      error: "Failed to delete interview",
    });
  }
});

export default router;