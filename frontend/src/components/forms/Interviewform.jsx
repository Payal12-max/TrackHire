import { useState } from "react";
import { api } from "../../api";
import { useApp } from "../../context/Appcontext";
import Modal from "../Modal";

function InterviewForm({ close, load }) {
  const { apps } = useApp();

  const [form, setForm] = useState({
    application_id: apps[0]?.id || "",
    round_name: "Technical Round 1",
    interview_type: "DSA",
    scheduled_at: "",
    difficulty: 3,
    performance: 3,
    reflection: "",
  });

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const submitInterview = async (event) => {
    event.preventDefault();

    try {
      await api.addInterview({
        ...form,
        difficulty: Number(form.difficulty),
        performance: Number(form.performance),
      });

      close();
      await load();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Modal title="Interview journal" close={close}>
      <form onSubmit={submitInterview}>
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
          Round name

          <input
            name="round_name"
            value={form.round_name}
            onChange={updateField}
            required
          />
        </label>

        <label>
          Interview type

          <input
            name="interview_type"
            value={form.interview_type}
            onChange={updateField}
          />
        </label>

        <label>
          Scheduled at

          <input
            name="scheduled_at"
            type="datetime-local"
            value={form.scheduled_at}
            onChange={updateField}
          />
        </label>

        <label>
          Difficulty

          <input
            name="difficulty"
            type="number"
            min="1"
            max="5"
            value={form.difficulty}
            onChange={updateField}
          />
        </label>

        <label>
          Performance

          <input
            name="performance"
            type="number"
            min="1"
            max="5"
            value={form.performance}
            onChange={updateField}
          />
        </label>

        <label>
          Reflection

          <textarea
            name="reflection"
            value={form.reflection}
            onChange={updateField}
          />
        </label>

        <button className="primary" type="submit">
          Save interview
        </button>
      </form>
    </Modal>
  );
}

export default InterviewForm;