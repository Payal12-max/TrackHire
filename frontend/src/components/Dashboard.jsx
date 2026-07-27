import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { STAGE_META } from '../constants';

export default function Dashboard({ stats }) {
  if (!stats) return null;

  const chartData = stats.funnel.map((f) => {
    const meta = STAGE_META.find((m) => m.key === f.stage);
    return { name: meta.label, count: f.count, color: meta.accent }  ;
  });

  return (
    <div className="space-y-6">
      <div className="bg-board-navy rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-board-navySoft">
          <ReadoutPanel label="Applications" value={stats.total} />
          <ReadoutPanel label="Offers" value={stats.offers} />
          <ReadoutPanel label="Offer rate" value={`${stats.offerRate}%`} />
          <ReadoutPanel label="Days to 1st interview" value={stats.avgDaysToFirstInterview ?? '—'} />
        </div>
      </div>

      <div className="bg-card border border-line rounded-lg p-5">
        <h3 className="text-[11px] font-mono uppercase tracking-wide text-inkSoft mb-4">
          Funnel — applications that reached each stage
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D6D4C6" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fontFamily: '"IBM Plex Mono"', fill: '#63697A' }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={70}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fontFamily: '"IBM Plex Mono"', fill: '#63697A' }} />
            <Tooltip
              contentStyle={{ fontFamily: '"IBM Plex Mono"', fontSize: 12, borderRadius: 6, border: '1px solid #D6D4C6' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ReadoutPanel({ label, value }) {
  return (
    <div className="px-5 py-4">
      <p className="text-[10px] font-mono uppercase tracking-wide text-board-amber/70">{label}</p>
      <p className="text-2xl font-mono font-semibold text-board-amber mt-1">{value}</p>
    </div>
  );
}
