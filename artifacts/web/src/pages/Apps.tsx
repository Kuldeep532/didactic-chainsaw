import { Button } from "@/components/ui/button";
import { Layers, Sparkles, ExternalLink, Shield } from "lucide-react";

export default function Apps() {
  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-muted/30 py-20 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Our Ecosystem</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Applications built on top of the Universal Gateway platform. 
            Showcasing our commitment to seamless integration, high-efficiency, and universal accessibility.
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
                  <span>Flagship Application</span>
                </div>
                <h2 className="text-4xl font-bold mb-2">Nexus Plus</h2>
                <p className="font-mono text-sm text-muted-foreground mb-6">com.nexuswavetech.nexusplus</p>
                <p className="text-xl font-medium mb-4">Enhanced features and seamless integration.</p>
                <p className="text-muted-foreground mb-8">
                  Nexus Plus is our premier productivity and integration suite. It connects siloed workflows 
                  into a unified, highly-efficient interface. Built entirely on the Universal Gateway, it demonstrates 
                  how fast, reliable, and accessible enterprise software can be.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-primary mt-0.5 mr-3 shrink-0" aria-hidden="true" />
                    <div>
                      <h4 className="font-medium">Enterprise Security</h4>
                      <p className="text-sm text-muted-foreground">End-to-end encryption and zero-trust architecture.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Layers className="w-5 h-5 text-primary mt-0.5 mr-3 shrink-0" aria-hidden="true" />
                    <div>
                      <h4 className="font-medium">Seamless Integration</h4>
                      <p className="text-sm text-muted-foreground">Connects effortlessly with existing enterprise tools.</p>
                    </div>
                  </div>
                </div>
                <Button>
                  Download Nexus Plus <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
                </Button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-8 shadow-sm aspect-square flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <Layers className="w-24 h-24 text-primary/80 mb-6" aria-hidden="true" />
                <h3 className="text-2xl font-bold">Nexus Plus</h3>
                <p className="text-muted-foreground mt-2">Available for Enterprise</p>
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
                <p className="text-muted-foreground mt-2">Available Worldwide</p>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Consumer Application</span>
                </div>
                <h2 className="text-4xl font-bold mb-2">Geeta Nexus</h2>
                <p className="font-mono text-sm text-muted-foreground mb-6">com.nexuswavetech.geetanexus</p>
                <p className="text-xl font-medium mb-4">Spiritual wisdom meets modern technology.</p>
                <p className="text-muted-foreground mb-8">
                  Geeta Nexus brings ancient spiritual wisdom into the modern digital age. We've applied our 
                  engineering rigor to create an accessible, distraction-free environment for reading, 
                  contemplating, and exploring the Bhagavad Gita.
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3"></div> Multi-language support with perfect typography</li>
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3"></div> Screen-reader optimized translations</li>
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3"></div> Offline-first architecture</li>
                </ul>
                <Button>
                  Download Geeta Nexus <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
