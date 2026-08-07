import { useState } from "react";
import { api } from "../api";
import { LABELS } from "../constants";
import { formatDate } from "../utils/date";

function Detail({ data, close, load }) {
  const [resume, setResume] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    try {
      setLoading(true);

      const response = await api.jobSummary({
        application_id: data.id,
        text: data.jd_text,
      });

      setResult(response);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateResumeMatch = async () => {
    try {
      setLoading(true);

      const response = await api.resumeMatch({
        application_id: data.id,
        resume_text: resume,
        job_text: data.jd_text,
      });

      setResult(response);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async () => {
    const shouldDelete = window.confirm(
      "Delete this application?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await api.remove(data.id);
      close();
      await load();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="drawerback" onClick={close}>
      <aside
        className="drawer"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="x" onClick={close}>
          ×
        </button>

        <small>
          {LABELS[data.current_stage] ||
            data.current_stage}
        </small>

        <h2>{data.company}</h2>
        <h3>{data.role}</h3>

        <div className="details">
          <p>
            <b>Location:</b>{" "}
            {data.location || "—"}
          </p>

          <p>
            <b>Source:</b> {data.source || "—"}
          </p>

          <p>
            <b>Deadline:</b>{" "}
            {formatDate(data.deadline)}
          </p>

          <p>
            <b>Notes:</b> {data.notes || "—"}
          </p>
        </div>

        <h3>Timeline</h3>

        {data.history?.length > 0 ? (
          data.history.map((historyItem) => (
            <div
              className="timeline"
              key={historyItem.id ?? historyItem.changed_at}
            >
              <i />

              <div>
                <b>
                  {LABELS[historyItem.to_stage] ||
                    historyItem.to_stage}
                </b>

                <small>
                  {formatDate(historyItem.changed_at)}

                  {historyItem.note &&
                    ` • ${historyItem.note}`}
                </small>
              </div>
            </div>
          ))
        ) : (
          <p>No timeline history available.</p>
        )}

        <h3>AI tools</h3>

        <button
          className="primary"
          disabled={!data.jd_text || loading}
          onClick={generateSummary}
        >
          {loading
            ? "Generating..."
            : "Generate job summary"}
        </button>

        <textarea
          placeholder="Paste resume text for match score"
          value={resume}
          onChange={(event) =>
            setResume(event.target.value)
          }
        />

        <button
          className="primary"
          disabled={
            !resume || !data.jd_text || loading
          }
          onClick={calculateResumeMatch}
        >
          {loading
            ? "Calculating..."
            : "Calculate resume match"}
        </button>

        {result && (
          <pre className="result">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}

        <button
          className="danger"
          onClick={deleteApplication}
        >
          Delete application
        </button>
      </aside>
    </div>
  );
}

export default Detail;