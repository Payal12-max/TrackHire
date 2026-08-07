import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useApp } from "../context/AppContext";
import { LABELS } from "../constants";
import Card from "../components/Card";
import { formatDate } from "../utils/date";

export default function Overview() {
  const { stats, reminders, weekly } = useApp();

  if (!stats) {
    return <p>Loading...</p>;
  }

  const stageData = Object.entries(stats.byStage).map(
    ([name, value]) => ({
      name: LABELS[name],
      value,
    }),
  );

  const openReminders = reminders
    .filter((reminder) => !reminder.completed)
    .slice(0, 6);

  return (
    <>
      <section className="metrics">
        {[
          ["Applications", stats.applied],
          ["Offers", stats.offers],
          ["Offer rate", `${stats.offerRate}%`],
          ["Open actions", stats.openReminders],
        ].map(([label, value]) => (
          <div className="metric" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>

      <section className="grid2">
        <Card title="Pipeline">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stageData}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#147d73"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Applications over time">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                dataKey="count"
                stroke="#172033"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </section>

      <section className="grid2">
        <Card title="Next actions">
          {openReminders.length > 0 ? (
            openReminders.map((reminder) => (
              <div className="row" key={reminder.id}>
                <b>{reminder.title}</b>

                <small>
                  {reminder.company} •{" "}
                  {formatDate(reminder.due_at)}
                </small>
              </div>
            ))
          ) : (
            <p>No reminders</p>
          )}
        </Card>

        <Card title="Weekly career insight">
          <p>{weekly?.summary}</p>

          {weekly?.actions?.map((action) => (
            <div className="action" key={action}>
              → {action}
            </div>
          ))}
        </Card>
      </section>
    </>
  );
}