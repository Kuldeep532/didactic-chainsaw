import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Check, Hexagon, ShieldCheck, Sparkles, Wand2 } from "lucide-react";

const nexusHighlights = [
  "Nexus Assistant with multiple AI providers",
  "Audio, video, PDF and e-paper utilities",
  "Accessibility-focused features including Audio Description",
  "Voice, media, file and productivity tools",
];

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      <section className="border-b border-border bg-background px-4 pb-20 pt-24 lg:pb-28 lg:pt-36 md:px-8">
        <div className="mx-auto max-w-screen-2xl">
          <div className="max-w-4xl">
            <div className="mb-8 inline-flex items-center border border-border bg-muted/30 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span className="mr-2 h-2 w-2 bg-foreground" aria-hidden="true" />
              Nexus Wave Technologies
            </div>
            <h1 className="mb-8 text-5xl font-bold leading-[1.05] tracking-tighter text-foreground md:text-7xl lg:text-[5.5rem]">
              User-friendly software.
              <br />
              Built for real life.
            </h1>
            <p className="mb-12 max-w-2xl text-xl font-light leading-relaxed text-muted-foreground md:text-2xl">
              Nexus Wave creates accessible digital products for everyday productivity, AI, media, and spiritual learning.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-sm px-8 text-base font-medium">
                <Link href="/apps">
                  Explore Nexus apps <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-sm px-8 text-base font-medium">
                <Link href="/utilities">Open free utilities</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card py-24">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="mb-3 text-sm font-medium text-muted-foreground">What Nexus Wave is about</p>
              <h2 className="mb-5 text-3xl font-bold tracking-tight">Useful first, simple to understand.</h2>
              <p className="leading-relaxed text-muted-foreground">
                Nexus Wave is the name used for software products and online services created by Kuldeep. The focus is practical software that works for people with different needs and abilities.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              <div className="rounded-2xl border border-border bg-background p-7">
                <ShieldCheck className="mb-5 h-6 w-6" aria-hidden="true" />
                <h3 className="mb-2 text-lg font-semibold">Privacy-aware</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">Account and payment-related information is handled only where it is needed to provide the service.</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-7">
                <Sparkles className="mb-5 h-6 w-6" aria-hidden="true" />
                <h3 className="mb-2 text-lg font-semibold">Modern AI tools</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">Nexus Plus brings AI chat, media generation, voice, audio and content tools together in one place.</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-7">
                <BookOpen className="mb-5 h-6 w-6" aria-hidden="true" />
                <h3 className="mb-2 text-lg font-semibold">Spiritual learning</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">Geeta Nexus provides an accessible way to read and explore the Bhagavad Gita.</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-7">
                <Wand2 className="mb-5 h-6 w-6" aria-hidden="true" />
                <h3 className="mb-2 text-lg font-semibold">Small free helpers</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">The website includes a few lightweight utilities for text tasks without requiring an account.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-medium text-muted-foreground">Featured products</p>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Nexus Plus & Geeta Nexus</h2>
            </div>
            <Button asChild variant="outline" className="rounded-sm">
              <Link href="/about">About Nexus Wave</Link>
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <article className="flex flex-col rounded-2xl border border-border bg-card p-8 md:p-10">
              <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background">
                <Sparkles className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-2xl font-bold tracking-tight">Nexus Plus</h3>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                A broad Android utility and AI platform with assistant features, media tools, audio editing, PDF tools, e-paper workflows, voice features, secure storage and accessibility-focused tools.
              </p>
              <ul className="mb-8 space-y-3 text-sm text-muted-foreground">
                {nexusHighlights.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-auto rounded-sm">
                <Link href="/apps#nexus-plus">See Nexus Plus</Link>
              </Button>
            </article>

            <article className="flex flex-col rounded-2xl border border-border bg-card p-8 md:p-10">
              <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background">
                <Hexagon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-2xl font-bold tracking-tight">Geeta Nexus</h3>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                A dedicated Bhagavad Gita experience focused on clear reading, accessibility and spiritual learning, designed to work well with screen readers.
              </p>
              <div className="mb-8 rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
                Sanskrit verses with Hindi and English reading support are presented in a simple, focused experience.
              </div>
              <Button asChild variant="outline" className="mt-auto rounded-sm">
                <Link href="/apps#geeta-nexus">See Geeta Nexus</Link>
              </Button>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
