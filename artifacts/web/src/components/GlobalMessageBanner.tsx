import { useEffect, useState } from "react";
import { X, Info, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlobalMessage {
  id: number;
  title: string;
  message: string;
  target: string;
  enabled: boolean;
  actionUrl: string | null;
  kind: string;
  startsAt: string;
  expiresAt: string;
}

const BASE = (import.meta.env.VITE_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

const icons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: AlertCircle,
};

const styles = {
  info: "bg-blue-50/80 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-100",
  warning: "bg-amber-50/80 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-100",
  success: "bg-green-50/80 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-900 dark:text-green-100",
  error: "bg-red-50/80 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-900 dark:text-red-100",
};

export default function GlobalMessageBanner() {
  const [messages, setMessages] = useState<GlobalMessage[]>([]);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch(`${BASE}/api/messages?target=website`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: GlobalMessage[]) => setMessages(data))
      .catch(() => setMessages([]));
  }, []);

  if (messages.length === 0) return null;

  const visible = messages.filter((m) => !dismissed.has(m.id));
  if (visible.length === 0) return null;

  return (
    <div role="region" aria-label="Announcements" className="w-full">
      {visible.map((m) => {
        const Icon = icons[m.kind as keyof typeof icons] ?? Info;
        return (
          <div
            key={m.id}
            className={cn("border-b px-4 py-2", styles[m.kind as keyof typeof styles] ?? styles.info)}
          >
            <div className="container mx-auto md:px-8 max-w-screen-2xl flex items-start gap-3">
              <Icon className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{m.title}</p>
                <p className="text-sm">{m.message}</p>
                {m.actionUrl && (
                  <a
                    href={m.actionUrl}
                    className="text-sm underline underline-offset-2 hover:opacity-80"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Learn more
                  </a>
                )}
              </div>
              <button
                type="button"
                onClick={() => setDismissed((prev) => new Set(prev).add(m.id))}
                className="shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/10"
                aria-label={`Dismiss announcement ${m.title}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
