import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import logo from "@assets/nexus_wave_logo_transparent.png";
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

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/apps", label: "Apps" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between mx-auto px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2" aria-label="Nexus Wave Technologies Home">
          <img src={logo} alt="Nexus Wave Technologies Logo" className="h-8 w-auto" />
          <span className="font-bold">Nexus Wave Technologies</span>
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
                  "transition-colors hover:text-foreground",
                  isActive ? "text-foreground font-semibold" : "text-foreground/60",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

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
                  <img src={logo} alt="" className="h-7 w-auto" />
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
    </header>
  );
}
