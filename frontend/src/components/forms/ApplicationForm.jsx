function ApplicationForm({
  form,
  setForm,
  submit,
}) {
  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const fields = [
    {
      name: "company",
      label: "Company *",
      required: true,
    },
    {
      name: "role",
      label: "Role *",
      required: true,
    },
    {
      name: "location",
      label: "Location",
    },
    {
      name: "source",
      label: "Source",
    },
    {
      name: "job_type",
      label: "Job type",
    },
    {
      name: "work_mode",
      label: "Work mode",
    },
    {
      name: "salary",
      label: "Salary / stipend",
    },
    {
      name: "deadline",
      label: "Deadline",
      type: "datetime-local",
    },
  ];

  return (
    <form onSubmit={submit}>
      <div className="formgrid">
        {fields.map((field) => (
          <label key={field.name}>
            {field.label}

            <input
              name={field.name}
              type={field.type || "text"}
              value={form[field.name] || ""}
              onChange={updateField}
              required={field.required}
            />
          </label>
        ))}
      </div>

      <label>
        Job link

        <input
          name="jd_link"
          type="url"
          value={form.jd_link || ""}
          onChange={updateField}
        />
      </label>

      <label>
        Job description

        <textarea
          name="jd_text"
          value={form.jd_text || ""}
          onChange={updateField}
        />
      </label>

      <label>
        Notes

        <textarea
          name="notes"
          value={form.notes || ""}
          onChange={updateField}
        />
      </label>

      <button className="primary" type="submit">
        Create application
      </button>
    </form>
  );
}

export default ApplicationForm;