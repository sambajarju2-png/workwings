"use client";
import { useState, useEffect, useRef } from "react";
import { Loader2, Send, MessageSquare } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import Link from "next/link";

export default function ChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeShift, setActiveShift] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      // Get accepted shifts (these are the conversations)
      const { data: apps } = await supabase.from("applications")
        .select("shift_id, shifts(id, title, date, companies(name))")
        .eq("worker_id", user.id).eq("status", "accepted");
      setConversations(apps || []);
      if (apps?.length) setActiveShift(apps[0].shift_id);
      setLoading(false);
    }
    load();
  }, []);

  // Load messages + subscribe to realtime
  useEffect(() => {
    if (!activeShift) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    // Fetch existing messages
    supabase.from("messages").select("*").eq("shift_id", activeShift).order("created_at", { ascending: true })
      .then(({ data }: { data: any }) => { setMessages(data || []); setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100); });

    // Subscribe to new messages
    const channel = supabase.channel(`chat-${activeShift}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `shift_id=eq.${activeShift}` },
        (payload: any) => { setMessages(prev => [...prev, payload.new]); setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100); }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeShift]);

  async function handleSend() {
    if (!newMsg.trim() || !activeShift || !userId) return;
    setSending(true);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setSending(false); return; }
    await supabase.from("messages").insert({ shift_id: activeShift, sender_id: userId, sender_type: "worker", content: newMsg.trim() });
    setNewMsg("");
    setSending(false);
  }

  if (loading) return <div className="p-6 flex justify-center pt-20"><Loader2 size={24} className="animate-spin text-foreground-subtle" /></div>;

  if (!conversations.length) return (
    <div className="p-6 pt-20 text-center">
      <MessageSquare size={40} className="mx-auto mb-3 text-foreground-subtle" />
      <h2 className="text-lg font-bold text-foreground mb-1">Geen gesprekken</h2>
      <p className="text-sm text-foreground-subtle mb-4">Chat wordt beschikbaar na acceptatie van een shift</p>
      <Link href="/shifts" className="text-sm font-bold" style={{ color: "#EF476F" }}>Shifts bekijken</Link>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Conversation tabs */}
      <div className="flex gap-1 p-2 bg-background-alt border-b border-border overflow-x-auto flex-shrink-0">
        {conversations.map((c: any) => (
          <button key={c.shift_id} onClick={() => setActiveShift(c.shift_id)}
            className="px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all"
            style={{ background: activeShift === c.shift_id ? "var(--color-surface)" : "transparent", color: activeShift === c.shift_id ? "var(--color-foreground)" : "var(--color-foreground-subtle)", border: activeShift === c.shift_id ? "1px solid var(--color-border)" : "1px solid transparent" }}>
            {c.shifts?.companies?.name} — {c.shifts?.title}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && <p className="text-center text-sm text-foreground-subtle pt-8">Nog geen berichten. Stuur het eerste bericht!</p>}
        {messages.map((m: any, i: number) => {
          const isMe = m.sender_id === userId;
          return (
            <div key={m.id || i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm"
                style={{ background: isMe ? "#EF476F" : "var(--color-surface)", color: isMe ? "white" : "var(--color-foreground)", border: isMe ? "none" : "1px solid var(--color-border)" }}>
                {m.content}
                <div className="text-xs mt-1 opacity-60">{new Date(m.created_at).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-surface flex gap-2 flex-shrink-0">
        <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Typ een bericht..." className="flex-1 px-4 py-3 rounded-xl text-sm bg-background border border-border text-foreground outline-none" />
        <button onClick={handleSend} disabled={sending || !newMsg.trim()}
          className="px-4 rounded-xl text-white disabled:opacity-40" style={{ background: "#EF476F" }}>
          {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
}
