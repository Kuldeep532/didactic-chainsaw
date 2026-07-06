import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Activity, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32 lg:pt-36 lg:pb-40">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium mb-6 bg-muted/50 text-muted-foreground backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Universal Gateway Platform Active
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 font-sans">
              High-efficiency <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">barrier-free utilities</span><br className="hidden md:block" />
              for everyone.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
              Nexus Wave Technologies builds precise, engineering-grade infrastructure. 
              We are the silent, reliable plumbing powering modern applications. Security and accessibility obsessed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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
        
        {/* Abstract structural background element to imply infrastructure */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-primary fill-current">
            <path d="M0,0 L100,0 L100,100 L50,100 Z" />
            <circle cx="75" cy="50" r="15" className="fill-background" />
            <circle cx="75" cy="50" r="14" />
          </svg>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-start p-6 bg-background rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary/10 rounded-lg mb-4 text-primary">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-2">Security-Obsessed</h3>
              <p className="text-muted-foreground">Engineering-grade security protocols built into every layer of our infrastructure.</p>
            </div>
            <div className="flex flex-col items-start p-6 bg-background rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary/10 rounded-lg mb-4 text-primary">
                <Globe className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-2">Genuinely Accessible</h3>
              <p className="text-muted-foreground">Barrier-free by design. Our products are fully accessible for all users, including those using assistive technologies.</p>
            </div>
            <div className="flex flex-col items-start p-6 bg-background rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary/10 rounded-lg mb-4 text-primary">
                <Activity className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-2">Universal Gateway</h3>
              <p className="text-muted-foreground">A robust backend platform providing seamless integration and high-efficiency performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Apps Snippet */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Nexus</h2>
            <p className="text-muted-foreground">
              Discover the applications built on our Universal Gateway platform, demonstrating our commitment to quality and accessibility.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover:border-primary/50 transition-colors">
              <div className="mb-4 text-sm font-mono text-muted-foreground">com.nexuswavetech.nexusplus</div>
              <h3 className="text-2xl font-bold mb-3">Nexus Plus</h3>
              <p className="text-muted-foreground mb-6">Enhanced features and seamless integration for modern workflows.</p>
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href="/apps#nexus-plus">Learn more</Link>
              </Button>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover:border-primary/50 transition-colors">
              <div className="mb-4 text-sm font-mono text-muted-foreground">com.nexuswavetech.geetanexus</div>
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
