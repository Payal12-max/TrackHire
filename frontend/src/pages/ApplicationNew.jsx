import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ApplicationForm from "../components/forms/ApplicationForm";
import "./ApplicationNew.css";

export default function ApplicationNew() {
  const {
    form,
    setForm,
    createApplication,
    error,
  } = useApp();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
  const success = await createApplication(event);

  if (success) {
    navigate("/dashboard/applications");
  }
};

  return (
    <div className="application-new-page">

      <div className="application-new-header">
        <Link
          to="/dashboard/applications"
          className="back-link"
        >
          <ArrowLeft size={17} />
          Back to Applications
        </Link>

        <h1>Add Application</h1>

        <p>
          Add a job or internship application to your tracker.
        </p>
      </div>

      {error && (
        <div className="application-error">
          {error}
        </div>
      )}

      <div className="application-form-container">
        <ApplicationForm
          form={form}
          setForm={setForm}
          submit={handleSubmit}
        />
      </div>

    </div>
  );
}