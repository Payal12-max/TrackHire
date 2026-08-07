import { useApp } from "../context/AppContext";
import { STAGES, LABELS } from "../constants";
import AppCard from "../components/Appcard";

export default function Kanban() {
  const { apps, moveApplication, openApp } = useApp();

  return (
    <div className="kanban">
      {STAGES.map((stage) => {
        const stageApplications = apps.filter(
          (application) => application.current_stage === stage,
        );

        return (
          <div
            key={stage}
            className="column"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();

              const rawId = event.dataTransfer.getData("applicationId");

              const applicationId = Number(rawId);

              console.log("Dragged application ID:", applicationId);
              console.log("Moving to stage:", stage);

              if (!Number.isInteger(applicationId)) {
                alert("Invalid application ID");
                return;
              }

              moveApplication(applicationId, stage);
            }}
          >
            <div className="colhead">
              <b>{LABELS[stage]}</b>
              <span>{stageApplications.length}</span>
            </div>

            {stageApplications.map((application) => (
              <AppCard
                key={application.id}
                application={application}
                openApp={openApp}
                
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
