const BASE =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function req(path, options = {}) {
  const response = await fetch(BASE + path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.error || errorData.message || "Request failed"
    );
  }

  return response.status === 204 ? null : response.json();
}

export const api = {
  // =========================
  // APPLICATIONS
  // =========================

  apps: () => req("/applications"),

  app: (id) => req(`/applications/${id}`),

  create: (data) =>
    req("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    req(`/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  stage: (id, to_stage) =>
    req(`/applications/${id}/stage`, {
      method: "PATCH",
      body: JSON.stringify({ to_stage }),
    }),

  remove: (id) =>
    req(`/applications/${id}`, {
      method: "DELETE",
    }),

  // =========================
  // STATS
  // =========================

  stats: () => req("/stats"),

  // =========================
  // REMINDERS
  // =========================

  reminders: () => req("/reminders"),

  createReminder: (data) =>
    req("/reminders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  addReminder: (data) =>
    req("/reminders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateReminder: (id, data) =>
    req(`/reminders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  removeReminder: (id) =>
    req(`/reminders/${id}`, {
      method: "DELETE",
    }),

  // =========================
  // INTERVIEWS
  // =========================

  interviews: () => req("/interviews"),

  addInterview: (data) =>
    req("/interviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateInterview: (id, data) =>
    req(`/interviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  removeInterview: (id) =>
    req(`/interviews/${id}`, {
      method: "DELETE",
    }),

  // =========================
  // COMPANIES
  // =========================

  companies: () => req("/companies"),

  // =========================
  // AI
  // =========================

  jobSummary: (data) =>
    req("/ai/job-summary", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resumeMatch: (data) =>
    req("/ai/resume-match", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  weekly: () => req("/ai/weekly"),
};