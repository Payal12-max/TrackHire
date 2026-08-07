import { useState } from "react";
import { api } from "../../api";
import { useApp } from "../../context/Appcontext";
import Modal from "../Modal";

function ReminderForm({ close, load }) {
  const { apps } = useApp();

  const [form, setForm] = useState({
    application_id: apps[0]?.id || "",
    title: "Follow up",
    type: "Follow-up",
    due_at: "",
  });

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const submitReminder = async (event) => {
    event.preventDefault();

    try {
      await api.addReminder(form);
      close();
      await load();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Modal title="Add reminder" close={close}>
      <form onSubmit={submitReminder}>
        <label>
          Application

          <select
            name="application_id"
            value={form.application_id}
            onChange={updateField}
            required
          >
            <option value="" disabled>
              Select an application
            </option>

            {apps.map((application) => (
              <option
                key={application.id}
                value={application.id}
              >
                {application.company} —{" "}
                {application.role}
              </option>
            ))}
          </select>
        </label>

        <label>
          Title

          <input
            name="title"
            value={form.title}
            onChange={updateField}
            required
          />
        </label>

        <label>
          Type

          <select
            name="type"
            value={form.type}
            onChange={updateField}
          >
            <option value="Follow-up">
              Follow-up
            </option>

            <option value="Interview">
              Interview
            </option>

            <option value="OA Deadline">
              OA Deadline
            </option>

            <option value="Application Deadline">
              Application Deadline
            </option>

            <option value="Custom">
              Custom
            </option>
          </select>
        </label>

        <label>
          Due at

          <input
            name="due_at"
            type="datetime-local"
            value={form.due_at}
            onChange={updateField}
            required
          />
        </label>

        <button className="primary" type="submit">
          Save reminder
        </button>
      </form>
    </Modal>
  );
}

export default ReminderForm;