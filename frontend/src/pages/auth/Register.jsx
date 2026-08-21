import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sprout, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Falls back to localhost for local dev; set VITE_API_URL in frontend/.env for other environments.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Register() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get("role") === "provider" ? "provider" : "applicant");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.target);
    const payload = {
      role,
      email: form.get("email"),
      password: form.get("password"),
      firstName: form.get("firstName") || undefined,
      lastName: form.get("lastName") || undefined,
      organizationName: form.get("organizationName") || undefined,
      contactPerson: form.get("contactPerson") || undefined,
      providerType: form.get("providerType") || undefined,
    };

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      let body;
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(
          `Server returned ${res.status}: ${text || "Unknown server error"}`
        );
      }

      if (!res.ok || !body?.success) {
        throw new Error(
          body?.error?.message ||
          body?.message ||
          `Registration failed with status ${res.status}.`
        );
      }

      const { accessToken, refreshToken, user } = body.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Sync AuthContext state in the current tab
      await refreshUser();

      navigate(`/${user.role}`);
    } catch (err) {
      console.error("Registration failed:", err);
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
        <p style={{ color: "#8b948d", fontSize: 12.5 }}>Real accounts are created — this now talks to the live API.</p>
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

          {error && (
            <div style={{ background: "#fdecea", color: "#a32424", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label>{role === "provider" ? "Contact person" : "First name"}</label>
                <input
                  className="input"
                  name={role === "provider" ? "contactPerson" : "firstName"}
                  placeholder={role === "provider" ? "Thabo Ndlovu" : "Lindiwe"}
                  required={role !== "provider"}
                />
              </div>
              <div className="field">
                <label>{role === "provider" ? "Organisation name" : "Last name"}</label>
                <input
                  className="input"
                  name={role === "provider" ? "organizationName" : "lastName"}
                  placeholder={role === "provider" ? "Tech Solutions SA" : "Mokoena"}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label>Email address</label>
              <input className="input" name="email" type="email" placeholder="you@example.co.za" required />
            </div>
            <div className="field">
              <label>Password</label>
              <input className="input" name="password" type="password" placeholder="At least 8 characters" minLength={8} required />
            </div>
            {role === "provider" && (
              <div className="field">
                <label>Provider type</label>
                <select className="input" name="providerType" defaultValue="employer">
                  <option value="employer">Employer</option>
                  <option value="training_provider">Training provider</option>
                  <option value="both">Both</option>
                </select>
              </div>
            )}
            <label style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--stone)", marginBottom: 20 }}>
              <input type="checkbox" required style={{ marginTop: 3 }} />
              I agree to the Terms of Service and Privacy Policy.
            </label>
            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-sm text-stone" style={{ textAlign: "center", marginTop: 20 }}>
            Already have an account? <Link to="/login" style={{ color: "var(--veld)", fontWeight: 600 }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
