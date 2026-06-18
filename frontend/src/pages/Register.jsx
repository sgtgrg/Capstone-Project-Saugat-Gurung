import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Is the backend running?"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl border border-slate-200 p-6">
      <h1 className="text-xl font-bold text-slate-900">Create your account</h1>
      <p className="text-sm text-slate-500 mt-1">
        Start tracking your stress patterns privately.
      </p>

      {error && (
        <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <Field label="Name" type="text" value={name} onChange={setName} autoComplete="name" />
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          hint="At least 8 characters."
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand hover:bg-brand-dark text-white font-medium py-2 rounded-md transition-colors disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="text-sm text-slate-500 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-brand font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

function Field({ label, type, value, onChange, autoComplete, hint }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        required
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
      />
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </label>
  );
}
