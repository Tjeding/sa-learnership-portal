import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sprout, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get("role") === "provider" ? "provider" : "applicant");
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
          <p style={{ fontSize: 24, fontFamily: "var(--font-display)", lineHeight: 1.35, marginBottom: 20 }}>
            Everything you need to get placed, in one profile.
          </p>
          <ul className="list-plain">
            {["NQF-aligned qualifications & skills", "Apply to unlimited opportunities", "Real-time status notifications", "AI-matched recommendations"].map((t) => (
              <li key={t} style={{ display: "flex", gap: 10, color: "#d7dcd7", fontSize: 14 }}>
                <CheckCircle2 size={18} color="var(--sun)" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <p style={{ color: "#8b948d", fontSize: 12.5 }}>This is a demo prototype — no real accounts are created.</p>
      </div>

      <div className="auth-form-col">
        <div className="auth-card">
          <h2 style={{ fontSize: 26, marginBottom: 6 }}>Create your account</h2>
          <p className="text-stone text-sm" style={{ marginBottom: 24 }}>Choose the account type that fits you.</p>

          <div className="role-select">
            <div className={"role-option" + (role === "applicant" ? " selected" : "")} onClick={() => setRole("applicant")}>
              I'm a work-seeker
            </div>
            <div className={"role-option" + (role === "provider" ? " selected" : "")} onClick={() => setRole("provider")}>
              I'm an employer / provider
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label>{role === "provider" ? "Contact person" : "First name"}</label>
                <input className="input" placeholder={role === "provider" ? "Thabo Ndlovu" : "Lindiwe"} required />
              </div>
              <div className="field">
                <label>{role === "provider" ? "Organisation name" : "Last name"}</label>
                <input className="input" placeholder={role === "provider" ? "Tech Solutions SA" : "Mokoena"} required />
              </div>
            </div>
            <div className="field">
              <label>Email address</label>
              <input className="input" type="email" placeholder="you@example.co.za" required />
            </div>
            <div className="field">
              <label>Password</label>
              <input className="input" type="password" placeholder="At least 8 characters" required />
            </div>
            {role === "provider" && (
              <div className="field">
                <label>Provider type</label>
                <select className="input">
                  <option>Employer</option>
                  <option>Training provider</option>
                  <option>Both</option>
                </select>
              </div>
            )}
            <label style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--stone)", marginBottom: 20 }}>
              <input type="checkbox" required style={{ marginTop: 3 }} />
              I agree to the Terms of Service and Privacy Policy.
            </label>
            <button className="btn btn-primary btn-block" type="submit">Create account</button>
          </form>

          <p className="text-sm text-stone" style={{ textAlign: "center", marginTop: 20 }}>
            Already have an account? <Link to="/login" style={{ color: "var(--veld)", fontWeight: 600 }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
