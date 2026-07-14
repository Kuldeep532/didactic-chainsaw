import { Code2, Heart, Globe, Hexagon, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="bg-background pt-24 pb-16 border-b border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-md text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Company Profile</h1>
          <p className="text-xl text-muted-foreground font-light">
            A specialized software studio building high-efficiency, barrier-free utilities for the modern web and mobile.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-lg">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4 flex justify-center md:justify-start">
               <div className="w-32 h-32 bg-muted border border-border flex items-center justify-center">
                  <Hexagon className="h-12 w-12 text-foreground" strokeWidth={1} />
               </div>
            </div>
            <div className="md:col-span-8">
              <h2 className="text-2xl font-bold tracking-tight mb-1">Kuldeep Kumar Yadav</h2>
              <p className="text-muted-foreground font-mono text-sm mb-6 uppercase tracking-wider">Founder & Engineer</p>
              <div className="prose prose-neutral dark:prose-invert">
                <p className="text-muted-foreground leading-relaxed">
                  Nexus Wave Technologies operates as a sole proprietorship. I founded this studio to construct software that genuinely assists people—applications that are fast, universally accessible, and built for real-world reliability.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  From the applications we ship to the infrastructure running this site, every component is engineered with a strict focus on utility over embellishment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-lg">
          <div className="mb-12">
             <h2 className="text-3xl font-bold tracking-tight mb-4">Engineering Principles</h2>
             <p className="text-muted-foreground max-w-2xl leading-relaxed">
               Great software does not require an army. A singular, focused approach often yields tools that are more cohesive and reliable than those produced by large committees.
             </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-px bg-border border border-border">
            <div className="bg-card p-8">
              <div className="font-mono text-xs text-muted-foreground mb-4">01</div>
              <h3 className="text-lg font-semibold mb-2">Performance First</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Fast, lightweight, and battery-conscious. We minimize dependencies and optimize for speed.</p>
            </div>
            <div className="bg-card p-8">
              <div className="font-mono text-xs text-muted-foreground mb-4">02</div>
              <h3 className="text-lg font-semibold mb-2">Universal Access</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Screen-reader compatibility, thoughtful contrast, and keyboard navigation are hard requirements.</p>
            </div>
            <div className="bg-card p-8">
              <div className="font-mono text-xs text-muted-foreground mb-4">03</div>
              <h3 className="text-lg font-semibold mb-2">Offline Capability</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Our utilities are designed to function without an internet connection whenever possible.</p>
            </div>
            <div className="bg-card p-8">
              <div className="font-mono text-xs text-muted-foreground mb-4">04</div>
              <h3 className="text-lg font-semibold mb-2">Privacy by Default</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">We collect only what is strictly necessary. No tracking bloatware, no invasive analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Connectivity */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
             <div>
               <h2 className="text-2xl font-bold tracking-tight mb-2">Connectivity</h2>
               <p className="text-muted-foreground text-sm flex items-center gap-2">
                 <Globe className="w-4 h-4" /> Based in India, shipping globally.
               </p>
             </div>
             <div className="flex flex-wrap gap-3">
                {[
                  { label: "GitHub", url: "https://github.com/Kuldeep532/refactored-octo-couscous/releases" },
                  { label: "LinkedIn", url: "https://www.linkedin.com/company/nexus-wave-technologies/" },
                  { label: "X / Twitter", url: "https://x.com/NexusWaveApps" },
                  { label: "Discord", url: "https://discord.gg/3yp8MMwJe" }
                ].map(link => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-border bg-background text-sm font-medium hover:bg-muted transition-colors">
                    {link.label}
                  </a>
                ))}
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}