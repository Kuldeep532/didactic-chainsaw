import { ArrowRight, BookOpen, Check, Hexagon, ShieldCheck, Sparkles, Wand2 } from "lucide-react";

const highlights = [
  "Nexus Assistant with multiple AI providers",
  "Audio, video, PDF and e-paper utilities",
  "Accessibility-focused tools",
  "Voice, media and productivity features",
];

function Feature({ icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <article className="rounded-2xl border border-border p-6">
      <div className="mb-4">{icon}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </article>
  );
}

function Action({ children }: { children: any }) {
  return <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-semibold text-background">{children}</button>;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-8">
          <div className="flex items-center gap-3 font-bold">
            <Hexagon className="h-6 w-6" aria-hidden="true" />
            <span>Nexus Web Technology</span>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-border px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Nexus Web Technology</p>
            <h1 className="mt-6 max-w-5xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              User-friendly software.
              <br />
              Built for real life.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Accessible digital products for productivity, AI, media and spiritual learning.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Action>Explore Nexus apps <ArrowRight className="h-4 w-4" aria-hidden="true" /></Action>
              <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-semibold">
                Open free utilities
              </button>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-4 md:grid-cols-2">
              <Feature icon={<ShieldCheck className="h-6 w-6" aria-hidden="true" />} title="Privacy-aware" text="Account and payment-related information is handled only where needed to provide the service." />
              <Feature icon={<Sparkles className="h-6 w-6" aria-hidden="true" />} title="Modern AI tools" text="Nexus Plus brings AI, media, audio and content tools together." />
              <Feature icon={<BookOpen className="h-6 w-6" aria-hidden="true" />} title="Spiritual learning" text="Geeta Nexus provides an accessible way to explore the Bhagavad Gita." />
              <Feature icon={<Wand2 className="h-6 w-6" aria-hidden="true" />} title="Small free helpers" text="Lightweight website utilities without requiring an account." />
            </div>
          </div>
        </section>

        <section className="border-t border-border px-4 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Nexus Plus &amp; Geeta Nexus</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-border p-7">
                <Sparkles className="mb-5 h-6 w-6" aria-hidden="true" />
                <h3 className="text-2xl font-bold">Nexus Plus</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Android utility and AI platform with assistant, media, audio, PDF, e-paper and accessibility features.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {highlights.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-border p-7">
                <Hexagon className="mb-5 h-6 w-6" aria-hidden="true" />
                <h3 className="text-2xl font-bold">Geeta Nexus</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  A dedicated Bhagavad Gita experience focused on clear reading, accessibility and spiritual learning.
                </p>
                <p className="mt-6 rounded-xl border border-border p-4 text-sm text-muted-foreground">
                  Sanskrit verses with Hindi and English reading support.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto max-w-6xl text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nexus Web Technology · Accessible digital products by Kuldeep.
        </div>
      </footer>
    </div>
  );
}
