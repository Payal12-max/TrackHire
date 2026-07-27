import { useState } from 'react';
import { STAGE_META } from '../constants';
import ApplicationCard from './ApplicationCard';

export default function Board({ applications, onStageChange, onDelete }) {
  const [active, setActive] = useState('All');

  const counts = STAGE_META.map((m) => ({
    ...m,
    count: applications.filter((a) => a.current_stage === m.key).length
  }));

  const visible = active === 'All' ? applications : applications.filter((a) => a.current_stage === active);

  return (
    <div>
      <div className="flex flex-wrap gap-x-1 gap-y-2 border-b border-line mb-6">
        <TabPill label="All" count={applications.length} active={active === 'All'} onClick={() => setActive('All')} />
        {counts.map((m) => (
          <TabPill
            key={m.key}
            label={`${m.code} · ${m.label}`}
            count={m.count}
            active={active === m.key}
            accent={m.accent}
            onClick={() => setActive(m.key)}
          />
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-[12px] font-mono text-inkSoft text-center py-16 border border-dashed border-line rounded-md">
          No applications {active === 'All' ? 'yet' : 'in this stage yet'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((app) => (
            <ApplicationCard key={app.id} app={app} onStageChange={onStageChange} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

function TabPill({ label, count, active, accent, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-[11px] font-mono uppercase tracking-wide border-b-2 -mb-px transition-colors whitespace-nowrap ${
        active ? 'text-ink' : 'text-inkSoft hover:text-ink border-transparent'
      }`}
      style={active ? { borderColor: accent || '#20242B' } : undefined}
    >
      {label} <span className="text-inkSoft">({count})</span>
    </button>
  );
}
