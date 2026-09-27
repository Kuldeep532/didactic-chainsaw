import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowDown, Check, CircleDollarSign, Headphones, ShieldCheck, Sparkles, Video, BookOpen } from "lucide-react";
import SmartDownloadButton from "@/components/SmartDownloadButton";

const plans = [
  { name: "Lifeline", price: "₹99", credits: "150 AI credits / month" },
  { name: "Super", price: "₹249", credits: "500 AI credits / month" },
  { name: "Pro", price: "₹599", credits: "1,400 AI credits / month" },
];

const topups = [
  ["100 credits", "₹79"],
  ["300 credits", "₹199"],
  ["750 credits", "₹449"],
  ["1,500 credits", "₹799"],
  ["2,000 credits", "₹999"],
  ["5,000 credits", "₹1,999"],
];

const nexusFeatures = [
  "Nexus Assistant with Gemini, OpenAI and Claude options",
  "Music generation, video generation and vocal removal",
  "Text-to-speech and voice tools, including ElevenLabs support",
  "Audio Editor and Audio Description features",
  "PDF utilities and E-Paper creation/AI assistance",
  "Secure Vault, Send File and accessibility-focused tools",
];

export default function Apps() {
  return (
    <div className="flex w-full flex-col pb-20">
      <section className="border-b border-border bg-background px-4 pb-16 pt-24 md:px-8">
        <div className="mx-auto max-w-screen-xl text-center">
          <p className="mb-4 text-sm font-medium text-muted-foreground">Nexus Wave products</p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">Nexus Plus and Geeta Nexus</h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Practical Android applications focused on accessibility, productivity, AI, media and spiritual learning.
          </p>
        </div>
      </section>

      <section id="nexus-plus" className="scroll-mt-24 border-b border-border bg-card py-20">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-border bg-background p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-border">
                  <Sparkles className="h-7 w-7" aria-hidden="true" />
                </div>
                <h2 className="mb-2 text-3xl font-bold tracking-tight">Nexus Plus</h2>
                <p className="text-sm text-muted-foreground">Android package: com.nexuswavetech.nexusplus</p>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  A single place for AI, media and everyday utility features, with free and paid options depending on the feature.
                </p>
                <div className="mt-7">
                  <SmartDownloadButton app="nexus_plus" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <h3 className="mb-6 text-2xl font-semibold">What you can use in Nexus Plus</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {nexusFeatures.map((feature) => (
                  <div key={feature} className="rounded-xl border border-border bg-background p-5">
                    <div className="flex gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                      <p className="text-sm leading-relaxed">{feature}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-border bg-background p-6 md:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <CircleDollarSign className="h-5 w-5" aria-hidden="true" />
                  <h3 className="text-xl font-semibold">Nexus Plus memberships</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {plans.map((plan) => (
                    <div key={plan.name} className="rounded-xl border border-border p-5">
                      <p className="text-sm text-muted-foreground">{plan.name}</p>
                      <p className="mt-2 text-3xl font-bold">{plan.price}<span className="text-sm font-normal text-muted-foreground"> / month</span></p>
                      <p className="mt-3 text-sm text-muted-foreground">{plan.credits}</p>
                      <p className="mt-4 text-xs text-muted-foreground">Includes premium feature access and ad-free membership benefits while active.</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                  Availability, credit usage and individual feature access can vary by product configuration. Please review the Refund Policy before purchase.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-background p-6 md:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <CircleDollarSign className="h-5 w-5" aria-hidden="true" />
                  <h3 className="text-xl font-semibold">Optional AI credit top-ups</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {topups.map(([credits, price]) => (
                    <div key={credits} className="flex items-center justify-between rounded-xl border border-border p-4">
                      <span className="text-sm font-medium">{credits}</span>
                      <span className="text-sm text-muted-foreground">{price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="geeta-nexus" className="scroll-mt-24 border-b border-border bg-background py-20">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-border bg-card p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-border">
                  <BookOpen className="h-7 w-7" aria-hidden="true" />
                </div>
                <h2 className="mb-2 text-3xl font-bold tracking-tight">Geeta Nexus</h2>
                <p className="text-sm text-muted-foreground">Android package: com.nexuswavetech.geetanexus</p>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  A focused Bhagavad Gita reading experience designed for accessibility and easy spiritual study.
                </p>
                <div className="mt-7">
                  <SmartDownloadButton app="geeta_nexus" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-8">
              <h3 className="mb-6 text-2xl font-semibold">Designed around the Gita reading experience</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Feature icon={<BookOpen className="h-5 w-5" /> } title="Bhagavad Gita reading">Browse chapters and verses in a clear, focused interface.</Feature>
                <Feature icon={<Headphones className="h-5 w-5" /> } title="Accessibility">Designed to work well with TalkBack and screen readers.</Feature>
                <Feature icon={<ShieldCheck className="h-5 w-5" /> } title="Simple experience">The product is centered on reading and spiritual learning rather than unnecessary distractions.</Feature>
                <Feature icon={<Sparkles className="h-5 w-5" /> } title="Connected ecosystem">The same wider Nexus ecosystem can connect spiritual content with accessibility and everyday utility.</Feature>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card py-16">
        <div className="mx-auto max-w-screen-md px-4 text-center md:px-8">
          <ArrowDown className="mx-auto mb-5 h-6 w-6" aria-hidden="true" />
          <h2 className="mb-4 text-2xl font-bold tracking-tight">Download the apps</h2>
          <p className="mb-8 leading-relaxed text-muted-foreground">
            The website provides product information and direct release links. Download availability depends on the published release channel.
          </p>
          <Button asChild size="lg" className="rounded-sm">
            <a href="https://github.com/Kuldeep532/refactored-octo-couscous/releases" target="_blank" rel="noopener noreferrer">
              View app releases
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-border">{icon}</div>
      <h4 className="mb-2 font-semibold">{title}</h4>
      <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
