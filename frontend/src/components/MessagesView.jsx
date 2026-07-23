import { useState } from "react";
import Topbar from "./Topbar";
import { Search, Send, Paperclip } from "lucide-react";

const threads = [
  { id: 1, name: "ABC Training Institute", preview: "Please bring your original ID document to the...", time: "10:24", unread: true, initials: "AT", color: "var(--veld)" },
  { id: 2, name: "DataTech SA", preview: "Thanks for applying! We'll be in touch after the...", time: "Yesterday", unread: true, initials: "DT", color: "var(--sun-deep)" },
  { id: 3, name: "Tech Solutions SA", preview: "Your interview is confirmed for 28 July, 09:00.", time: "Mon", unread: false, initials: "TS", color: "var(--teal)" },
  { id: 4, name: "SA Learnerships Support", preview: "Your profile has been verified. Welcome aboard!", time: "18 Jul", unread: false, initials: "SL", color: "var(--role-admin)" },
];

const sampleMessages = [
  { from: "them", text: "Hi Lindiwe, thanks for your application to the Software Development Learnership.", time: "09:58" },
  { from: "them", text: "Please bring your original ID document and matric certificate to the orientation session.", time: "10:24" },
  { from: "me", text: "Thank you! I'll make sure to bring both documents. What time should I arrive?", time: "10:31" },
];

export default function MessagesView({ topbarProps }) {
  const [active, setActive] = useState(threads[0]);

  return (
    <>
      <Topbar {...topbarProps} title="Messages" subtitle="Conversations with providers and support." />
      <div className="page" style={{ paddingBottom: 0 }}>
        <div className="card" style={{ padding: 0, display: "grid", gridTemplateColumns: "300px 1fr", height: "calc(100vh - 220px)", minHeight: 480, overflow: "hidden" }}>
          <div style={{ borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: 14, borderBottom: "1px solid var(--line)" }}>
              <div className="search-bar"><Search size={15} color="var(--stone)" /><input placeholder="Search messages" /></div>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {threads.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActive(t)}
                  style={{
                    display: "flex", gap: 12, padding: 14, cursor: "pointer",
                    background: active.id === t.id ? "var(--paper)" : "transparent",
                    borderBottom: "1px solid var(--line-soft)",
                  }}
                >
                  <div className="avatar" style={{ background: t.color, width: 34, height: 34, fontSize: 12 }}>{t.initials}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: t.unread ? 700 : 600, fontSize: 13.5 }}>{t.name}</span>
                      <span className="text-sm text-stone">{t.time}</span>
                    </div>
                    <div className="text-sm text-stone" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.preview}</div>
                  </div>
                  {t.unread && <span style={{ width: 8, height: 8, borderRadius: 8, background: "var(--veld)", flexShrink: 0, marginTop: 6 }} />}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ padding: 16, borderBottom: "1px solid var(--line)", display: "flex", gap: 12, alignItems: "center" }}>
              <div className="avatar" style={{ background: active.color, width: 36, height: 36, fontSize: 12 }}>{active.initials}</div>
              <div style={{ fontWeight: 700 }}>{active.name}</div>
            </div>
            <div style={{ flex: 1, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
              {sampleMessages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.from === "me" ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                  <div style={{
                    background: m.from === "me" ? "var(--veld)" : "var(--paper)",
                    color: m.from === "me" ? "#fff" : "var(--ink)",
                    padding: "10px 14px", borderRadius: 14,
                    borderBottomRightRadius: m.from === "me" ? 4 : 14,
                    borderBottomLeftRadius: m.from === "me" ? 14 : 4,
                    fontSize: 13.5, lineHeight: 1.5,
                  }}>
                    {m.text}
                  </div>
                  <div className="text-sm text-stone" style={{ marginTop: 4, textAlign: m.from === "me" ? "right" : "left" }}>{m.time}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: 14, borderTop: "1px solid var(--line)", display: "flex", gap: 10 }}>
              <button className="icon-btn"><Paperclip size={16} /></button>
              <input className="input" placeholder="Write a message…" style={{ flex: 1 }} />
              <button className="btn btn-primary"><Send size={15} /></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
