// Renders a list of rule-based suggestions returned by the backend.
// Reused on the assessment results screen and (later) the dashboard.

const TAG_STYLES = {
  stress: "border-l-indigo-500",
  trend: "border-l-indigo-500",
  sleep: "border-l-blue-500",
  workload: "border-l-amber-500",
  focus: "border-l-emerald-500",
  mood: "border-l-rose-500",
  general: "border-l-slate-400",
};

export default function SuggestionList({ suggestions }) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No suggestions right now — keep checking in to build your picture.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {suggestions.map((s, i) => (
        <div
          key={i}
          className={`bg-white border border-slate-200 border-l-4 ${
            TAG_STYLES[s.tag] || "border-l-slate-400"
          } rounded-lg p-4`}
        >
          <h4 className="font-semibold text-slate-800">{s.title}</h4>
          <p className="text-sm text-slate-600 mt-1">{s.body}</p>
        </div>
      ))}
      <p className="text-xs text-slate-400">
        These are general wellbeing suggestions, not medical advice.
      </p>
    </div>
  );
}
