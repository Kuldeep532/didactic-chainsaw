import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Hexagon, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import DarkModeToggle from "../DarkModeToggle";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/apps", label: "Apps" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-border/60 shadow-sm shadow-black/5 bg-background/90 backdrop-blur-lg"
          : "border-border/30 bg-background/70 backdrop-blur-md"
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm font-medium"
      >
        Skip to main content
      </a>

      <div className="container flex h-16 max-w-screen-2xl items-center justify-between mx-auto px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2 group" aria-label="Nexus Wave Technologies Home">
          <Hexagon className="h-7 w-7 text-primary group-hover:rotate-12 transition-transform duration-300" aria-hidden="true" strokeWidth={2.5} />
          <span className="font-bold text-foreground">Nexus Wave Technologies</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium" aria-label="Primary navigation">
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
                  <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary rounded-full" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <DarkModeToggle />

          {/* Auth buttons — desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2" aria-label={`Account menu for ${user.name ?? user.email}`}>
                    {user.picture ? (
                      <img src={user.picture} alt="" className="h-6 w-6 rounded-full" aria-hidden="true" />
                    ) : (
                      <User className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="max-w-[120px] truncate">{user.name ?? user.username ?? user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{user.email}</div>
                  <DropdownMenuSeparator />
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
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
              <nav className="mt-8 flex flex-col space-y-1" aria-label="Mobile navigation">
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
                <div className="pt-4 border-t mt-4 space-y-2">
                  {user ? (
                    <>
                      <div className="px-3 py-1 text-sm text-muted-foreground truncate">{user.email}</div>
                      {user.isAdmin && (
                        <SheetClose asChild>
                          <Link href="/admin" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors">
                            <Settings className="h-4 w-4" aria-hidden="true" />
                            Admin Panel
                          </Link>
                        </SheetClose>
                      )}
                      <SheetClose asChild>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors text-left"
                        >
                          <LogOut className="h-4 w-4" aria-hidden="true" />
                          Sign Out
                        </button>
                      </SheetClose>
                    </>
                  ) : (
                    <SheetClose asChild>
                      <Link href="/login" className="block rounded-md px-3 py-2 text-sm font-medium bg-primary text-primary-foreground text-center">
                        Sign In
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
