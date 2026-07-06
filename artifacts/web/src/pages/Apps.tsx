import { Button } from "@/components/ui/button";
import { Layers, Sparkles, ExternalLink, Shield, Download, Star, Zap } from "lucide-react";

export default function Apps() {
  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-muted/30 py-20 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Our Apps</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Two focused apps built by a single developer. Available on Google Play Store and as direct APK downloads.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-lg space-y-32">

          {/* Nexus Plus */}
          <div id="nexus-plus" className="scroll-mt-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
                  <Layers className="w-4 h-4" aria-hidden="true" />
                  <span>Nexus Plus</span>
                </div>
                <h2 className="text-4xl font-bold mb-2">Nexus Plus</h2>
                <p className="font-mono text-sm text-muted-foreground mb-4">com.nexuswavetech.nexusplus</p>
                <p className="text-lg text-muted-foreground mb-6">
                  Enhanced productivity with seamless integration. Your personal command center for everyday tasks.
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></div> Lightweight & battery-friendly</li>
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></div> Works offline where possible</li>
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></div> Accessible for all users</li>
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></div> No unnecessary permissions</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="https://github.com/Kuldeep532/refactored-octo-couscous/releases/download/latest/nexus-plus.apk" target="_blank" rel="noopener noreferrer">
                    <Button>
                      <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                      Download APK
                    </Button>
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=com.nexuswavetech.nexusplus" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
                      Play Store
                    </Button>
                  </a>
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-8 shadow-sm aspect-square flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <Layers className="w-24 h-24 text-primary/80 mb-6" aria-hidden="true" />
                <h3 className="text-2xl font-bold">Nexus Plus</h3>
                <p className="text-muted-foreground mt-2">Productivity & Integration</p>
              </div>
            </div>
          </div>

          {/* Geeta Nexus */}
          <div id="geeta-nexus" className="scroll-mt-32">
            <div className="grid md:grid-cols-2 gap-12 items-center flex-row-reverse">
              <div className="order-2 md:order-1 bg-card border border-border rounded-2xl p-8 shadow-sm aspect-square flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
                <Sparkles className="w-24 h-24 text-blue-500/80 mb-6" aria-hidden="true" />
                <h3 className="text-2xl font-bold">Geeta Nexus</h3>
                <p className="text-muted-foreground mt-2">Spiritual Wisdom, Modern UI</p>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Geeta Nexus</span>
                </div>
                <h2 className="text-4xl font-bold mb-2">Geeta Nexus</h2>
                <p className="font-mono text-sm text-muted-foreground mb-4">com.nexuswavetech.geetanexus</p>
                <p className="text-lg text-muted-foreground mb-6">
                  A clean, accessible reader for the Bhagavad Gita. Multiple languages, screen-reader friendly, and works offline.
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3"></div> Multi-language text with clear typography</li>
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3"></div> Screen-reader and TalkBack optimized</li>
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3"></div> Offline-first — works without internet</li>
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3"></div> No ads, no tracking, no bloat</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="https://github.com/Kuldeep532/refactored-octo-couscous/releases/download/latest/geeta-nexus.apk" target="_blank" rel="noopener noreferrer">
                    <Button>
                      <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                      Download APK
                    </Button>
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=com.nexuswavetech.geetanexus" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
                      Play Store
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Store Optimization Banner */}
      <section className="bg-muted/30 py-16 border-y border-border/50">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-lg text-center">
          <div className="inline-flex items-center space-x-2 bg-background border border-border rounded-full px-5 py-2 text-sm font-medium mb-6">
            <Star className="w-4 h-4 text-yellow-500" aria-hidden="true" />
            <span>Google Play Store Optimized</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Available on Google Play</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Both apps are published on the Google Play Store with regular updates, proper screenshots,
            and Play Store Console optimization. Direct APK downloads are also available from our GitHub releases.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://play.google.com/store/apps/dev?id=YOUR_DEV_ID" target="_blank" rel="noopener noreferrer">
              <Button size="lg">
                <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
                Visit Developer Page
              </Button>
            </a>
            <a href="https://github.com/Kuldeep532/refactored-octo-couscous/releases" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                GitHub Releases
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
