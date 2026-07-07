import { useEffect, useState } from "react";
import { Sparkles, BookOpen } from "lucide-react";

interface DailyShloka {
  greeting: string;
  date: string;
  verse: string;
  transliteration: string;
  meaning: string;
  chapter: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function DevotionalBanner() {
  const [shloka, setShloka] = useState<DailyShloka | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/shloka/daily`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: DailyShloka) => setShloka(data))
      .catch(() => setError(true));
  }, []);

  if (error || !shloka) return null;

  return (
    <section
      aria-label="Daily devotional shloka"
      className="w-full border-b border-border/40 bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-rose-50/80 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/30"
    >
      <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl py-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
            <span className="font-semibold text-sm text-orange-800 dark:text-orange-200">
              {shloka.greeting}
            </span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border shrink-0" aria-hidden="true" />
          <div className="flex items-start gap-2 min-w-0">
            <BookOpen className="h-4 w-4 mt-0.5 text-orange-600 dark:text-orange-400 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {shloka.verse.replace(/\n/g, " ")}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {shloka.meaning}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
