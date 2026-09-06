import { apiFetch as fetch } from "../../api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, Quote } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Falls back to localhost for local dev; set VITE_API_URL in frontend/.env for other environments.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Login() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.target);
    const payload = {
      email: form.get("email").trim(),
      password: form.get("password"),
    };

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();

      if (!res.ok || !body.success) {
        throw new Error(body?.error?.message || "Invalid email or password.");
      }

      const { accessToken, refreshToken, user } = body.data;
      signIn({ accessToken, refreshToken, user });
      navigate(`/${user.role}`, { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="sidebar-brand-mark" style={{ background: "var(--sun)", color: "var(--ink)" }}>
            <Sprout size={20} strokeWidth={2.4} />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>SA Learnerships</span>
        </Link>
        <div>
          <Quote size={28} color="var(--sun)" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 24, fontFamily: "var(--font-display)", lineHeight: 1.35, maxWidth: "22ch" }}>
            "I tracked three applications at once and knew exactly where each one stood."
          </p>
          <p style={{ marginTop: 16, color: "#a9b2ac", fontSize: 13.5 }}>Lindiwe M. — Software Development Learnership</p>
        </div>
        <p style={{ color: "#8b948d", fontSize: 12.5 }}>Your next opportunity starts here.</p>
      </div>

      <div className="auth-form-col">
        <div className="auth-card">
          <h2 style={{ fontSize: 26, marginBottom: 6 }}>Welcome back</h2>
          <p className="text-stone text-sm" style={{ marginBottom: 24 }}>Use your email and password. We will open the dashboard linked to your account.</p>

          {error && (
            <div style={{ background: "#fdecea", color: "#a32424", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email address</label>
              <input className="input" autoComplete="username" aria-label="Email address" name="email" type="email" placeholder="you@example.co.za" required />
            </div>
            <div className="field">
              <label>Password</label>
              <input className="input" autoComplete="current-password" aria-label="Password" name="password" type="password" placeholder="••••••••" required />
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="text-sm text-stone" style={{ textAlign: "center", marginTop: 20 }}>
            Don't have an account? <Link to="/register" style={{ color: "var(--veld)", fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
