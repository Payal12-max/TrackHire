import { useApp } from "../context/Appcontext";
import Card from "../components/Card";
import { formatDate } from "../utils/date";

export default function Interviews() {
  const {
    interviews,
    setModal,
  } = useApp();

  return (
    <>
      <div className="toolbar">
        <button
          className="primary"
          onClick={() => setModal("interview")}
        >
          + Add interview record
        </button>
      </div>

      <div className="cards">
        {interviews.map((interview) => (
          <Card
            key={interview.id}
            title={`${interview.company} — ${interview.round_name}`}
          >
            <p>{interview.role}</p>

            <div className="tag">
              {interview.interview_type || "Interview"}
            </div>

            <p>
              {formatDate(interview.scheduled_at)}
            </p>

            <p>
              {interview.reflection ||
                "No reflection yet."}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}