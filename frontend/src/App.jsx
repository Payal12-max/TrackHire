import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { STAGES, LABELS } from "./constants";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
const empty = {
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
export default function App() {
  const [page, setPage] = useState("Overview"),
    [apps, setApps] = useState([]),
    [stats, setStats] = useState(null),
    [reminders, setReminders] = useState([]),
    [interviews, setInterviews] = useState([]),
    [companies, setCompanies] = useState([]),
    [selected, setSelected] = useState(null),
    [modal, setModal] = useState(null),
    [form, setForm] = useState(empty),
    [error, setError] = useState(""),
    [weekly, setWeekly] = useState(null);
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
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const openApp = async (id) => setSelected(await api.app(id));
  const create = async (e) => {
    e.preventDefault();
    await api.create(form);
    setModal(null);
    setForm(empty);
    load();
  };
  const move = async (id, stage) => {
    try {
      await api.stage(id, stage);
      load();
    } catch (e) {
      alert(e.message);
    }
  };
  return (
    <div className="app">
      <aside>
        <div className="brand">
          <span>CAREER OPS</span>
          <h1>
            Application
            <br />
            Tracker
          </h1>
        </div>
        <nav>
          {[
            "Overview",
            "Kanban",
            "Applications",
            "Calendar",
            "Interviews",
            "Companies",
            "AI Insights",
          ].map((x) => (
            <button
              className={page === x ? "active" : ""}
              onClick={() => setPage(x)}
            >
              {x}
            </button>
          ))}
        </nav>
        <button className="add" onClick={() => setModal("application")}>
          + Add application
        </button>
      </aside>
      <main>
        <header>
          <div>
            <p>PERSONAL JOB SEARCH OPERATING SYSTEM</p>
            <h2>{page}</h2>
          </div>
          <div className="status">
            {apps.length} records • {stats?.openReminders || 0} actions
          </div>
        </header>
        {error && <div className="error">Backend error: {error}</div>}
        {page === "Overview" && (
          <Overview
            stats={stats}
            apps={apps}
            reminders={reminders}
            weekly={weekly}
          />
        )}{" "}
        {page === "Kanban" && (
          <Kanban apps={apps} move={move} openApp={openApp} />
        )}{" "}
        {page === "Applications" && (
          <Applications apps={apps} openApp={openApp} />
        )}{" "}
        {page === "Calendar" && (
          <Calendar
            reminders={reminders}
            apps={apps}
            setModal={setModal}
            setForm={setForm}
            load={load}
          />
        )}{" "}
        {page === "Interviews" && (
          <Interviews interviews={interviews} apps={apps} setModal={setModal} />
        )}{" "}
        {page === "Companies" && <Companies data={companies} />}{" "}
        {page === "AI Insights" && (
          <Insights weekly={weekly} apps={apps} openApp={openApp} />
        )}{" "}
      </main>
      {modal === "application" && (
        <Modal title="Add application" close={() => setModal(null)}>
          <ApplicationForm form={form} setForm={setForm} submit={create} />
        </Modal>
      )}
      {modal === "reminder" && (
        <ReminderForm apps={apps} close={() => setModal(null)} load={load} />
      )}{" "}
      {modal === "interview" && (
        <InterviewForm apps={apps} close={() => setModal(null)} load={load} />
      )}{" "}
      {selected && (
        <Detail
          data={selected}
          close={() => setSelected(null)}
          refresh={async () => setSelected(await api.app(selected.id))}
          load={load}
        />
      )}
    </div>
  );
}
function Overview({ stats, apps, reminders, weekly }) {
  if (!stats) return <p>Loading...</p>;
  const stage = Object.entries(stats.byStage).map(([name, value]) => ({
    name: LABELS[name],
    value,
  }));
  return (
    <>
      <section className="metrics">
        {[
          ["Applications", stats.applied],
          ["Offers", stats.offers],
          ["Offer rate", stats.offerRate + "%"],
          ["Open actions", stats.openReminders],
        ].map((x) => (
          <div className="metric">
            <span>{x[0]}</span>
            <strong>{x[1]}</strong>
          </div>
        ))}
      </section>
      <section className="grid2">
        <Card title="Pipeline">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stage}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#147d73" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Applications over time">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="count" stroke="#172033" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </section>
      <section className="grid2">
        <Card title="Next actions">
          {reminders
            .filter((x) => !x.completed)
            .slice(0, 6)
            .map((r) => (
              <div className="row">
                <b>{r.title}</b>
                <small>
                  {r.company} • {fmt(r.due_at)}
                </small>
              </div>
            )) || "No reminders"}
        </Card>
        <Card title="Weekly career insight">
          <p>{weekly?.summary}</p>
          {weekly?.actions?.map((a) => (
            <div className="action">→ {a}</div>
          ))}
        </Card>
      </section>
    </>
  );
}
function Kanban({ apps, move, openApp }) {
  return (
    <div className="kanban">
      {STAGES.map((stage) => (
        <div
          className="column"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => move(Number(e.dataTransfer.getData("id")), stage)}
        >
          <div className="colhead">
            <b>{LABELS[stage]}</b>
            <span>{apps.filter((a) => a.current_stage === stage).length}</span>
          </div>
          {apps
            .filter((a) => a.current_stage === stage)
            .map((a) => (
              <AppCard a={a} openApp={openApp} />
            ))}
        </div>
      ))}
    </div>
  );
}
function AppCard({ a, openApp }) {
  return (
    <article
      className="appcard"
      draggable
      onDragStart={(e) => e.dataTransfer.setData("id", a.id)}
      onClick={() => openApp(a.id)}
    >
      <small>{a.source || "Direct"}</small>
      <h3>{a.company}</h3>
      <p>{a.role}</p>
      <footer>
        <span>{a.location || "Location not set"}</span>
        <span>{days(a.updated_at)}d</span>
      </footer>
    </article>
  );
}
function Applications({ apps, openApp }) {
  return (
    <Card title="All applications">
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Stage</th>
            <th>Source</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((a) => (
            <tr onClick={() => openApp(a.id)}>
              <td>
                <b>{a.company}</b>
              </td>
              <td>{a.role}</td>
              <td>
                <span className="pill">{LABELS[a.current_stage]}</span>
              </td>
              <td>{a.source || "—"}</td>
              <td>{fmt(a.updated_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
function Calendar({ reminders, apps, setModal, load }) {
  return (
    <>
      <div className="toolbar">
        <button className="primary" onClick={() => setModal("reminder")}>
          + Add reminder
        </button>
      </div>
      <div className="calendarlist">
        {reminders.map((r) => (
          <div className={"event " + (r.completed ? "done" : "")}>
            <div className="datebox">
              <strong>{new Date(r.due_at).getDate()}</strong>
              <span>
                {new Date(r.due_at).toLocaleString("en-US", { month: "short" })}
              </span>
            </div>
            <div>
              <h3>{r.title}</h3>
              <p>
                {r.company} • {r.role} • {r.type}
              </p>
            </div>
            <button
              onClick={async () => {
                await api.updateReminder(r.id, {
                  completed: r.completed ? 0 : 1,
                });
                load();
              }}
            >
              {r.completed ? "Undo" : "Complete"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
function Interviews({ interviews, setModal }) {
  return (
    <>
      <div className="toolbar">
        <button className="primary" onClick={() => setModal("interview")}>
          + Add interview record
        </button>
      </div>
      <div className="cards">
        {interviews.map((i) => (
          <Card title={`${i.company} — ${i.round_name}`}>
            <p>{i.role}</p>
            <div className="tag">{i.interview_type || "Interview"}</div>
            <p>{fmt(i.scheduled_at)}</p>
            <p>{i.reflection || "No reflection yet."}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
function Companies({ data }) {
  return (
    <div className="cards">
      {data.map((c) => (
        <Card title={c.company}>
          <div className="companynums">
            <b>
              {c.applications}
              <small>Applications</small>
            </b>
            <b>
              {c.interviews}
              <small>Interviews</small>
            </b>
            <b>
              {c.offers}
              <small>Offers</small>
            </b>
          </div>
          <p>Last activity: {fmt(c.last_activity)}</p>
        </Card>
      ))}
    </div>
  );
}
function Insights({ weekly, apps, openApp }) {
  return (
    <>
      <Card title="Weekly AI career insights">
        <h3>{weekly?.summary}</h3>
        {weekly?.actions?.map((a) => (
          <div className="action">✓ {a}</div>
        ))}
        <p className="muted">
          This starter includes deterministic local insights. Connect an AI
          provider in backend/routes/ai.js for production.
        </p>
      </Card>
      <Card title="Applications ready for analysis">
        {apps
          .filter((a) => a.jd_text)
          .map((a) => (
            <div className="row click" onClick={() => openApp(a.id)}>
              <b>
                {a.company} — {a.role}
              </b>
              <small>Open to generate job summary or resume match</small>
            </div>
          ))}
      </Card>
    </>
  );
}
function Detail({ data, close, refresh, load }) {
  const [resume, setResume] = useState(""),
    [result, setResult] = useState(null);
  return (
    <div className="drawerback" onClick={close}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={close}>
          ×
        </button>
        <small>{LABELS[data.current_stage]}</small>
        <h2>{data.company}</h2>
        <h3>{data.role}</h3>
        <div className="details">
          <p>
            <b>Location:</b> {data.location || "—"}
          </p>
          <p>
            <b>Source:</b> {data.source || "—"}
          </p>
          <p>
            <b>Deadline:</b> {fmt(data.deadline)}
          </p>
          <p>
            <b>Notes:</b> {data.notes || "—"}
          </p>
        </div>
        <h3>Timeline</h3>
        {data.history.map((h) => (
          <div className="timeline">
            <i></i>
            <div>
              <b>{LABELS[h.to_stage]}</b>
              <small>
                {fmt(h.changed_at)} {h.note && "• " + h.note}
              </small>
            </div>
          </div>
        ))}
        <h3>AI tools</h3>
        <button
          className="primary"
          disabled={!data.jd_text}
          onClick={async () =>
            setResult(
              await api.jobSummary({
                application_id: data.id,
                text: data.jd_text,
              }),
            )
          }
        >
          Generate job summary
        </button>
        <textarea
          placeholder="Paste resume text for match score"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />
        <button
          className="primary"
          disabled={!resume || !data.jd_text}
          onClick={async () =>
            setResult(
              await api.resumeMatch({
                application_id: data.id,
                resume_text: resume,
                job_text: data.jd_text,
              }),
            )
          }
        >
          Calculate resume match
        </button>
        {result && (
          <pre className="result">{JSON.stringify(result, null, 2)}</pre>
        )}
        <button
          className="danger"
          onClick={async () => {
            if (confirm("Delete this application?")) {
              await api.remove(data.id);
              close();
              load();
            }
          }}
        >
          Delete application
        </button>
      </aside>
    </div>
  );
}
function ApplicationForm({ form, setForm, submit }) {
  return (
    <form onSubmit={submit}>
      <div className="formgrid">
        {[
          ["company", "Company *"],
          ["role", "Role *"],
          ["location", "Location"],
          ["source", "Source"],
          ["job_type", "Job type"],
          ["work_mode", "Work mode"],
          ["salary", "Salary / stipend"],
          ["deadline", "Deadline"],
        ].map(([k, l]) => (
          <label>
            {l}
            <input
              type={k === "deadline" ? "datetime-local" : "text"}
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              required={k === "company" || k === "role"}
            />
          </label>
        ))}
      </div>
      <label>
        Job link
        <input
          value={form.jd_link}
          onChange={(e) => setForm({ ...form, jd_link: e.target.value })}
        />
      </label>
      <label>
        Job description
        <textarea
          value={form.jd_text}
          onChange={(e) => setForm({ ...form, jd_text: e.target.value })}
        />
      </label>
      <label>
        Notes
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </label>
      <button className="primary">Create application</button>
    </form>
  );
}
function ReminderForm({ apps, close, load }) {
  const [f, setF] = useState({
    application_id: apps[0]?.id || "",
    title: "Follow up",
    type: "Follow-up",
    due_at: "",
  });
  return (
    <Modal title="Add reminder" close={close}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await api.addReminder(f);
          close();
          load();
        }}
      >
        <label>
          Application
          <select
            value={f.application_id}
            onChange={(e) => setF({ ...f, application_id: e.target.value })}
          >
            {apps.map((a) => (
              <option value={a.id}>
                {a.company} — {a.role}
              </option>
            ))}
          </select>
        </label>
        <label>
          Title
          <input
            value={f.title}
            onChange={(e) => setF({ ...f, title: e.target.value })}
          />
        </label>
        <label>
          Type
          <select
            value={f.type}
            onChange={(e) => setF({ ...f, type: e.target.value })}
          >
            <option>Follow-up</option>
            <option>Interview</option>
            <option>OA Deadline</option>
            <option>Application Deadline</option>
            <option>Custom</option>
          </select>
        </label>
        <label>
          Due at
          <input
            type="datetime-local"
            value={f.due_at}
            onChange={(e) => setF({ ...f, due_at: e.target.value })}
          />
        </label>
        <button className="primary">Save reminder</button>
      </form>
    </Modal>
  );
}
function InterviewForm({ apps, close, load }) {
  const [f, setF] = useState({
    application_id: apps[0]?.id || "",
    round_name: "Technical Round 1",
    interview_type: "DSA",
    scheduled_at: "",
    difficulty: 3,
    performance: 3,
    reflection: "",
  });
  return (
    <Modal title="Interview journal" close={close}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await api.addInterview(f);
          close();
          load();
        }}
      >
        <label>
          Application
          <select
            value={f.application_id}
            onChange={(e) => setF({ ...f, application_id: e.target.value })}
          >
            {apps.map((a) => (
              <option value={a.id}>
                {a.company} — {a.role}
              </option>
            ))}
          </select>
        </label>
        {[
          "round_name",
          "interview_type",
          "scheduled_at",
          "difficulty",
          "performance",
          "reflection",
        ].map((k) => (
          <label>
            {k.replaceAll("_", " ")}
            {k === "reflection" ? (
              <textarea
                value={f[k]}
                onChange={(e) => setF({ ...f, [k]: e.target.value })}
              />
            ) : (
              <input
                type={
                  k === "scheduled_at"
                    ? "datetime-local"
                    : k === "difficulty" || k === "performance"
                      ? "number"
                      : "text"
                }
                min="1"
                max="5"
                value={f[k]}
                onChange={(e) => setF({ ...f, [k]: e.target.value })}
              />
            )}
          </label>
        ))}
        <button className="primary">Save interview</button>
      </form>
    </Modal>
  );
}
function Modal({ title, close, children }) {
  return (
    <div className="modalback" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={close}>
          ×
        </button>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
function Card({ title, children }) {
  return (
    <section className="card">
      <div className="cardtitle">{title}</div>
      {children}
    </section>
  );
}
const fmt = (x) =>
  x
    ? new Date(x.replace?.(" ", "T") || x).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
const days = (x) =>
  Math.max(
    0,
    Math.floor((Date.now() - new Date(x.replace(" ", "T"))) / 86400000),
  );
