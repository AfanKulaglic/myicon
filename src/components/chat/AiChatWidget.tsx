import { useEffect, useRef, useState } from "react";
import { X, Send, Sparkles, Bot, Loader2, RefreshCcw } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Suggestions shown as quick-reply chips when the chat is empty. */
const QUICK_SUGGESTIONS = [
  "Welche Produkte gibt es?",
  "Wie lange dauert die Lieferung?",
  "Wie funktioniert die Individualisierung?",
  "Status meiner Bestellung",
];

const WELCOME_TEXT = `Hallo! 👋 Ich bin der AI-Assistent von MYiCON — ein virtueller Berater, der Ihnen sofort weiterhilft.

Das kann ich für Sie tun:
• 🛍️ Produkte, Preise, Farben & Größen zeigen
• 🎨 Individualisierung & Druck erklären
• 🚚 Lieferzeiten & Versand beantworten
• 📦 Bestellstatus prüfen (einfach Ihre Bestellnummer nennen, z. B. ord_...)
• 💳 Zahlungsarten erklären (PayPal / Vorkasse)

Wie kann ich Ihnen helfen?`;

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Focus the input when the chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    setError(null);
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error?.message ?? `Fehler ${res.status}`);
      }
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply ?? "…" },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Verbindung fehlgeschlagen",
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const resetChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <>
      {/* Floating toggle button — AI-labelled so it's clearly an AI chat */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "AI-Chat schließen" : "AI-Chat öffnen"}
        className={`fixed bottom-5 right-5 z-[70] grid place-items-center rounded-full shadow-lg shadow-brand/30 text-white transition-all hover:scale-105 active:scale-95 ${
          open ? "bg-ink" : "bg-brand"
        } ${open ? "size-12" : "size-14"}`}
      >
        {open ? (
          <X className="size-6" />
        ) : (
          <span className="relative flex flex-col items-center justify-center">
            <Sparkles className="size-6" />
            <span className="absolute -bottom-5 text-[9px] font-bold tracking-wide uppercase bg-accent text-ink rounded px-1.5 py-0.5 leading-none shadow">
              AI
            </span>
          </span>
        )}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full bg-accent border-2 border-white" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed inset-x-0 bottom-0 top-16 z-[69] sm:inset-auto sm:bottom-24 sm:right-5 sm:top-auto sm:h-[560px] sm:max-h-[calc(100vh-120px)] sm:w-[400px] flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl border border-line bg-white shadow-2xl shadow-black/20"
          role="dialog"
          aria-label="MYiCON AI-Assistent Chat"
        >
          {/* Header — clearly branded as AI assistant */}
          <div className="flex items-center gap-3 px-4 py-3 bg-brand text-white">
            <div className="relative">
              <div className="size-10 rounded-full bg-white/15 grid place-items-center">
                <Sparkles className="size-5" />
              </div>
              <span className="absolute -bottom-1 -right-1 size-3 rounded-full bg-green-400 border-2 border-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight flex items-center gap-1.5">
                MYiCON AI-Assistent
                <span className="text-[9px] font-bold uppercase bg-accent text-ink rounded px-1.5 py-0.5 leading-none">
                  AI
                </span>
              </p>
              <p className="text-[11px] text-white/70 leading-tight">
                Virtueller Berater · antwortet sofort
              </p>
            </div>
            <button
              type="button"
              onClick={resetChat}
              className="size-8 rounded-lg hover:bg-white/15 grid place-items-center transition-colors"
              aria-label="Chat neu starten"
              title="Chat neu starten"
            >
              <RefreshCcw className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-alt/50"
          >
            {/* Welcome bubble */}
            {messages.length === 0 && (
              <>
                <div className="flex items-start gap-2.5">
                  <div className="size-8 rounded-full bg-brand/10 grid place-items-center shrink-0 mt-0.5">
                    <Bot className="size-4 text-brand" />
                  </div>
                  <div className="bg-white border border-line rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm whitespace-pre-line shadow-sm max-w-[85%]">
                    {WELCOME_TEXT}
                  </div>
                </div>

                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-2 pl-10">
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white border border-brand/30 text-brand hover:bg-brand/5 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="bg-brand text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm max-w-[80%] whitespace-pre-line shadow-sm">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="size-8 rounded-full bg-brand/10 grid place-items-center shrink-0 mt-0.5">
                    <Bot className="size-4 text-brand" />
                  </div>
                  <div className="bg-white border border-line rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm whitespace-pre-line shadow-sm max-w-[85%]">
                    {m.content}
                  </div>
                </div>
              ),
            )}

            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="size-8 rounded-full bg-brand/10 grid place-items-center shrink-0 mt-0.5">
                  <Bot className="size-4 text-brand" />
                </div>
                <div className="bg-white border border-line rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <Loader2 className="size-4 text-brand animate-spin" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error} — bitte versuchen Sie es später erneut.
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={onSubmit}
            className="border-t border-line p-3 flex items-center gap-2 bg-white"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nachricht an den AI-Assistenten…"
              className="flex-1 input !mb-0"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="size-10 rounded-lg bg-brand text-white grid place-items-center hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:pointer-events-none shrink-0"
              aria-label="Senden"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
