import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import { PSS10_QUESTIONS, PSS10_SCALE, FACTORS } from "../constants/pss10.js";
import SuggestionList from "../components/SuggestionList.jsx";

const CATEGORY_STYLES = {
  low: "bg-emerald-100 text-emerald-800",
  moderate: "bg-amber-100 text-amber-800",
  high: "bg-rose-100 text-rose-800",
};

export default function Assessment() {
  // null until answered; otherwise 0-4 for each of the 10 PSS-10 items.
  const [responses, setResponses] = useState(Array(10).fill(null));
  const [factors, setFactors] = useState({
    sleep: 5,
    workload: 5,
    focus: 5,
    mood: 5,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { assessment, suggestions }

  const answeredCount = responses.filter((r) => r !== null).length;

  function setResponse(index, value) {
    setResponses((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (answeredCount < 10) {
      setError(`Please answer all 10 questions (${answeredCount}/10 done).`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/assessments", { responses, factors });
      setResult(res.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err.response?.data?.error || "Could not save. Is the backend running?"
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setResponses(Array(10).fill(null));
    setFactors({ sleep: 5, workload: 5, focus: 5, mood: 5 });
    setResult(null);
    setError("");
  }

  // ---- Results screen ------------------------------------------------------
  if (result) {
    const { pss10 } = result.assessment;
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h1 className="text-xl font-bold text-slate-900">Your result</h1>
          <div className="mt-4 flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900">
                {pss10.score}
              </div>
              <div className="text-xs text-slate-500">PSS-10 score (0–40)</div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                CATEGORY_STYLES[pss10.category] || "bg-slate-100 text-slate-700"
              }`}
            >
              {pss10.category} perceived stress
            </span>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-slate-800 mb-3">Suggestions for you</h2>
          <SuggestionList suggestions={result.suggestions} />
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetForm}
            className="bg-brand hover:bg-brand-dark text-white font-medium px-4 py-2 rounded-md"
          >
            Take another
          </button>
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ---- Form ----------------------------------------------------------------
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Self-Assessment</h1>
        <p className="text-slate-600 mt-1">
          The Perceived Stress Scale (PSS-10). Answer based on the last month,
          then rate today's factors. Takes about 3 minutes.
        </p>
      </header>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* PSS-10 questions */}
      <div className="space-y-4">
        {PSS10_QUESTIONS.map((q, i) => (
          <fieldset
            key={i}
            className="bg-white border border-slate-200 rounded-xl p-4"
          >
            <legend className="text-sm font-medium text-slate-800 mb-3">
              {i + 1}. {q}
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PSS10_SCALE.map((opt) => {
                const selected = responses[i] === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setResponse(i, opt.value)}
                    className={`text-xs px-2 py-2 rounded-md border transition-colors ${
                      selected
                        ? "bg-brand text-white border-brand"
                        : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {/* Daily factors */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
        <h2 className="text-sm font-semibold text-slate-800">
          Rate today (1–10)
        </h2>
        {FACTORS.map((f) => (
          <div key={f.key}>
            <div className="flex justify-between text-sm text-slate-700">
              <span>{f.label}</span>
              <span className="font-semibold">{factors[f.key]}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={factors[f.key]}
              onChange={(e) =>
                setFactors((prev) => ({
                  ...prev,
                  [f.key]: Number(e.target.value),
                }))
              }
              className="w-full accent-brand"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>{f.low}</span>
              <span>{f.high}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{answeredCount}/10 answered</span>
        <button
          type="submit"
          disabled={submitting}
          className="bg-brand hover:bg-brand-dark text-white font-medium px-5 py-2 rounded-md disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Submit assessment"}
        </button>
      </div>
    </form>
  );
}
