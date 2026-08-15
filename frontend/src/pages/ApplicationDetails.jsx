import { useEffect } from "react";
import {
  ArrowLeft,
  ExternalLink,
  CalendarDays,
  MapPin,
  BriefcaseBusiness,
  Banknote,
  Globe,
  Clock3,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useApp } from "../context/AppContext";
import { LABELS } from "../constants";
import { formatDate } from "../utils/date";

import "./ApplicationDetails.css";

export default function ApplicationDetails() {
  const { id } = useParams();

  const {
    selected,
    openApp,
    error,
  } = useApp();

  useEffect(() => {
    if (id) {
      openApp(id);
    }
  }, [id]);

  if (!selected) {
    return (
      <div className="application-details-page">
        <div className="application-loading">
          <Clock3 size={20} />
          <span>Loading application...</span>

          {error && (
            <p>{error}</p>
          )}
        </div>
      </div>
    );
  }

  const stage =
    LABELS[selected.current_stage] ||
    selected.current_stage ||
    "Unknown";

  const companyInitial =
    selected.company?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="application-details-page">

      {/* BACK */}
      <Link
        to="/dashboard/applications"
        className="application-back-link"
      >
        <ArrowLeft size={16} />
        Back to Applications
      </Link>

      {/* ================= HEADER ================= */}

      <div className="application-details-header">

        <div className="application-company-avatar">
          {companyInitial}
        </div>

        <div className="application-header-info">
          <div className="application-title-row">

            <div>
              <h1>{selected.company}</h1>
              <p>{selected.role}</p>
            </div>

            <span
              className={`application-stage stage-${String(
                selected.current_stage || ""
              )
                .toLowerCase()
                .replace("_", "-")}`}
            >
              {stage}
            </span>

          </div>

          <div className="application-meta">
            {selected.location && (
              <span>
                <MapPin size={14} />
                {selected.location}
              </span>
            )}

            {selected.job_type && (
              <span>
                <BriefcaseBusiness size={14} />
                {selected.job_type}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* ================= DETAILS ================= */}

      <section className="application-section">

        <div className="section-heading">
          <div>
            <h2>Application Details</h2>
            <p>
              Important information about this opportunity.
            </p>
          </div>
        </div>

        <div className="application-details-grid">

          <DetailCard
            label="Company"
            value={selected.company}
          />

          <DetailCard
            label="Role"
            value={selected.role}
          />

          <DetailCard
            label="Stage"
            value={stage}
            highlight
          />

          <DetailCard
            label="Location"
            value={selected.location}
            icon={<MapPin size={15} />}
          />

          <DetailCard
            label="Job Type"
            value={selected.job_type}
            icon={<BriefcaseBusiness size={15} />}
          />

          <DetailCard
            label="Work Mode"
            value={selected.work_mode}
          />

          <DetailCard
            label="Source"
            value={selected.source}
            icon={<Globe size={15} />}
          />

          <DetailCard
            label="Salary / Stipend"
            value={selected.salary}
            icon={<Banknote size={15} />}
          />

          <DetailCard
            label="Deadline"
            value={formatDate(selected.deadline)}
            icon={<CalendarDays size={15} />}
            deadline
          />

        </div>

      </section>

      {/* ================= JOB POSTING ================= */}

      {selected.jd_link && (
        <section className="application-section">

          <div className="section-heading">
            <div>
              <h2>Job Posting</h2>
              <p>
                Open the original job listing for this application.
              </p>
            </div>
          </div>

          <div className="job-posting-card">

            <div className="job-posting-icon">
              <BriefcaseBusiness size={20} />
            </div>

            <div className="job-posting-content">
              <strong>
                {selected.company} — {selected.role}
              </strong>

              <span>
                View the original job posting and application
                requirements.
              </span>
            </div>

            <a
              href={selected.jd_link}
              target="_blank"
              rel="noreferrer"
              className="job-posting-button"
            >
              Open Job Posting
              <ExternalLink size={15} />
            </a>

          </div>

        </section>
      )}

      {/* ================= JOB DESCRIPTION ================= */}

      {selected.jd_text && (
        <section className="application-section">

          <div className="section-heading">
            <div>
              <h2>Job Description</h2>
              <p>
                Description saved when you added this application.
              </p>
            </div>
          </div>

          <div className="description-card">
            <p>{selected.jd_text}</p>
          </div>

        </section>
      )}

      {/* ================= NOTES ================= */}

      {selected.notes && (
        <section className="application-section">

          <div className="section-heading">
            <div>
              <h2>Notes</h2>
              <p>
                Your personal notes for this application.
              </p>
            </div>
          </div>

          <div className="notes-card">
            <p>{selected.notes}</p>
          </div>

        </section>
      )}

    </div>
  );
}


/* ================= HELPER ================= */

function DetailCard({
  label,
  value,
  icon,
  highlight,
  deadline,
}) {
  if (!value || value === "—") {
    return null;
  }

  return (
    <div
      className={`detail-card ${
        highlight ? "highlight-card" : ""
      } ${deadline ? "deadline-card" : ""}`}
    >
      <div className="detail-card-label">
        {icon}
        <span>{label}</span>
      </div>

      <strong>{value}</strong>
    </div>
  );
}