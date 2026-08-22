import { useState, useEffect, useRef, useCallback } from "react";
import Topbar from "./Topbar";
import { Search, Send, Paperclip } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

export default function MessagesView({ topbarProps }) {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  /* ── Fetch conversations ──────────────────────────────────────── */
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/messages/conversations`, { headers: authHeaders() });
      const body = await res.json();
      if (!body.success) throw new Error(body?.error?.message || "Failed to load conversations");
      setConversations(body.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  /* Auto-select first conversation */
  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].conversationId);
    }
  }, [conversations, activeId]);

  /* ── Fetch messages for active conversation ───────────────────── */
  useEffect(() => {
    if (!activeId) return;
    setLoadingMessages(true);
    fetch(`${API_URL}/api/v1/messages/conversations/${activeId}/messages`, { headers: authHeaders() })
      .then((res) => res.json())
      .then((body) => {
        if (!body.success) throw new Error(body?.error?.message || "Failed to load messages");
        setMessages(body.data || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingMessages(false));
  }, [activeId]);

  /* Auto-scroll to bottom on new messages */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  /* ── Send message ─────────────────────────────────────────────── */
  const handleSend = async () => {
    if (!draft.trim() || !activeId || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/messages/conversations/${activeId}/messages`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ body: draft.trim() }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result?.error?.message || "Send failed");
      setMessages((prev) => [...prev, result.data]);
      setDraft("");
      // Refresh conversations to update previews/unread counts
      fetchConversations();
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  /* ── Derived data ─────────────────────────────────────────────── */
  const filtered = conversations.filter((c) =>
    c.recipientName.toLowerCase().includes(search.toLowerCase())
  );

  const activeConv = conversations.find((c) => c.conversationId === activeId);

  const formatTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { day: "numeric", month: "short" });
  };

  const colorForConv = (c) => {
    if (!c) return "var(--veld)";
    return c.opportunityId ? "var(--teal)" : "var(--sun-deep)";
  };

  return (
    <>
      <Topbar {...topbarProps} title="Messages" subtitle="Conversations with providers and applicants." />
      <div className="page" style={{ paddingBottom: 0 }}>
        {error && (
          <div style={{ background: "#fdecea", color: "#a32424", padding: "12px 16px", borderRadius: 8, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{error}</span>
            <span>
              <button onClick={() => { setError(""); fetchConversations(); }} style={{ background: "none", border: "1px solid #a32424", borderRadius: 4, padding: "2px 10px", cursor: "pointer", color: "#a32424", fontSize: 12, marginRight: 8 }}>Retry</button>
              <button onClick={() => setError("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#a32424", fontSize: 18, lineHeight: 1 }}>×</button>
            </span>
          </div>
        )}

        <div className="card" style={{ padding: 0, display: "grid", gridTemplateColumns: "300px 1fr", height: "calc(100vh - 220px)", minHeight: 480, overflow: "hidden" }}>
          {/* ── Thread list ───────────────────────────────────── */}
          <div style={{ borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: 14, borderBottom: "1px solid var(--line)" }}>
              <div className="search-bar">
                <Search size={15} color="var(--stone)" />
                <input placeholder="Search messages" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {loading && <p className="text-sm text-stone" style={{ padding: 16 }}>Loading…</p>}
              {!loading && filtered.length === 0 && (
                <p className="text-sm text-stone" style={{ padding: 16 }}>
                  {search ? "No conversations match." : "No conversations yet."}
                </p>
              )}
              {filtered.map((c) => (
                <div
                  key={c.conversationId}
                  onClick={() => setActiveId(c.conversationId)}
                  style={{
                    display: "flex", gap: 12, padding: 14, cursor: "pointer",
                    background: activeId === c.conversationId ? "var(--paper)" : "transparent",
                    borderBottom: "1px solid var(--line-soft)",
                  }}
                >
                  <div className="avatar" style={{ background: colorForConv(c), width: 34, height: 34, fontSize: 12 }}>
                    {c.recipientInitials || "?"}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: c.unreadCount > 0 ? 700 : 600, fontSize: 13.5 }}>
                        {c.recipientName || "Conversation"}
                      </span>
                      <span className="text-sm text-stone">{formatTime(c.lastMessageAt)}</span>
                    </div>
                    {c.opportunityTitle && (
                      <div className="text-sm" style={{ color: "var(--teal)", marginBottom: 2 }}>{c.opportunityTitle}</div>
                    )}
                    <div className="text-sm text-stone" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.lastMessagePreview || "No messages yet"}
                    </div>
                  </div>
                  {c.unreadCount > 0 && (
                    <span style={{
                      minWidth: 18, height: 18, borderRadius: 9, background: "var(--veld)",
                      color: "#fff", fontSize: 11, fontWeight: 700, display: "flex",
                      alignItems: "center", justifyContent: "center", padding: "0 5px", flexShrink: 0, marginTop: 2,
                    }}>
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Message area ──────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ padding: 16, borderBottom: "1px solid var(--line)", display: "flex", gap: 12, alignItems: "center" }}>
              <div className="avatar" style={{ background: colorForConv(activeConv), width: 36, height: 36, fontSize: 12 }}>
                {activeConv?.recipientInitials || "?"}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{activeConv?.recipientName || "Select a conversation"}</div>
                {activeConv?.opportunityTitle && (
                  <div className="text-sm text-stone">{activeConv.opportunityTitle}</div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex: 1, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
              {!activeId && <p className="text-sm text-stone">Select a conversation to view messages.</p>}
              {activeId && loadingMessages && <p className="text-sm text-stone">Loading messages…</p>}
              {activeId && !loadingMessages && messages.length === 0 && (
                <p className="text-sm text-stone">No messages yet. Send the first message below.</p>
              )}
              {messages.map((m) => (
                <div key={m.id} style={{ alignSelf: m.fromMe ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                  {!m.fromMe && (
                    <div className="text-sm text-stone" style={{ marginBottom: 4 }}>{m.senderName}</div>
                  )}
                  <div style={{
                    background: m.fromMe ? "var(--veld)" : "var(--paper)",
                    color: m.fromMe ? "#fff" : "var(--ink)",
                    padding: "10px 14px", borderRadius: 14,
                    borderBottomRightRadius: m.fromMe ? 4 : 14,
                    borderBottomLeftRadius: m.fromMe ? 14 : 4,
                    fontSize: 13.5, lineHeight: 1.5,
                  }}>
                    {m.body}
                  </div>
                  <div className="text-sm text-stone" style={{ marginTop: 4, textAlign: m.fromMe ? "right" : "left" }}>
                    {formatTime(m.createdAt)}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: 14, borderTop: "1px solid var(--line)", display: "flex", gap: 10 }}>
              <button className="icon-btn"><Paperclip size={16} /></button>
              <input
                className="input"
                placeholder={activeId ? "Write a message…" : "Select a conversation first"}
                style={{ flex: 1 }}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                disabled={!activeId || sending}
              />
              <button className="btn btn-primary" onClick={handleSend} disabled={!activeId || !draft.trim() || sending}>
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
