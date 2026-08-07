import { api } from "../api";
import { useApp } from "../context/Appcontext";

export default function Calendar() {
  const { reminders, setModal, load } = useApp();

  const toggleReminder = async (reminder) => {
    try {
      await api.updateReminder(reminder.id, {
        completed: !Boolean(reminder.completed),
      });

      await load();
    } catch (error) {
      console.error("Failed to update reminder:", error);
      alert("Failed to update reminder");
    }
  };

  return (
    <>
      <div className="toolbar">
        <button className="primary" onClick={() => setModal("reminder")}>
          + Add reminder
        </button>
      </div>

      <div className="calendarlist">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className={"event " + (reminder.completed ? "done" : "")}
          >
            <div className="datebox">
              <strong>{new Date(reminder.due_at).getDate()}</strong>

              <span>
                {new Date(reminder.due_at).toLocaleString("en-US", {
                  month: "short",
                })}
              </span>
            </div>

            <div>
              <h3>{reminder.title}</h3>

              <p>
                {reminder.company} • {reminder.role} • {reminder.type}
              </p>
            </div>

            <button onClick={() => toggleReminder(reminder)}>
              {reminder.completed ? "Undo" : "Complete"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
