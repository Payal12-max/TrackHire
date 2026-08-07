import express from "express";
import cors from "cors";

import applicationRoutes from "./routes/applications.js";
import reminderRoutes from "./routes/reminders.js";
import interviewRoutes from "./routes/interviews.js";
import companyRoutes from "./routes/companies.js";
import statsRoutes from "./routes/stats.js";
import aiRoutes from "./routes/ai.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/applications", applicationRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    database: "Neon PostgreSQL",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});