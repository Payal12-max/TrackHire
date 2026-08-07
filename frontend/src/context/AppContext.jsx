import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "../api";

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

export function AppProvider({ children }) {
  const [apps, setApps] = useState([]);
  const [stats, setStats] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [weekly, setWeekly] = useState(null);

  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyApplication);
  const [error, setError] = useState("");

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

      setApps(a);
      setStats(s);
      setReminders(r);
      setInterviews(i);
      setCompanies(c);
      setWeekly(w);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openApp = async (id) => {
    try {
      const application = await api.app(id);
      setSelected(application);
    } catch (error) {
      setError(error.message);
    }
  };

  const createApplication = async (event) => {
    event.preventDefault();

    try {
      await api.create(form);
      setModal(null);
      setForm(emptyApplication);
      await load();
    } catch (error) {
      setError(error.message);
    }
  };

  const moveApplication = async (id, stage) => {
    try {
      await api.stage(id, stage);
      await load();
    } catch (error) {
      alert(error.message);
    }
  };

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
    error,

    setSelected,
    setModal,
    setForm,

    load,
    openApp,
    createApplication,
    moveApplication,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
}