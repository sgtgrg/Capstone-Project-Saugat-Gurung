import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client.js";

// AuthContext makes the logged-in user + auth actions available app-wide.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check the token

  // On first load, if a token exists, ask the backend who we are.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        // Token invalid/expired — clear it.
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function register(name, email, password) {
    const res = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  }

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  const value = { user, loading, register, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Convenience hook: const { user, login } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
