import { Code2, Users, Heart, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col w-full pb-20">
      {/* Hero */}
      <section className="bg-muted/30 py-20 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">About Nexus Wave Technologies</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A small, focused software studio building high-efficiency, barrier-free utilities.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-lg">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                  K
                </div>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Kuldeep</h2>
                <p className="text-muted-foreground font-medium mb-4">Founder & Developer</p>
                <p className="text-muted-foreground">
                  Nexus Wave Technologies is a sole proprietorship run by me, Kuldeep. I started this studio
                  to build software that actually helps people — fast, accessible, and designed for real-world use.
                  Everything you see here, from the apps to this website, is built with that same care and focus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-lg">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Why We Build</h2>
              <p className="text-muted-foreground mb-4">
                We believe that great software should not require a large team or a massive budget.
                A single developer with the right tools and focus can build something more useful than a room full of committees.
              </p>
              <p className="text-muted-foreground">
                Every product we ship is designed to be fast, accessible, and genuinely useful — not flashy,
                not bloated, just solid engineering that quietly works.
              </p>
            </div>
            <div className="bg-card border border-border p-8 rounded-xl shadow-sm">
              <Code2 className="w-12 h-12 text-primary mb-6" aria-hidden="true" />
              <h3 className="text-xl font-semibold mb-2">Principles</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></div> Fast, lightweight, and battery-friendly</li>
                <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></div> Screen-reader and accessibility friendly</li>
                <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></div> Offline-first whenever possible</li>
                <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></div> Privacy-respecting by default</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What we build */}
      <section className="bg-primary/5 py-20 border-y border-primary/10">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl text-center">
          <Heart className="w-12 h-12 text-primary mx-auto mb-6" aria-hidden="true" />
          <h2 className="text-3xl font-bold mb-6">What We Build</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Right now we have two apps on Google Play Store — <strong>Nexus Plus</strong> (productivity & integration)
            and <strong>Geeta Nexus</strong> (spiritual text reader with modern UI). Both are built with the same
            philosophy: fast, accessible, and genuinely useful.
          </p>
          <div className="inline-flex items-center space-x-2 text-sm font-mono bg-background border border-border px-4 py-2 rounded-md">
            <Globe className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <span>Based in India • Shipping Globally</span>
          </div>
        </div>
      </section>

      {/* Social */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-lg text-center">
          <h2 className="text-2xl font-bold mb-6">Stay Connected</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://github.com/Kuldeep532/refactored-octo-couscous/releases" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-muted transition-colors">
              <span className="font-bold text-primary">GH</span>
              <span>GitHub Releases</span>
            </a>
            <a href="https://www.linkedin.com/company/nexus-wave-technologies/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-muted transition-colors">
              <span className="font-bold text-primary">LI</span>
              <span>LinkedIn</span>
            </a>
            <a href="https://x.com/NexusWaveApps" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-muted transition-colors">
              <span className="font-bold text-primary">X</span>
              <span>Twitter / X</span>
            </a>
            <a href="https://discord.gg/3yp8MMwJe" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-muted transition-colors">
              <span className="font-bold text-primary">DC</span>
              <span>Discord</span>
            </a>
            <a href="https://whatsapp.com/channel/0029VbDI2cL42Dcc9m6nfm3T" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-muted transition-colors">
              <span className="font-bold text-primary">WA</span>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
