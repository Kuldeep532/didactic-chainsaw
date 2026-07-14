import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "wouter";

const BASE = (import.meta.env.VITE_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

interface Message {
  role: "user" | "bot";
  text: string;
}

const QUICK_REPLIES = [
  "Tell me about Nexus Plus",
  "What is Geeta Nexus?",
  "How to download apps?",
  "Contact support",
];

export default function ChatbotWidget() {
  const { user, token } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi, I am Nexus Mitra, the assistant for Nexus Wave Technologies. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMessage = text.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      if (!token) {
        // Unauthenticated — use static replies
        setTimeout(() => {
          setLoading(false);
          setMessages((prev) => [
            ...prev,
            { role: "bot", text: getStaticReply(userMessage) },
          ]);
        }, 600);
        return;
      }

      const history = messages
        .filter((m) => m.role !== "bot" || messages.indexOf(m) > 0)
        .slice(-10)
        .map((m) => ({ role: m.role === "user" ? "user" : "assistant" as const, content: m.text }));

      const res = await fetch(`${BASE}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: userMessage, history }),
      });

      if (!res.ok) {
        throw new Error("AI service unavailable");
      }
      const data = await res.json() as { reply: string };
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "I am having trouble connecting right now. Please try again or visit our Contact page." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-110 transition-transform duration-300 flex items-center justify-center"
        aria-label={open ? "Close Nexus Mitra assistant" : "Open Nexus Mitra assistant"}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {open ? <X className="h-6 w-6" aria-hidden="true" /> : <MessageCircle className="h-6 w-6" aria-hidden="true" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Nexus Mitra AI Assistant"
          aria-modal="false"
          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b bg-gradient-to-r from-primary/10 to-transparent flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center" aria-hidden="true">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Nexus Mitra</p>
              <p className="text-xs text-muted-foreground">
                {user ? "AI Assistant — Online" : "Sign in for full AI capabilities"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Sign-in prompt for unauthenticated users */}
          {!user && (
            <div className="mx-3 mt-3 p-3 rounded-lg bg-muted/60 border border-border/40 text-xs text-muted-foreground flex items-start gap-2">
              <Lock className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <Link href="/login" className="font-medium text-primary hover:underline" onClick={() => setOpen(false)}>
                  Sign in
                </Link>{" "}
                to use full AI-powered responses from Nexus Mitra.
              </span>
            </div>
          )}

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[340px]"
            aria-live="polite"
            aria-label="Conversation"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center ${m.role === "bot" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                  aria-hidden="true"
                >
                  {m.role === "bot" ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                </div>
                <div
                  className={`text-sm rounded-xl px-3 py-2 max-w-[80%] ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2" aria-label="Nexus Mitra is responding">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center" aria-hidden="true">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="bg-muted rounded-xl px-3 py-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" aria-hidden="true" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" aria-hidden="true" style={{ animationDelay: "0.15s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" aria-hidden="true" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          {messages.length < 3 && (
            <div className="px-4 pt-2 flex flex-wrap gap-2" aria-label="Suggested questions">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Nexus Mitra..."
              className="flex-1 h-9 text-sm"
              aria-label="Message input"
              disabled={loading}
            />
            <Button type="submit" size="sm" className="h-9 w-9 p-0 shrink-0" disabled={loading || !input.trim()} aria-label="Send message">
              <Send className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}

// ─── Static replies for unauthenticated users ─────────────────────────────────

function getStaticReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("download") || t.includes("install") || t.includes("apk"))
    return "You can download our apps as APK files from the Apps page. Use the Smart Download button — it routes you to the right source for your device.";
  if (t.includes("nexus plus"))
    return "Nexus Plus is a lightweight productivity app with enhanced features and seamless integration. Visit our Apps page to learn more.";
  if (t.includes("geeta"))
    return "Geeta Nexus is a spiritual companion app featuring the Bhagavad Gita with translations and daily verses.";
  if (t.includes("contact") || t.includes("support") || t.includes("email"))
    return "You can reach us at info@nexusweb.co.in or use the Contact page. We typically respond within 24 hours.";
  if (t.includes("play store") || t.includes("google play") || t.includes("app store"))
    return "Our apps are not on Google Play Store. Download APK files directly from our website — compatible with all Android devices.";
  if (t.includes("free") || t.includes("cost") || t.includes("price"))
    return "Our apps are free to download and use. No hidden charges.";
  if (t.includes("kuldeep") || t.includes("founder"))
    return "Nexus Wave Technologies is founded by Kuldeep Kumar Yadav, focused on building accessible, high-performance mobile utilities.";
  return "Sign in for full AI-powered responses from Nexus Mitra. You can also visit our Apps, Blog, or Contact page for more information.";
}
