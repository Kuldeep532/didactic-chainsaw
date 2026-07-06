import { Link } from "wouter";
import logo from "@assets/nexus_wave_logo_transparent.png";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center mx-auto px-4 md:px-8">
        <Link href="/" className="mr-8 flex items-center space-x-2" aria-label="Nexus Wave Technologies Home">
          <img src={logo} alt="Nexus Wave Technologies Logo" className="h-8 w-auto" />
          <span className="hidden font-bold sm:inline-block">Nexus Wave Technologies</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
          <Link href="/apps" className="transition-colors hover:text-foreground/80 text-foreground/60">Apps</Link>
          <Link href="/contact" className="transition-colors hover:text-foreground/80 text-foreground/60">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
