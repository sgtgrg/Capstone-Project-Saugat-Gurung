// Self-assessment page (PSS-10 + custom questions).
// Scaffold placeholder — built on Days 2-3 (Jun 18-19).
export default function Assessment() {
  return (
    <PlaceholderPage
      title="Self-Assessment"
      note="The PSS-10 questionnaire and 1–10 sliders (sleep, workload, focus, mood) will be built here on Jun 18–19."
    />
  );
}

function PlaceholderPage({ title, note }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      <p className="text-slate-600 mt-2">{note}</p>
      <span className="inline-block mt-4 text-xs font-medium text-brand bg-indigo-50 px-2 py-1 rounded">
        Coming soon
      </span>
    </div>
  );
}
