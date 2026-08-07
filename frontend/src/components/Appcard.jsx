import { api } from "../api";
import { useApp } from "../context/Appcontext";
import { daysSince } from "../utils/date";

function AppCard({ application, openApp }) {
  const { load } = useApp();

  const deleteApplication = async (e) => {
    e.stopPropagation(); // Prevent opening the application when clicking delete

    if (!window.confirm("Delete this application?")) return;

    try {
      await api.remove(application.id);
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <article
      className="appcard"
      draggable
      onDragStart={(e) =>
        e.dataTransfer.setData("applicationId", application.id)
      }
      onClick={() => openApp(application.id)}
    >
      <small>{application.source || "Direct"}</small>

      <h3>{application.company}</h3>

      <p>{application.role}</p>

      <footer>
        <span>{application.location || "Location not set"}</span>

        <span>{daysSince(application.updated_at)}d</span>
      </footer>

      <button
        onClick={deleteApplication}
        style={{ marginTop: "10px" }}
      >
        🗑 Delete
      </button>
    </article>
  );
}

export default AppCard;