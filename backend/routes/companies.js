import { Router } from "express";
import prisma from "../src/lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      select: {
        company: true,
        currentStage: true,
        updatedAt: true,
      },
    });

    const companyMap = {};

    for (const application of applications) {
      const company = application.company;

      if (!companyMap[company]) {
        companyMap[company] = {
          company,
          applications: 0,
          interviews: 0,
          offers: 0,
          last_activity: application.updatedAt,
        };
      }

      companyMap[company].applications += 1;

      if (
        ["Interview_R1", "Interview_R2", "Offer"].includes(
          application.currentStage,
        )
      ) {
        companyMap[company].interviews += 1;
      }

      if (application.currentStage === "Offer") {
        companyMap[company].offers += 1;
      }

      if (
        new Date(application.updatedAt) >
        new Date(companyMap[company].last_activity)
      ) {
        companyMap[company].last_activity = application.updatedAt;
      }
    }

    const companies = Object.values(companyMap).sort((a, b) => {
      if (b.applications !== a.applications) {
        return b.applications - a.applications;
      }

      return a.company.localeCompare(b.company);
    });

    res.json(companies);
  } catch (error) {
    console.error("GET companies error:", error);

    res.status(500).json({
      error: "Failed to fetch companies",
    });
  }
});

export default router;