import { Link } from "wouter";
import { Github, MessageCircle, Twitter, Hexagon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-5 flex items-center space-x-3" aria-label="Nexus Wave Technologies Home">
              <Hexagon className="h-6 w-6" aria-hidden="true" strokeWidth={1.5} />
              <span className="text-lg font-bold tracking-tight">Nexus Wave Technologies</span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Nexus Wave is a developer identity used for accessible software products and online services, including Nexus Plus and Geeta Nexus.
            </p>
            <div className="mt-7 flex items-center gap-5">
              <a href="https://github.com/Kuldeep532/didactic-chainsaw" target="_blank" rel="noopener noreferrer" aria-label="Nexus Wave GitHub">
                <Github className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://x.com/NexusWaveApps" target="_blank" rel="noopener noreferrer" aria-label="Nexus Wave on X">
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://discord.gg/3yp8MMwJe" target="_blank" rel="noopener noreferrer" aria-label="Nexus Wave community">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Explore</h2>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/apps" className="hover:underline">Nexus apps</Link></li>
              <li><Link href="/utilities" className="hover:underline">Utilities</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Legal</h2>
            <ul className="space-y-3 text-sm">
              <li><Link href="/legal/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/legal/terms" className="hover:underline">Terms and Conditions</Link></li>
              <li><Link href="/legal/refund" className="hover:underline">Refund Policy</Link></li>
              <li><Link href="/legal/disclaimer" className="hover:underline">Disclaimer</Link></li>
              <li><Link href="/legal/accessibility" className="hover:underline">Accessibility</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Nexus Wave Technologies.</p>
          <p>Product information and policies are published for users to review before use or purchase.</p>
        </div>
      </div>
    </footer>
  );
}
