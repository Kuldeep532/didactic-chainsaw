import { ArrowRight, BookOpen, Check, Hexagon, ShieldCheck, Sparkles, Wand2 } from "lucide-react";

const nexusHighlights = [
  "Nexus Assistant with multiple AI providers",
  "Audio, video, PDF and e-paper utilities",
  "Accessibility-focused features including Audio Description",
  "Voice, media, file and productivity tools",
];

function ActionLink({ children }: { children: any }) {
  return (
    <button type="button" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background no-underline">{children}</button>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-5 md:px-8">
          <div className="flex items-center gap-3 font-bold">
            <Hexagon className="h-6 w-6" aria-hidden="true" />
            <span>Nexus Web Technology</span>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-border px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-screen-2xl">
            <p className="mb-6 text-sm font-medium uppercase tracking-widest text-muted-foreground">Nexus Web Technology</p>
            <h1 className="max-w-5xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              User-friendly software.<br />Built for real life.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Accessible digital products for everyday productivity, AI, media and spiritual learning.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ActionLink>Explore Nexus apps <ArrowRight className="h-4 w-4" aria-hidden="true" /></ActionLink>
              <button type="button" className="inline-flex min-h-10 items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-medium">Open free utilities</button>
            </div>
          </div>
        </section>

        <section className="border-b border-border px-4 py-20 md:px-8">
          <div className="mx-auto max-w-screen-2xl">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="mb-3 text-sm font-medium text-muted-foreground">What we build</p>
                <h2 className="text-3xl font-bold tracking-tight">Useful first, simple to understand.</h2>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  Nexus Web Technology is the developer identity used for software products and online services created by Kuldeep.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
                <div className="rounded-2xl border border-border p-6">
                  <ShieldCheck className="mb-5 h-6 w-6" aria-hidden="true" />
                  <h3 className="mb-2 text-lg font-semibold">Privacy-aware</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">Account and payment information is handled only where needed to provide the service.</p>
                </div>
                <div className="rounded-2xl border border-border p-6">
                  <Sparkles className="mb-5 h-6 w-6" aria-hidden="true" />
                  <h3 className="mb-2 text-lg font-semibold">Modern AI tools</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">Nexus Plus brings AI chat, media, audio and content tools together.</p>
                </div>
                <div className="rounded-2xl border border-border p-6">
                  <BookOpen className="mb-5 h-6 w-6" aria-hidden="true" />
                  <h3 className="mb-2 text-lg font-semibold">Spiritual learning</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">Geeta Nexus provides an accessible way to explore the Bhagavad Gita.</p>
                </div>
                <div className="rounded-2xl border border-border p-6">
                  <Wand2 className="mb-5 h-6 w-6" aria-hidden="true" />
                  <h3 className="mb-2 text-lg font-semibold">Small free helpers</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">Lightweight website utilities without requiring an account.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 md:px-8">
          <div className="mx-auto max-w-screen-2xl">
            <div className="mb-10">
              <p className="mb-3 text-sm font-medium text-muted-foreground">Featured products</p>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Nexus Plus &amp; Geeta Nexus</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-border p-7 md:p-9">
                <Sparkles className="mb-6 h-6 w-6" aria-hidden="true" />
                <h3 className="text-2xl font-bold">Nexus Plus</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  An Android utility and AI platform with assistant features, media tools, audio editing, PDF tools, e-paper workflows and accessibility-focused features.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {nexusHighlights.map((item) => <li key={item} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><span>{item}</span></li>)}
                </ul>
                <div className="mt-8"><ActionLink>See Nexus Plus</ActionLink></div>
              </article>
              <article className="rounded-2xl border border-border p-7 md:p-9">
                <Hexagon className="mb-6 h-6 w-6" aria-hidden="true" />
                <h3 className="text-2xl font-bold">Geeta Nexus</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  A dedicated Bhagavad Gita experience focused on clear reading, accessibility and spiritual learning.
                </p>
                <p className="mt-6 rounded-xl border border-border p-4 text-sm text-muted-foreground">
                  Sanskrit verses with Hindi and English reading support.
                </p>
                <div className="mt-8"><button type="button" className="inline-flex min-h-10 items-center rounded-md border border-border px-6 py-3 text-sm font-medium">See Geeta Nexus</button></div>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-4 py-10 md:px-8">
        <div className="mx-auto max-w-screen-2xl text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nexus Web Technology · Accessible digital products by Kuldeep.
        </div>
      </footer>
    </div>
  );
}
