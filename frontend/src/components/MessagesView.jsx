import { apiFetch as fetch } from "../api";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Send, Plus, MessageSquare } from "lucide-react";
import Topbar from "./Topbar";
import { useInbox } from "../context/InboxContext";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}/api/v1/messages${path}`, { ...options, headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/json" } });
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.error?.message || "Unable to load messages. Please try again.");
  return result.data;
}
const time = value => value ? new Date(value).toLocaleString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
export default function MessagesView({ topbarProps }) {
  const { refresh } = useInbox();
  const [params, setParams] = useSearchParams();
  const activeId = Number(params.get("conversation")) || null;
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState([]);
  const [composing, setComposing] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const scrollRef = useRef(null);
  const activeRef = useRef(activeId);
  activeRef.current = activeId;
  const fetchConversations = useCallback(async () => {
    const rows = await request("/conversations");
    setConversations(rows || []);
  }, []);
  useEffect(() => {
    let live = true;
    async function load() {
      try { const rows = await request("/conversations"); if (live) { setConversations(rows || []); setError(""); } }
      catch (e) { if (live) setError(e.message); }
      finally { if (live) setLoading(false); }
    }
    load();
    const timer = setInterval(load, 10000);
    return () => { live = false; clearInterval(timer); };
  }, [retry]);
  useEffect(() => {
    if (!activeId) { setMessages([]); return; }
    let live = true;
    setMessages([]);
    setLoadingMessages(true);
    async function load() {
      try {
        const rows = await request(`/conversations/${activeId}/messages`);
        if (live) {
          setMessages(previous => {
            const merged = new Map(previous.map(message => [message.id, message]));
            for (const message of rows || []) merged.set(message.id, message);
            return [...merged.values()].sort((a, b) => a.id - b.id);
          });
          setConversations(previous => previous.map(c => c.conversationId === activeId ? { ...c, unreadCount: 0 } : c));
          refresh();
        }
      } catch (e) { if (live) setError(e.message); }
      finally { if (live) setLoadingMessages(false); }
    }
    load();
    const timer = setInterval(load, 5000);
    return () => { live = false; clearInterval(timer); };
  }, [activeId, retry, refresh]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }); }, [messages.length, activeId]);
  async function startConversation(e) {
    e.preventDefault();
    if (!recipient || sending) return;
    setSending(true); setError("");
    try {
      const conversation = await request("/conversations", { method: "POST", body: JSON.stringify({ recipientId: Number(recipient) }) });
      await fetchConversations();
      setParams({ conversation: String(conversation.conversationId) });
      setComposing(false);
    } catch (e) { setError(e.message); }
    finally { setSending(false); }
  }
  async function compose() {
    setComposing(true); setError("");
    try { setContacts(await request("/contacts")); }
    catch (e) { setError(e.message); }
  }
  async function send(e) {
    e.preventDefault();
    const text = (drafts[activeId] || "").trim();
    if (!text || !activeId || sending) return;
    const target = activeId;
    setSending(true); setError("");
    try {
      const message = await request(`/conversations/${target}/messages`, { method: "POST", body: JSON.stringify({ body: text }) });
      if (activeRef.current === target) setMessages(previous => previous.some(m => m.id === message.id) ? previous : [...previous, message]);
      setDrafts(previous => ({ ...previous, [target]: "" }));
      await fetchConversations();
    } catch (e) { setError(e.message); }
    finally { setSending(false); }
  }
  const active = conversations.find(c => c.conversationId === activeId);
  const filtered = conversations.filter(c => `${c.recipientName || ""} ${c.opportunityTitle || ""}`.toLowerCase().includes(search.toLowerCase()));
  return <>
    <Topbar {...topbarProps} title="Messages" subtitle="Keep your conversations and opportunity updates in one place." actions={<button className="btn btn-primary btn-sm" onClick={compose}><Plus size={15} /> New message</button>} />
    <div className="page">
      {error && <div className="feedback-error" role="alert">{error} <button className="btn btn-outline btn-sm" onClick={() => { setError(""); setRetry(n => n + 1); }}>Retry</button></div>}
      {composing && <form className="card compose-form" onSubmit={startConversation}><label htmlFor="recipient">Start a conversation</label><select id="recipient" className="input" value={recipient} onChange={e => setRecipient(e.target.value)} required><option value="">Choose a contact</option>{contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><button className="btn btn-primary" disabled={!recipient || sending}>Open conversation</button><button type="button" className="btn btn-ghost" onClick={() => setComposing(false)}>Cancel</button></form>}
      <div className="card messaging-grid">
        <aside className="conversation-list">
          <div className="search-bar"><Search size={16} /><input aria-label="Search conversations" placeholder="Search conversations" value={search} onChange={e => setSearch(e.target.value)} /></div>
          {loading && <p role="status">Loading conversations...</p>}
          {!loading && !filtered.length && <div className="empty-state"><MessageSquare size={28} /><h3>{search ? "No matches" : "Your inbox is ready"}</h3><p>{search ? "Try another name or opportunity." : "Choose New message to start a conversation."}</p></div>}
          {filtered.map(c => <button key={c.conversationId} className={`conversation-item${activeId === c.conversationId ? " selected" : ""}`} aria-pressed={activeId === c.conversationId} onClick={() => { setError(""); setParams({ conversation: String(c.conversationId) }); }}><strong>{c.recipientName || "Support"}</strong>{c.unreadCount > 0 && <span className="badge badge-veld">{c.unreadCount} unread</span>}<span className="text-sm text-stone">{c.opportunityTitle}</span><span className="conversation-preview">{c.lastMessagePreview || "Start the conversation"}</span><small className="text-stone">{time(c.lastMessageAt)}</small></button>)}
        </aside>
        <section className="message-panel" aria-label="Conversation">
          <div className="message-header"><strong>{active?.recipientName || "Messages"}</strong><p className="text-sm text-stone">{active?.opportunityTitle}</p></div>
          <div ref={scrollRef} className="message-history" role="log" aria-label="Messages">
            {!activeId && <div className="empty-state"><MessageSquare size={32} /><h3>Stay connected</h3><p>Select a conversation or start a new message.</p></div>}
            {loadingMessages && <p role="status">Loading messages...</p>}
            {activeId && !loadingMessages && !messages.length && <p className="text-stone">Send the first message below.</p>}
            {messages.map(m => <div className={`message-bubble${m.fromMe ? " from-me" : ""}`} key={m.id}><div>{m.body}</div><small>{time(m.createdAt)}{m.fromMe && m.read ? " - Read" : ""}</small></div>)}
          </div>
          <form className="message-composer" onSubmit={send}><input className="input" aria-label="Message" placeholder={activeId ? "Write a message..." : "Select a conversation first"} maxLength={5000} disabled={!activeId || sending || loadingMessages} value={drafts[activeId] || ""} onChange={e => setDrafts(previous => ({ ...previous, [activeId]: e.target.value }))} /><button className="btn btn-primary" aria-label="Send message" disabled={!activeId || !(drafts[activeId] || "").trim() || sending || loadingMessages}><Send size={16} />{sending ? "Sending..." : "Send"}</button></form>
        </section>
      </div>
    </div>
  </>;
}
