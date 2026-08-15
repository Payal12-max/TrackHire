import { ArrowLeft, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ReminderForm from "../components/forms/ReminderForm";
import "./ReminderNew.css";

export default function ReminderNew() {
  const navigate = useNavigate();

  const {
    apps,
    reminderForm,
    setReminderForm,
    createReminder,
    error,
  } = useApp();

  const handleSubmit = async (event) => {
    const success = await createReminder(event);

    if (success) {
      navigate("/dashboard/calendar");
    }
  };

  return (
    <div className="reminder-new-page">

      <Link
        to="/dashboard/calendar"
        className="reminder-back-link"
      >
        <ArrowLeft size={17} />
        Back to Calendar
      </Link>

      <div className="reminder-new-header">

        <div className="reminder-new-icon">
          <Bell size={24} />
        </div>

        <div>
          <h1>Add Reminder</h1>
          <p>
            Create a reminder to stay on top of your job search.
          </p>
        </div>

      </div>

      {error && (
        <div className="reminder-form-error">
          {error}
        </div>
      )}

      <div className="reminder-form-card">

        <ReminderForm
          form={reminderForm}
          setForm={setReminderForm}
          submit={handleSubmit}
          applications={apps}
        />

      </div>

    </div>
  );
}