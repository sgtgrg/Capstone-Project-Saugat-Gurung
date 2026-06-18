import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/assessment", label: "Self-Assessment" },
  { to: "/measure", label: "rPPG Session" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="font-bold text-brand">
          Cognitive Stress Tracker
        </Link>

        <div className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === l.to
                  ? "bg-brand text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {l.label}
            </Link>
          ))}

          {/* Auth controls */}
          {user ? (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <span className="text-sm text-slate-500 hidden sm:inline">
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 px-3 py-1.5 rounded-md text-sm font-medium bg-brand text-white hover:bg-brand-dark"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
