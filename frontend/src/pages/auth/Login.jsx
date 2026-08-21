import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, Quote } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Falls back to localhost for local dev; set VITE_API_URL in frontend/.env for other environments.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Login() {
  const [role, setRole] = useState("applicant");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.target);
    const payload = {
      email: form.get("email"),
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
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Sync AuthContext state in the current tab (storage event only
      // fires in *other* tabs, so we need an explicit refresh here).
      await refreshUser();

      // Route by the account's actual role from the server, not the
      // (cosmetic) tab the person happened to have selected.
      navigate(`/${user.role}`);
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
        <p style={{ color: "#8b948d", fontSize: 12.5 }}>Real accounts are created — this now talks to the live API.</p>
      </div>

      <div className="auth-form-col">
        <div className="auth-card">
          <h2 style={{ fontSize: 26, marginBottom: 6 }}>Welcome back</h2>
          <p className="text-stone text-sm" style={{ marginBottom: 24 }}>Log in to continue to your dashboard.</p>

          <div className="role-select">
            {["applicant", "provider", "admin"].map((r) => (
              <div key={r} className={"role-option" + (role === r ? " selected" : "")} onClick={() => setRole(r)}>
                {r === "applicant" ? "Applicant" : r === "provider" ? "Provider" : "Admin"}
              </div>
            ))}
          </div>

          {error && (
            <div style={{ background: "#fdecea", color: "#a32424", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email address</label>
              <input className="input" name="email" type="email" placeholder="you@example.co.za" required />
            </div>
            <div className="field">
              <label>Password</label>
              <input className="input" name="password" type="password" placeholder="••••••••" required />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
              <a href="#" className="text-sm" style={{ color: "var(--veld)", fontWeight: 600 }}>Forgot password?</a>
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
              {submitting ? "Logging in…" : `Log in as ${role}`}
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
