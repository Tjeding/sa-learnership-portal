import { statusColor, statusLabel } from "../data/constants";

export function StatCard({ icon: Icon, label, value, foot, footUp, tint = "veld" }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        {Icon && (
          <div className="stat-icon" style={{ background: `var(--${tint}-tint)`, color: `var(--${tint}${tint === "veld" ? "-deep" : tint === "sun" ? "-deep" : ""})` }}>
            <Icon size={17} strokeWidth={2} />
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      {foot && <div className={"stat-foot" + (footUp ? " up" : "")}>{foot}</div>}
    </div>
  );
}

export function StatusBadge({ status }) {
  const color = statusColor[status] || "stone";
  const label = statusLabel[status] || status;
  return (
    <span className={`badge badge-${color}`}>
      <span className="badge-dot" />
      {label}
    </span>
  );
}

export function ProgressRing({ value, size = 84, stroke = 8, color = "var(--veld)" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--line)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="ring-label">{value}%</div>
    </div>
  );
}

const PATH_STEPS = [
  { key: "submitted", label: "Received" },
  { key: "under_review", label: "In Review" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "offered", label: "Offered" },
  { key: "accepted", label: "Accepted" },
];

export function Pathway({ status }) {
  if (status === "rejected") {
    return (
      <div className="pathway">
        {["Received", "In Review", "Rejected"].map((label, i) => (
          <div key={label} className={"pathway-step" + (i === 2 ? " rejected" : " done")}>
            <div className="pathway-dot" />
            <div className="pathway-label">{label}</div>
          </div>
        ))}
      </div>
    );
  }
  const currentIdx = PATH_STEPS.findIndex((s) => s.key === status);
  return (
    <div className="pathway">
      {PATH_STEPS.map((step, i) => {
        let cls = "";
        if (i < currentIdx) cls = "done";
        else if (i === currentIdx) cls = "current";
        return (
          <div key={step.key} className={"pathway-step " + cls}>
            <div className="pathway-dot" />
            <div className="pathway-label">{step.label}</div>
          </div>
        );
      })}
    </div>
  );
}

export function Donut({ segments, size = 150, stroke = 22 }) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {segments.map((s) => {
          const frac = s.value / total;
          const dash = frac * c;
          const el = (
            <circle
              key={s.label}
              cx={size / 2} cy={size / 2} r={r} fill="none"
              stroke={s.color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-acc}
            />
          );
          acc += dash;
          return el;
        })}
      </g>
    </svg>
  );
}

export function MiniBarChart({ data, height = 180, color = "var(--veld)" }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height, padding: "0 4px" }}>
      {data.map((d) => (
        <div key={d.month} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
          <div
            style={{
              width: "100%", maxWidth: 40, borderRadius: "6px 6px 2px 2px",
              background: color, height: `${(d.value / max) * (height - 30)}px`,
              transition: "height 0.4s ease",
            }}
          />
          <span className="text-sm text-stone">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export function HBar({ label, pct, color = "var(--veld)" }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
        <span>{label}</span>
        <span className="mono" style={{ fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ background: "var(--line-soft)", borderRadius: "var(--r-pill)", height: 8, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "var(--r-pill)" }} />
      </div>
    </div>
  );
}
