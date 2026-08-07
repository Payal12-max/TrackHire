const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
async function req(path, options = {}) {
  const r = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error(e.error || "Request failed");
  }
  return r.status === 204 ? null : r.json();
}
export const api = {
  apps: () => req("/applications"),
  app: (id) => req(`/applications/${id}`),
  create: (b) =>
    req("/applications", { method: "POST", body: JSON.stringify(b) }),
  update: (id, b) =>
    req(`/applications/${id}`, { method: "PATCH", body: JSON.stringify(b) }),
  stage: (id, to_stage) =>
    req(`/applications/${id}/stage`, {
      method: "PATCH",
      body: JSON.stringify({ to_stage }),
    }),
  remove: (id) => req(`/applications/${id}`, { method: "DELETE" }),
  stats: () => req("/stats"),
  reminders: () => req("/reminders"),
  addReminder: (b) =>
    req("/reminders", { method: "POST", body: JSON.stringify(b) }),
  updateReminder: (id, b) =>
    req(`/reminders/${id}`, { method: "PATCH", body: JSON.stringify(b) }),
  interviews: () => req("/interviews"),
  addInterview: (b) =>
    req("/interviews", { method: "POST", body: JSON.stringify(b) }),
  companies: () => req("/companies"),
  jobSummary: (b) =>
    req("/ai/job-summary", { method: "POST", body: JSON.stringify(b) }),
  resumeMatch: (b) =>
    req("/ai/resume-match", { method: "POST", body: JSON.stringify(b) }),
  weekly: () => req("/ai/weekly"),
};
