import { Router } from "express";
import prisma from "../src/lib/prisma.js";

const router = Router();

const skills = [
  "React",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Express",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Git",
  "REST APIs",
  "Data Structures",
  "Python",
  "Machine Learning",
];

async function save(applicationId, analysisType, result) {
  const analysis = await prisma.aiAnalysis.create({
    data: {
      applicationId: Number(applicationId),
      analysisType,
      result,
    },
  });

  return {
    ...result,
    analysisId: analysis.id,
  };
}

router.post("/job-summary", async (req, res) => {
  try {
    const { application_id, text } = req.body;

    if (!application_id || !text)
      return res
        .status(400)
        .json({ error: "application_id and text required" });

    const found = skills.filter((skill) =>
      text.toLowerCase().includes(skill.toLowerCase())
    );

    const result = {
      summary:
        text
          .split(/[.!?]/)
          .filter(Boolean)
          .slice(0, 2)
          .join(". ") + ".",

      requiredSkills: found.slice(0, 8),

      responsibilities: text
        .split(/\n|•|-/)
        .map((x) => x.trim())
        .filter((x) => x.length > 25)
        .slice(0, 5),

      experience:
        (text.match(/\d+[+\-]?\s*(?:years?|yrs?)/i) || [
          "Not clearly specified",
        ])[0],

      note:
        "Demo analysis uses local keyword extraction. Add an AI provider key for production-quality results.",
    };

    res.json(await save(application_id, "JOB_SUMMARY", result));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

router.post("/resume-match", async (req, res) => {
  try {
    const { application_id, resume_text, job_text } = req.body;

    if (!application_id || !resume_text || !job_text)
      return res.status(400).json({
        error: "application_id, resume_text and job_text required",
      });

    const required = skills.filter((skill) =>
      job_text.toLowerCase().includes(skill.toLowerCase())
    );

    const matched = required.filter((skill) =>
      resume_text.toLowerCase().includes(skill.toLowerCase())
    );

    const missing = required.filter((skill) => !matched.includes(skill));

    const score = required.length
      ? Math.round((matched.length / required.length) * 100)
      : 65;

    const result = {
      overallScore: score,
      strongMatches: matched,
      missingOrUnclear: missing,
      recommendations: missing.slice(0, 4).map(
        (x) =>
          `Only add ${x} if you have genuine experience; otherwise strengthen related project evidence.`
      ),
      note: "Explainable demo score based on skill overlap.",
    };

    res.json(await save(application_id, "RESUME_MATCH", result));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

router.get("/weekly", async (req, res) => {
  try {
    const applications = await prisma.application.findMany();
    const reminders = await prisma.reminder.findMany();
    const interviews = await prisma.interview.findMany();

    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);

    const stats = {
      applicationsThisWeek: applications.filter(
        (a) => new Date(a.createdAt) >= weekAgo
      ).length,

      followUps: reminders.filter(
        (r) =>
          !r.completed &&
          new Date(r.dueAt) <= nextWeek
      ).length,

      interviews: interviews.filter(
        (i) =>
          i.scheduledAt &&
          new Date(i.scheduledAt) >= weekAgo
      ).length,
    };

    res.json({
      stats,
      summary: `You added ${stats.applicationsThisWeek} applications this week and have ${stats.followUps} upcoming or overdue actions.`,
      actions: [
        "Complete urgent reminders",
        "Review applications inactive for seven days",
        "Record interview reflections while details are fresh",
      ],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate weekly summary" });
  }
});

export default router;