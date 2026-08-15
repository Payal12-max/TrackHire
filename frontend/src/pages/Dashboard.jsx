import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Send,
  Trophy,
  XCircle,
  Clock3,
  CalendarDays,
  ArrowRight,
  Plus,
  TrendingUp,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const [statsData, appsData, remindersData] =
        await Promise.all([
          api.stats(),
          api.apps(),
          api.reminders(),
        ]);

      setStats(statsData);
      setApplications(appsData || []);
      setReminders(remindersData || []);
      setError("");
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <XCircle size={20} />
          <span>{error}</span>

          <button onClick={loadDashboard}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const total = stats?.total || applications.length || 0;
  const applied = stats?.applied || 0;
  const offers = stats?.offers || 0;
  const rejected = stats?.rejections || 0;
  const openReminders = stats?.openReminders || 0;

  const activeApplications = applications.filter(
    (application) =>
      application.current_stage !== "Offer" &&
      application.current_stage !== "Rejected"
  );

  const recentApplications = applications
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updated_at) -
        new Date(a.updated_at)
    )
    .slice(0, 5);

  const upcomingReminders = reminders
    .filter((reminder) => !reminder.completed)
    .sort(
      (a, b) =>
        new Date(a.due_at) -
        new Date(b.due_at)
    )
    .slice(0, 4);

  const stages = [
    "Wishlist",
    "Applied",
    "Screening",
    "OA",
    "Interview_R1",
    "Interview_R2",
    "Offer",
    "Rejected",
  ];

  const stageLabels = {
    Wishlist: "Wishlist",
    Applied: "Applied",
    Screening: "Screening",
    OA: "OA",
    Interview_R1: "Interview 1",
    Interview_R2: "Interview 2",
    Offer: "Offer",
    Rejected: "Rejected",
  };

  return (
    <div className="dashboard-page">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">

        <div>
          <p className="dashboard-eyebrow">
            JOB SEARCH OVERVIEW
          </p>

          <h1>Dashboard</h1>

          <p className="dashboard-subtitle">
            Keep track of your applications and stay on top
            of your job search.
          </p>
        </div>

        <Link
          to="/dashboard/applications/new"
          className="dashboard-add-btn"
        >
          <Plus size={17} />
          Add Application
        </Link>

      </div>

      {/* ================= STATS ================= */}

      <section className="dashboard-stats">

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon purple">
            <BriefcaseBusiness size={21} />
          </div>

          <div className="dashboard-stat-content">
            <span>Total Applications</span>
            <strong>{total}</strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon blue">
            <Send size={21} />
          </div>

          <div className="dashboard-stat-content">
            <span>Applications Sent</span>
            <strong>{applied}</strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon green">
            <Trophy size={21} />
          </div>

          <div className="dashboard-stat-content">
            <span>Offers</span>
            <strong>{offers}</strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon red">
            <XCircle size={21} />
          </div>

          <div className="dashboard-stat-content">
            <span>Rejected</span>
            <strong>{rejected}</strong>
          </div>
        </div>

      </section>

      {/* ================= MAIN GRID ================= */}

      <div className="dashboard-main-grid">

        {/* PIPELINE */}

        <section className="dashboard-panel pipeline-panel">

          <div className="dashboard-panel-header">

            <div>
              <h2>Application Pipeline</h2>
              <p>
                Your applications by current stage.
              </p>
            </div>

            <Link to="/dashboard/kanban">
              View Tracker
              <ArrowRight size={15} />
            </Link>

          </div>

          <div className="pipeline-list">

            {stages.map((stage) => {

              const count =
                stats?.byStage?.[stage] ??
                applications.filter(
                  (application) =>
                    application.current_stage === stage
                ).length;

              const maxCount = Math.max(
                total,
                1
              );

              const width =
                Math.max(
                  (count / maxCount) * 100,
                  count > 0 ? 5 : 0
                );

              return (
                <div
                  className="pipeline-row"
                  key={stage}
                >

                  <div className="pipeline-label">
                    <span>
                      {stageLabels[stage]}
                    </span>

                    <strong>
                      {count}
                    </strong>
                  </div>

                  <div className="pipeline-track">
                    <div
                      className={`pipeline-bar ${stage.toLowerCase()}`}
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>

                </div>
              );
            })}

          </div>

        </section>

        {/* UPCOMING REMINDERS */}

        <section className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>
              <h2>Upcoming</h2>
              <p>
                Your upcoming reminders.
              </p>
            </div>

            <Link to="/dashboard/calendar">
              Calendar
              <ArrowRight size={15} />
            </Link>

          </div>

          <div className="upcoming-list">

            {upcomingReminders.length === 0 ? (

              <div className="dashboard-empty">
                <CalendarDays size={28} />

                <p>
                  No upcoming reminders.
                </p>

                <Link to="/dashboard/calendar">
                  Open Calendar
                </Link>
              </div>

            ) : (

              upcomingReminders.map((reminder) => (

                <div
                  className="upcoming-item"
                  key={reminder.id}
                >

                  <div className="upcoming-icon">
                    <Clock3 size={18} />
                  </div>

                  <div className="upcoming-content">

                    <strong>
                      {reminder.title}
                    </strong>

                    <span>
                      {formatReminderDate(
                        reminder.due_at
                      )}
                    </span>

                  </div>

                </div>

              ))

            )}

          </div>

        </section>

      </div>

      {/* ================= RECENT APPLICATIONS ================= */}

      <section className="dashboard-panel recent-panel">

        <div className="dashboard-panel-header">

          <div>
            <h2>Recent Applications</h2>

            <p>
              Your latest application activity.
            </p>
          </div>

          <Link to="/dashboard/applications">
            View All
            <ArrowRight size={15} />
          </Link>

        </div>

        {recentApplications.length === 0 ? (

          <div className="dashboard-empty large">

            <BriefcaseBusiness size={32} />

            <h3>
              No applications yet
            </h3>

            <p>
              Add your first job or internship
              application to start tracking.
            </p>

            <Link
              to="/dashboard/applications/new"
              className="dashboard-add-btn"
            >
              <Plus size={16} />
              Add Application
            </Link>

          </div>

        ) : (

          <div className="recent-applications">

            <div className="recent-header">
              <span>Company</span>
              <span>Role</span>
              <span>Stage</span>
              <span>Updated</span>
            </div>

            {recentApplications.map(
              (application) => (

                <Link
                  key={application.id}
                  to={`/dashboard/applications/${application.id}`}
                  className="recent-row"
                >

                  <div className="company-info">

                    <div className="company-avatar">
                      {application.company
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <strong>
                      {application.company}
                    </strong>

                  </div>

                  <span className="application-role">
                    {application.role}
                  </span>

                  <span
                    className={`stage-badge ${getStageClass(
                      application.current_stage
                    )}`}
                  >
                    {stageLabels[
                      application.current_stage
                    ] ||
                      application.current_stage}
                  </span>

                  <span className="updated-date">
                    {formatDate(
                      application.updated_at
                    )}
                  </span>

                </Link>

              )
            )}

          </div>

        )}

      </section>

      {/* ================= BOTTOM CARDS ================= */}

      <section className="dashboard-bottom-grid">

        <div className="dashboard-mini-card">

          <div className="mini-icon purple">
            <BriefcaseBusiness size={20} />
          </div>

          <div>
            <span>Active Applications</span>

            <strong>
              {activeApplications.length}
            </strong>

            <small>
              Currently in your pipeline
            </small>
          </div>

        </div>

        <div className="dashboard-mini-card">

          <div className="mini-icon blue">
            <BellIcon />
          </div>

          <div>
            <span>Open Reminders</span>

            <strong>
              {openReminders}
            </strong>

            <small>
              Tasks waiting for you
            </small>
          </div>

        </div>

        <div className="dashboard-mini-card">

          <div className="mini-icon green">
            <TrendingUp size={20} />
          </div>

          <div>
            <span>Offer Rate</span>

            <strong>
              {stats?.offerRate || 0}%
            </strong>

            <small>
              Based on your applications
            </small>
          </div>

        </div>

      </section>

    </div>
  );
}


/* ================= HELPERS ================= */

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}


function formatReminderDate(value) {
  if (!value) return "No date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}


function getStageClass(stage) {
  return (
    "stage-" +
    String(stage || "")
      .toLowerCase()
      .replace("_", "-")
  );
}


function BellIcon() {
  return <Bell size={20} />;
}