import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import DarkModeToggle from "../DarkModeToggle";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/apps", label: "Apps" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${scrolled ? "border-border/60 shadow-sm shadow-black/5 bg-background/90 backdrop-blur-lg" : "border-border/30 bg-background/70 backdrop-blur-md"}`}>
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between mx-auto px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2 group" aria-label="Nexus Wave Technologies Home">
          <Hexagon className="h-7 w-7 text-primary group-hover:rotate-12 transition-transform duration-300" aria-hidden="true" strokeWidth={2.5} />
          <span className="font-bold text-foreground">Nexus Wave Technologies</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative transition-colors hover:text-foreground",
                  isActive ? "text-foreground font-semibold" : "text-foreground/60",
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <span className="flex items-center space-x-2">
                  <Hexagon className="h-6 w-6 text-primary" aria-hidden="true" strokeWidth={2.5} />
                  <span>Nexus Wave Technologies</span>
                </span>
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col space-y-1" aria-label="Mobile">
              {NAV_LINKS.map((link) => {
                const isActive = location === link.href;
                return (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-muted",
                        isActive ? "bg-muted text-foreground" : "text-foreground/70",
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  );
}
