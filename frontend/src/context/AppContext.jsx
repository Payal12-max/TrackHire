import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import { api, setApiTokenGetter } from "../api";
const AppContext = createContext(null);

export const emptyApplication = {
  company: "",
  role: "",
  jd_link: "",
  jd_text: "",
  location: "",
  job_type: "Internship",
  work_mode: "",
  source: "",
  salary: "",
  notes: "",
  deadline: "",
};

export const emptyReminder = {
  title: "",
  description: "",
  due_at: "",
  application_id: "",
};

export function AppProvider({ children }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [apps, setApps] = useState([]);
  const [stats, setStats] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [weekly, setWeekly] = useState(null);

  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null);

  const [form, setForm] = useState(emptyApplication);
  const [reminderForm, setReminderForm] = useState(emptyReminder);

  const [error, setError] = useState("");

  /* =====================================================
     LOAD ALL DATA
  ===================================================== */

  const load = async () => {
    try {
      const [a, s, r, i, c, w] = await Promise.all([
        api.apps(),
        api.stats(),
        api.reminders(),
        api.interviews(),
        api.companies(),
        api.weekly(),
      ]);

      setApps(a || []);
      setStats(s);
      setReminders(r || []);
      setInterviews(i || []);
      setCompanies(c || []);
      setWeekly(w);

      setError("");
    } catch (error) {
      console.error("Load error:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
  if (!isLoaded) return;

  if (!isSignedIn) {
    setApps([]);
    setStats(null);
    setReminders([]);
    setInterviews([]);
    setCompanies([]);
    setWeekly(null);
    return;
  }

  setApiTokenGetter(getToken);

  load();
}, [isLoaded, isSignedIn, getToken]);

  /* =====================================================
     APPLICATION
  ===================================================== */

  const openApp = async (id) => {
    try {
      const application = await api.app(id);

      setSelected(application);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const createApplication = async (event) => {
    event.preventDefault();

    try {
      await api.create(form);

      setForm(emptyApplication);

      await load();

      return true;
    } catch (error) {
      console.error("Create application failed:", error);
      setError(error.message);

      return false;
    }
  };

  const moveApplication = async (id, stage) => {
    try {
      await api.stage(id, stage);

      await load();
    } catch (error) {
      console.error("Move application failed:", error);
      alert(error.message);
    }
  };

  /* =====================================================
     REMINDER
  ===================================================== */

  const createReminder = async (event) => {
    event.preventDefault();

    try {
      console.log("Creating reminder:", reminderForm);

      const createdReminder = await api.createReminder(reminderForm);

      console.log("Created reminder:", createdReminder);

      // Update immediately
      if (createdReminder) {
        setReminders((prev) => [...prev, createdReminder]);
      }

      // Get fresh data from backend
      await load();

      // Reset form
      setReminderForm(emptyReminder);

      return true;
    } catch (error) {
      console.error("Create reminder failed:", error);

      setError(error.message);

      return false;
    }
  };

  /* =====================================================
     CONTEXT VALUE
  ===================================================== */

  const value = {
    apps,
    stats,
    reminders,
    interviews,
    companies,
    weekly,

    selected,
    modal,

    form,
    reminderForm,

    error,

    setSelected,
    setModal,

    setForm,
    setReminderForm,

    load,

    openApp,

    createApplication,
    moveApplication,

    createReminder,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/* =====================================================
   HOOK
===================================================== */

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
}