import { useApp } from "../context/Appcontext";
import { LABELS } from "../constants";
import Card from "../components/Card";
import { formatDate } from "../utils/date";

export default function Applications() {
  const { apps, openApp } = useApp();

  return (
    <Card title="All applications">
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Stage</th>
            <th>Source</th>
            <th>Updated</th>
          </tr>
        </thead>

        <tbody>
          {apps.map((application) => (
            <tr
              key={application.id}
              onClick={() => openApp(application.id)}
            >
              <td>
                <b>{application.company}</b>
              </td>

              <td>{application.role}</td>

              <td>
                <span className="pill">
                  {LABELS[application.current_stage]}
                </span>
              </td>

              <td>{application.source || "—"}</td>

              <td>
                {formatDate(application.updated_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}