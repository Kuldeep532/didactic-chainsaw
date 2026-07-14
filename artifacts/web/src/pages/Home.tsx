import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Hexagon, Code2, Layers, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background pt-24 pb-20 lg:pt-36 lg:pb-32 border-b border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl">
          <div className="max-w-4xl">
            <div className="inline-flex items-center border border-border px-3 py-1 text-xs font-mono mb-8 bg-muted/30 text-muted-foreground uppercase tracking-wider">
              <span className="flex h-2 w-2 bg-foreground mr-2"></span>
              Nexus Wave Technologies
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-foreground mb-8 leading-[1.05]">
              High-efficiency utilities.
              <br />
              Barrier-free access.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl font-light leading-relaxed">
              We build accessible, high-performance digital solutions and mobile applications that respect your time and empower users of all abilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-sm font-medium h-12 px-8 text-base">
                <Link href="/apps">
                  Explore Software <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-sm font-medium h-12 px-8 text-base">
                <Link href="/about">Company Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <h2 className="text-3xl font-bold tracking-tight mb-4">The Studio</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Nexus Wave is built on a simple premise: a single, focused builder can craft technology that feels effortless and native.
              </p>
              <Button asChild variant="link" className="px-0 text-foreground font-medium hover:no-underline hover:opacity-70 transition-opacity">
                <Link href="/about" className="flex items-center">Read our principles <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 border border-border bg-background flex flex-col items-start group">
                <div className="p-3 bg-muted mb-6 text-foreground border border-transparent group-hover:border-border transition-colors">
                  <Zap className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Engineered for speed</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Fast, lightweight, and battery-friendly. We do not ship bloat. Our applications respect the device they run on.</p>
              </div>
              <div className="p-8 border border-border bg-background flex flex-col items-start group">
                <div className="p-3 bg-muted mb-6 text-foreground border border-transparent group-hover:border-border transition-colors">
                  <Layers className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Accessible by default</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Screen-reader support, high contrast, and keyboard navigation are foundational, not an afterthought.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apps Snippet */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Software</h2>
              <p className="text-muted-foreground text-lg">
                Focused applications designed to solve specific problems without friction.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-sm">
              <Link href="/apps">View all releases</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col p-10 border border-border bg-card group hover:border-foreground transition-colors duration-300">
              <div className="mb-10">
                <Code2 className="w-12 h-12 text-foreground" strokeWidth={1} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-3">Nexus Plus</h3>
              <p className="text-muted-foreground mb-8 flex-1 leading-relaxed">A personal command center for everyday tasks. Enhanced productivity through deep, seamless integration.</p>
              <Button asChild variant="secondary" className="w-full rounded-sm">
                <Link href="/apps#nexus-plus">Details & Download</Link>
              </Button>
            </div>
            <div className="flex flex-col p-10 border border-border bg-card group hover:border-foreground transition-colors duration-300">
              <div className="mb-10">
                <Hexagon className="w-12 h-12 text-foreground" strokeWidth={1} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-3">Geeta Nexus</h3>
              <p className="text-muted-foreground mb-8 flex-1 leading-relaxed">Spiritual wisdom meets rigorous engineering. An accessible, multi-language reader that works completely offline.</p>
              <Button asChild variant="secondary" className="w-full rounded-sm">
                <Link href="/apps#geeta-nexus">Details & Download</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}