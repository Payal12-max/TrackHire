export default function ReminderForm({
  form,
  setForm,
  submit,
  applications = [],
}) {
  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={submit} className="reminder-form">

      <div className="formgrid">

        {/* Reminder title */}
        <label>
          Reminder title *
          <input
            name="title"
            type="text"
            value={form.title || ""}
            onChange={updateField}
            placeholder="e.g. Follow up with recruiter"
            required
          />
        </label>

        {/* Due date */}
        <label>
          Due date *
          <input
            name="due_at"
            type="datetime-local"
            value={form.due_at || ""}
            onChange={updateField}
            required
          />
        </label>

      </div>

      {/* Description */}
      <label>
        Description
        <textarea
          name="description"
          value={form.description || ""}
          onChange={updateField}
          placeholder="Add some details..."
          rows={4}
        />
      </label>

      {/* Application */}
      <label>
        Application *
        <select
          name="application_id"
          value={form.application_id || ""}
          onChange={updateField}
          required
        >
          <option value="">
            Select an application
          </option>

          {applications.map((application) => (
            <option
              key={application.id}
              value={application.id}
            >
              {application.company} — {application.role}
            </option>
          ))}
        </select>
      </label>

      <button
        className="primary"
        type="submit"
      >
        Create Reminder
      </button>

    </form>
  );
}