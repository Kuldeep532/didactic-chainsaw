import { Link } from "wouter";
import { Github, Linkedin, Twitter, MessageCircle, Globe, Hexagon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40 text-muted-foreground">
      <div className="container py-12 md:py-16 lg:py-20 mx-auto px-4 md:px-8 max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4" aria-label="Nexus Wave Technologies Home">
              <Hexagon className="h-7 w-7 text-primary" aria-hidden="true" strokeWidth={2.5} />
              <span className="font-bold text-foreground">Nexus Wave Technologies</span>
            </Link>
            <p className="text-sm max-w-md">
              High-efficiency barrier-free utilities for everyone. Built by Kuldeep Kumar Yadav — sole proprietorship, focused on accessible tools for real people.
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <a href="https://github.com/Kuldeep532/refactored-octo-couscous/releases" target="_blank" rel="noopener noreferrer" aria-label="GitHub Releases" className="hover:text-foreground transition-colors">
                <Github className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://www.linkedin.com/company/nexus-wave-technologies/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://x.com/NexusWaveApps" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://discord.gg/3yp8MMwJe" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="hover:text-foreground transition-colors">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://whatsapp.com/channel/0029VbDI2cL42Dcc9m6nfm3T" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Channel" className="hover:text-foreground transition-colors">
                <Globe className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:underline hover:text-foreground focus-visible:outline-primary">About Us</Link></li>
              <li><Link href="/apps" className="hover:underline hover:text-foreground focus-visible:outline-primary">Our Apps</Link></li>
              <li><Link href="/blog" className="hover:underline hover:text-foreground focus-visible:outline-primary">Blog</Link></li>
              <li><Link href="/resources" className="hover:underline hover:text-foreground focus-visible:outline-primary">Resources</Link></li>
              <li><Link href="/contact" className="hover:underline hover:text-foreground focus-visible:outline-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal/privacy" className="hover:underline hover:text-foreground focus-visible:outline-primary">Privacy Policy</Link></li>
              <li><Link href="/legal/terms" className="hover:underline hover:text-foreground focus-visible:outline-primary">Terms & Conditions</Link></li>
              <li><Link href="/legal/refund" className="hover:underline hover:text-foreground focus-visible:outline-primary">Refund Policy</Link></li>
              <li><Link href="/legal/disclaimer" className="hover:underline hover:text-foreground focus-visible:outline-primary">Disclaimer</Link></li>
              <li><Link href="/legal/accessibility" className="hover:underline hover:text-foreground focus-visible:outline-primary">Accessibility Statement</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Nexus Wave Technologies. All rights reserved.</p>
          <p className="mt-4 md:mt-0 font-mono text-xs">info@nexusweb.co.in</p>
        </div>
      </div>
    </footer>
  );
}
