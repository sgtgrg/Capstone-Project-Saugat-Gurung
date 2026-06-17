import { useEffect, useState } from "react";
import api from "../api/client.js";

// The Home page doubles as a "is everything wired up?" check:
// it pings the Flask backend's /health endpoint and shows the result.
export default function Home() {
  const [health, setHealth] = useState({ state: "loading" });

  useEffect(() => {
    api
      .get("/health")
      .then((res) => setHealth({ state: "ok", data: res.data }))
      .catch((err) =>
        setHealth({ state: "error", message: err.message })
      );
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">
          Cognitive Stress Tracker
        </h1>
        <p className="text-slate-600 mt-1 max-w-2xl">
          A privacy-first web app that combines validated self-assessment
          (PSS-10) with contactless heart-rate sensing (rPPG) to help you
          understand your stress patterns. All video is processed locally in
          your browser.
        </p>
      </header>

      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 mb-2">
          Backend connection
        </h2>
        {health.state === "loading" && (
          <p className="text-slate-500">Checking API…</p>
        )}
        {health.state === "ok" && (
          <div className="text-sm">
            <p className="text-green-600 font-medium">
              ✓ Connected to API
            </p>
            <pre className="mt-2 bg-slate-50 rounded-md p-3 overflow-x-auto text-slate-600">
{JSON.stringify(health.data, null, 2)}
            </pre>
          </div>
        )}
        {health.state === "error" && (
          <div className="text-sm">
            <p className="text-red-600 font-medium">
              ✗ Could not reach the API
            </p>
            <p className="text-slate-500 mt-1">
              Make sure the Flask backend is running on port 5000
              (see SETUP_WINDOWS.md). Error: {health.message}
            </p>
          </div>
        )}
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        {[
          { title: "1. Self-Assessment", body: "Answer the PSS-10 and quick 1–10 questions about sleep, workload and focus." },
          { title: "2. rPPG Session", body: "A short webcam session estimates your heart rate & HRV locally." },
          { title: "3. Dashboard", body: "See your stress trends over time and how they relate to your day." },
        ].map((c) => (
          <div key={c.title} className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800">{c.title}</h3>
            <p className="text-sm text-slate-600 mt-1">{c.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
