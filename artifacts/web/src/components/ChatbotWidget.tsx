import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

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

function getBotReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("download") || t.includes("install")) {
    return "You can download our apps directly as APK files from the website. Visit the Apps page and use the Smart Download button — it detects your device and routes you to the right source.";
  }
  if (t.includes("nexus plus")) {
    return "Nexus Plus is a lightweight, battery-friendly productivity app. It acts as your personal command center for everyday tasks with seamless integration across your workflow.";
  }
  if (t.includes("geeta")) {
    return "Geeta Nexus is a spiritual companion app featuring the Bhagavad Gita. It provides translations, interpretations, and daily verses for personal study and contemplation.";
  }
  if (t.includes("contact") || t.includes("support") || t.includes("email")) {
    return "You can reach us at info@nexusweb.co.in or use the contact form on our website. We typically respond within 24 hours.";
  }
  if (t.includes("who") || t.includes("founder") || t.includes("kuldeep")) {
    return "Nexus Wave Technologies is a sole proprietorship run by Kuldeep Kumar Yadav, an independent developer focused on building accessible, high-performance mobile utilities.";
  }
  if (t.includes("app store") || t.includes("play store") || t.includes("google play")) {
    return "Our apps are not on Google Play Store. You can download APK files directly from our website, which works on all Android devices including Samsung, Xiaomi, Oppo, and others.";
  }
  if (t.includes("price") || t.includes("cost") || t.includes("free")) {
    return "Our apps are free to download and use. There are no hidden charges or subscription fees.";
  }
  return "I'm here to help! Ask me about our apps, downloads, support, or the company. I can also direct you to our Blog, Contact page, or Apps section.";
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi! I'm Nexus Wave Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: "bot", text: getBotReply(text) }]);
    }, 800 + Math.random() * 400);
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
        aria-label="Open chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header */}
          <div className="px-4 py-3 border-b bg-gradient-to-r from-primary/10 to-transparent flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Nexus Assistant</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[340px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center ${m.role === "bot" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {m.role === "bot" ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                </div>
                <div className={`text-sm rounded-xl px-3 py-2 max-w-[80%] ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="bg-muted rounded-xl px-3 py-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          {messages.length < 3 && (
            <div className="px-4 pt-2 flex flex-wrap gap-2">
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 h-9 text-sm"
            />
            <Button type="submit" size="sm" className="h-9 w-9 p-0 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
