import { Building2, Code2, Users, Network } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col w-full pb-20">
      {/* Hero */}
      <section className="bg-muted/30 py-20 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Engineering for Everyone</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nexus Wave Technologies is an engineering-first cloud technology company. 
            We build the plumbing that modern, accessible applications rely on.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-lg">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-3xl font-bold mb-4">Precision Engineering</h2>
              <p className="text-muted-foreground mb-4">
                We believe that infrastructure should be invisible, silent, and flawlessly reliable. 
                Our team is obsessed with performance metrics, edge-case handling, and 
                creating systems that scale elegantly without breaking a sweat.
              </p>
              <p className="text-muted-foreground">
                Every product we ship is the result of this philosophy — software designed 
                to work fast, feel effortless, and never get in your way.
              </p>
            </div>
            <div className="bg-card border border-border p-8 rounded-xl shadow-sm">
              <Code2 className="w-12 h-12 text-primary mb-6" aria-hidden="true" />
              <h3 className="text-xl font-semibold mb-2">Technical Excellence</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></div> Serverless Architecture</li>
                <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></div> Microservices Integration</li>
                <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></div> Global Edge Delivery</li>
                <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></div> Zero-Trust Security</li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center flex-row-reverse">
            <div className="order-2 md:order-1 bg-card border border-border p-8 rounded-xl shadow-sm">
              <Users className="w-12 h-12 text-primary mb-6" aria-hidden="true" />
              <h3 className="text-xl font-semibold mb-2">Universal Access</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Accessibility is not a checklist; it is a fundamental human right in the digital age.
                Our UI components, APIs, and documentation are designed to be entirely barrier-free.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-4">Barrier-Free Utilities</h2>
              <p className="text-muted-foreground mb-4">
                We refuse to accept the premise that powerful tools must be complex or exclusionary. 
                Every interface we design and every API we expose is built with strict adherence to 
                accessibility standards (WCAG 2.1 AA+).
              </p>
              <p className="text-muted-foreground">
                Our tagline — "High-efficiency barrier-free utilities for everyone" — is the standard 
                by which we measure every release.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership / Meta */}
      <section className="bg-primary/5 py-20 border-y border-primary/10">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl text-center">
          <Network className="w-12 h-12 text-primary mx-auto mb-6" aria-hidden="true" />
          <h2 className="text-3xl font-bold mb-6">The Network Effect</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            When infrastructure is reliable and accessible, the entire ecosystem benefits. 
            Join the growing number of services relying on Nexus Wave Technologies.
          </p>
          <div className="inline-flex items-center space-x-2 text-sm font-mono bg-background border border-border px-4 py-2 rounded-md">
            <Building2 className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <span>HQ: Global Distributed</span>
          </div>
        </div>
      </section>
    </div>
  );
}
