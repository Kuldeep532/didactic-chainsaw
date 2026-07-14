import { Button } from "@/components/ui/button";
import { Layers, Hexagon, ArrowDown } from "lucide-react";
import SmartDownloadButton from "@/components/SmartDownloadButton";

export default function Apps() {
  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-background pt-24 pb-16 border-b border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Software Releases</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Focused applications built for performance and accessibility. Available directly via APK.
          </p>
        </div>
      </section>

      <section className="py-24 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-lg space-y-24">

          {/* Nexus Plus */}
          <div id="nexus-plus" className="scroll-mt-32">
            <div className="grid md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-4">
                 <div className="aspect-square bg-background border border-border flex items-center justify-center p-8 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-muted/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                   <Hexagon className="w-full h-full text-foreground/20 group-hover:text-foreground/40 transition-colors" strokeWidth={0.5} />
                 </div>
              </div>
              <div className="md:col-span-8">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-3xl font-bold tracking-tight">Nexus Plus</h2>
                  <span className="px-2 py-1 bg-muted text-xs font-mono border border-border">v1.0</span>
                </div>
                <p className="font-mono text-xs text-muted-foreground mb-6 uppercase tracking-wider">com.nexuswavetech.nexusplus</p>
                <p className="text-lg text-foreground mb-8 leading-relaxed">
                  A comprehensive productivity suite with seamless system integration. Serves as a personal command center to orchestrate daily tasks with absolute minimal friction.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="p-5 border border-border bg-background">
                    <h4 className="font-semibold text-sm mb-2">Efficiency</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Lightweight footprint, strictly optimized for battery preservation.</p>
                  </div>
                  <div className="p-5 border border-border bg-background">
                    <h4 className="font-semibold text-sm mb-2">Autonomy</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Functions completely offline. No mandatory cloud tethering.</p>
                  </div>
                </div>

                <SmartDownloadButton app="nexus_plus" />
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-border" />

          {/* Geeta Nexus */}
          <div id="geeta-nexus" className="scroll-mt-32">
            <div className="grid md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-4">
                 <div className="aspect-square bg-background border border-border flex items-center justify-center p-8 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-muted/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                   <Layers className="w-full h-full text-foreground/20 group-hover:text-foreground/40 transition-colors" strokeWidth={0.5} />
                 </div>
              </div>
              <div className="md:col-span-8">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-3xl font-bold tracking-tight">Geeta Nexus</h2>
                  <span className="px-2 py-1 bg-muted text-xs font-mono border border-border">v1.2</span>
                </div>
                <p className="font-mono text-xs text-muted-foreground mb-6 uppercase tracking-wider">com.nexuswavetech.geetanexus</p>
                <p className="text-lg text-foreground mb-8 leading-relaxed">
                  A deeply accessible, multi-lingual reader for the Bhagavad Gita. Combines ancient spiritual text with rigorous modern accessibility standards.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="p-5 border border-border bg-background">
                    <h4 className="font-semibold text-sm mb-2">Accessibility</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Optimized for TalkBack and screen readers with meticulous labeling.</p>
                  </div>
                  <div className="p-5 border border-border bg-background">
                    <h4 className="font-semibold text-sm mb-2">Integrity</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Zero advertisements. Zero tracking. Pure, uninterrupted reading.</p>
                  </div>
                </div>

                <SmartDownloadButton app="geeta_nexus" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Download Direct */}
      <section className="bg-background py-16 border-b border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-md text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Manual Installation</h2>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            All applications are distributed directly as signed APKs via our GitHub repository. This circumvents app store restrictions and ensures rapid update delivery.
          </p>
          <Button asChild size="lg" className="rounded-sm font-medium">
            <a href="https://github.com/Kuldeep532/refactored-octo-couscous/releases" target="_blank" rel="noopener noreferrer">
              <ArrowDown className="w-4 h-4 mr-2" /> View All Releases
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}