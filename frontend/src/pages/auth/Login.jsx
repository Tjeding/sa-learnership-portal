import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, Quote } from "lucide-react";

export default function Login() {
  const [role, setRole] = useState("applicant");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    navigate(`/${role}`);
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
        <p style={{ color: "#8b948d", fontSize: 12.5 }}>This is a demo prototype — no real accounts are created.</p>
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

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email address</label>
              <input className="input" type="email" placeholder="you@example.co.za" defaultValue="demo@example.co.za" required />
            </div>
            <div className="field">
              <label>Password</label>
              <input className="input" type="password" placeholder="••••••••" defaultValue="password" required />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
              <a href="#" className="text-sm" style={{ color: "var(--veld)", fontWeight: 600 }}>Forgot password?</a>
            </div>
            <button className="btn btn-primary btn-block" type="submit">Log in as {role}</button>
          </form>

          <p className="text-sm text-stone" style={{ textAlign: "center", marginTop: 20 }}>
            Don't have an account? <Link to="/register" style={{ color: "var(--veld)", fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
