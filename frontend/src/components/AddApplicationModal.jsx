import { useState } from 'react';

export default function AddApplicationModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ company: '', role: '', jd_link: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) {
      setError('Company and role are required');
      return;
    }
    setSubmitting(true);
    try {
      await onCreate(form);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="border-t-4 border-teal" />
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-ink">New application</h2>
          <span className="text-[10px] font-mono uppercase tracking-wide text-inkSoft border border-line rounded px-1.5 py-0.5">
            Form 01
          </span>
        </div>
        <div className="mx-6 border-t border-dashed border-line" />

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <Field label="Company *">
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              className="w-full border-b border-line focus:border-teal outline-none text-sm py-1.5 bg-transparent"
              placeholder="e.g. Google"
            />
          </Field>
          <Field label="Role *">
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border-b border-line focus:border-teal outline-none text-sm py-1.5 bg-transparent"
              placeholder="e.g. SWE Intern"
            />
          </Field>
          <Field label="Job description link">
            <input
              name="jd_link"
              value={form.jd_link}
              onChange={handleChange}
              className="w-full border-b border-line focus:border-teal outline-none text-sm py-1.5 bg-transparent"
              placeholder="https://..."
            />
          </Field>
          <Field label="Notes">
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full border border-line rounded-md focus:border-teal outline-none text-sm p-2 bg-transparent"
              rows={3}
            />
          </Field>

          {error && <p className="text-sm text-rust">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[11px] font-mono uppercase tracking-wide rounded-md border border-line text-inkSoft"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-[11px] font-mono uppercase tracking-wide rounded-md bg-teal text-white disabled:opacity-50"
            >
              {submitting ? 'Adding…' : 'Add application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-mono uppercase tracking-wide text-inkSoft mb-1">{label}</span>
      {children}
    </label>
  );
}
