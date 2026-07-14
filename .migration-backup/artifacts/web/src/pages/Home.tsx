import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Hexagon, Code2, Sparkles, Rocket, Heart, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background pt-20 pb-28 lg:pt-28 lg:pb-36">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium mb-6 bg-muted/50 text-muted-foreground backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Trusted by thousands of users worldwide
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              High-efficiency <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">barrier-free utilities</span><br className="hidden md:block" />
              for everyone.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Nexus Wave Technologies is an innovative tech company dedicated to building accessible, high-performance digital solutions and mobile applications that empower users of all abilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Button asChild size="lg" className="font-medium">
                <Link href="/apps">
                  Explore Our Apps <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-medium">
                <Link href="/about">About the Company</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* SVG decorative element */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-[0.04] pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-primary fill-current">
            <path d="M0,0 L100,0 L100,100 L50,100 Z" />
            <circle cx="75" cy="50" r="15" className="fill-background" />
            <circle cx="75" cy="50" r="14" />
          </svg>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground">
              Nexus Wave was born from a simple belief: one focused builder can make technology that feels effortless for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group flex flex-col items-start p-6 bg-background rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <div className="p-3 bg-primary/10 rounded-lg mb-4 text-primary transition-transform duration-300 group-hover:scale-110">
                <Rocket className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-2">Started with a spark</h3>
              <p className="text-muted-foreground">Kuldeep Kumar Yadav launched Nexus Wave as a sole proprietorship to build practical, fast, and accessible software without the bloat of a big studio.</p>
            </div>
            <div className="group flex flex-col items-start p-6 bg-background rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <div className="p-3 bg-primary/10 rounded-lg mb-4 text-primary transition-transform duration-300 group-hover:scale-110">
                <Heart className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-2">Accessible by design</h3>
              <p className="text-muted-foreground">We design for screen readers, low bandwidth, and real-world users first. Accessibility is not a checklist — it is the foundation.</p>
            </div>
            <div className="group flex flex-col items-start p-6 bg-background rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <div className="p-3 bg-primary/10 rounded-lg mb-4 text-primary transition-transform duration-300 group-hover:scale-110">
                <Users className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-2">Shaped by you</h3>
              <p className="text-muted-foreground">Our roadmap is driven by feedback from Discord, WhatsApp, GitHub, and email. When you speak, the next update listens.</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/about">
                Read the full story <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Apps Snippet */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Nexus</h2>
            <p className="text-muted-foreground">
              Two focused apps built by a single developer. Fast, accessible, and genuinely useful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <Code2 className="w-24 h-24 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Nexus Plus</h3>
              <p className="text-muted-foreground mb-6">Enhanced productivity with seamless integration. Your personal command center for everyday tasks.</p>
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href="/apps#nexus-plus">Learn more</Link>
              </Button>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <Sparkles className="w-24 h-24 text-blue-500" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Geeta Nexus</h3>
              <p className="text-muted-foreground mb-6">Spiritual wisdom meets modern technology in an accessible format.</p>
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href="/apps#geeta-nexus">Learn more</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
