import type { ReactNode } from "react";
import { Globe, Heart, Hexagon, ShieldCheck, Sparkles } from "lucide-react";

export default function About() {
  return (
    <div className="flex w-full flex-col">
      <section className="border-b border-border bg-background px-4 pb-16 pt-24 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium text-muted-foreground">About Nexus Web Technology</p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">Software made for people.</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Nexus Web Technology is the developer identity used for software products and online services developed by Kuldeep. It is a developer identity focused on practical, accessible technology and user needs.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-card py-20">
        <div className="mx-auto grid max-w-5xl gap-12 px-4 md:grid-cols-12 md:px-8">
          <div className="md:col-span-4">
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-background">
              <Hexagon className="h-20 w-20" strokeWidth={0.8} aria-hidden="true" />
            </div>
          </div>
          <div className="md:col-span-8">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Developer</p>
            <h2 className="mb-5 text-3xl font-bold tracking-tight">Kuldeep</h2>
            <div className="space-y-5 text-muted-foreground">
              <p className="leading-relaxed">
                The Nexus Wave name brings together products such as Nexus Plus and Geeta Nexus, along with selected web utilities that make common tasks easier.
              </p>
              <p className="leading-relaxed">
                Accessibility is a practical requirement throughout the products: clear navigation, screen-reader support, readable layouts and interfaces that avoid unnecessary complexity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="mb-12">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">What users can expect</h2>
            <p className="max-w-2xl leading-relaxed text-muted-foreground">
              Products are built around usefulness, accessibility, privacy-aware design and clear communication.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Principle icon={<Sparkles className="h-5 w-5" />} title="Useful features">
              Nexus Plus combines AI, audio, video, documents, content and everyday utility features in one Android experience.
            </Principle>
            <Principle icon={<Heart className="h-5 w-5" />} title="Accessibility">
              Screen-reader friendly layouts and accessible controls are treated as part of the product, not an optional add-on.
            </Principle>
            <Principle icon={<ShieldCheck className="h-5 w-5" />} title="Privacy-aware">
              Account, support and payment information is handled only where it is needed to provide and protect the service.
            </Principle>
            <Principle icon={<Globe className="h-5 w-5" />} title="Clear access">
              Product information, account access and legal policies are published openly so users can review them before using or purchasing a service.
            </Principle>
          </div>
        </div>
      </section>
    </div>
  );
}

function Principle({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-7">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
