import { Link } from "wouter";
import { Github, Linkedin, Twitter, MessageCircle, Globe, Hexagon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="container py-16 md:py-24 mx-auto px-4 md:px-8 max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6" aria-label="Nexus Wave Technologies Home">
              <Hexagon className="h-6 w-6 text-foreground" aria-hidden="true" strokeWidth={1.5} />
              <span className="font-bold tracking-tight text-lg">Nexus Wave Technologies</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              High-efficiency barrier-free utilities. Built by Kuldeep Kumar Yadav. 
              Engineering accessible software without the bloat of large studios.
            </p>
            <div className="mt-8 flex items-center space-x-5">
              <a href="https://github.com/Kuldeep532/refactored-octo-couscous/releases" target="_blank" rel="noopener noreferrer" aria-label="GitHub Releases" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://www.linkedin.com/company/nexus-wave-technologies/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://x.com/NexusWaveApps" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://discord.gg/3yp8MMwJe" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-6 uppercase tracking-wider text-muted-foreground">Index</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/about" className="hover:underline hover:text-primary transition-colors">Company Profile</Link></li>
              <li><Link href="/apps" className="hover:underline hover:text-primary transition-colors">Software Releases</Link></li>
              <li><Link href="/blog" className="hover:underline hover:text-primary transition-colors">Engineering Log</Link></li>
              <li><Link href="/resources" className="hover:underline hover:text-primary transition-colors">Resources</Link></li>
              <li><Link href="/contact" className="hover:underline hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-6 uppercase tracking-wider text-muted-foreground">Legal</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/legal/privacy" className="hover:underline hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/terms" className="hover:underline hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/legal/refund" className="hover:underline hover:text-primary transition-colors">Refund Policy</Link></li>
              <li><Link href="/legal/disclaimer" className="hover:underline hover:text-primary transition-colors">Disclaimer</Link></li>
              <li><Link href="/legal/accessibility" className="hover:underline hover:text-primary transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Nexus Wave Technologies.</p>
          <p className="mt-4 md:mt-0 font-mono text-xs uppercase tracking-wider">SYS_ID: NW-MAIN-01</p>
        </div>
      </div>
    </footer>
  );
}