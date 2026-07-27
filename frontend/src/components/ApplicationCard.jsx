import { STAGES, TERMINAL_STAGES, stageMeta } from '../constants';
import Barcode from './Barcode';

function daysSince(dateStr) {
  const diff = Date.now() - new Date(dateStr.replace(' ', 'T') + 'Z').getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function ApplicationCard({ app, onStageChange, onDelete }) {
  const meta = stageMeta(app.current_stage);
  const days = daysSince(app.updated_at);
  const isStale = days >= 7 && !TERMINAL_STAGES.includes(app.current_stage);
  const isTerminal = TERMINAL_STAGES.includes(app.current_stage);

  return (
    <div
      className="relative bg-card rounded-md shadow-sm overflow-hidden"
      style={{ borderLeft: `4px solid ${meta.accent}` }}
    >
      {isTerminal && (
        <div
          className="stamp absolute top-2 right-2 w-16 h-16 rounded-full border-2 flex items-center justify-center text-[9px] font-mono font-bold uppercase tracking-tight text-center leading-tight pointer-events-none whitespace-pre-line"
          style={{
            borderColor: meta.accent,
            color: meta.accent,
            transform: 'rotate(-12deg)',
            opacity: 0.85
          }}
        >
          {app.current_stage === 'Offer' ? 'Offer\nsecured' : 'Not\nselected'}
        </div>
      )}

      <div className="p-5 pb-3 pr-16">
        <p className="font-semibold text-base leading-snug text-ink">{app.company}</p>
        <p className="font-mono text-[10.5px] uppercase tracking-wide text-inkSoft mt-1">{app.role}</p>
        {app.jd_link && (
          <a
            href={app.jd_link}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-[11px] text-teal underline underline-offset-2 mt-2"
          >
            View job posting ↗
          </a>
        )}
        {app.notes && <p className="text-[12.5px] text-inkSoft leading-snug mt-2 line-clamp-2">{app.notes}</p>}
      </div>

      <div className="relative h-px border-t border-dashed border-line mx-5">
        <span className="notch -left-6" />
        <span className="notch -right-6" />
      </div>

      <div className="px-5 py-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded"
            style={{ backgroundColor: meta.bg, color: meta.text }}
          >
            {meta.code} · {meta.label}
          </span>
          <Barcode seed={app.id} />
        </div>

        {isStale && (
          <p className="text-[11px] font-mono text-amber leading-snug">
            No update in {days}d — worth a follow-up
          </p>
        )}

        <div className="flex items-center gap-2 pt-1">
          {!isTerminal && (
            <select
              value=""
              onChange={(e) => e.target.value && onStageChange(app.id, e.target.value)}
              className="flex-1 text-[11px] font-mono uppercase tracking-wide border border-line rounded px-2 py-1.5 bg-paper text-inkSoft"
            >
              <option value="">Move to…</option>
              {STAGES.filter((s) => s !== app.current_stage).map((s) => (
                <option key={s} value={s}>
                  {stageMeta(s).label}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => onDelete(app.id)}
            aria-label="Remove application"
            className="text-inkSoft hover:text-rust text-[11px] font-mono px-1"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
