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
  { href: "/about", label: "Company" },
  { href: "/apps", label: "Software" },
  { href: "/blog", label: "Log" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between mx-auto px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-3 group" aria-label="Nexus Wave Technologies Home">
          <Hexagon className="h-6 w-6 text-foreground group-hover:rotate-90 transition-transform duration-500" aria-hidden="true" strokeWidth={1.5} />
          <span className="font-bold text-foreground tracking-tight">Nexus Wave</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative transition-colors hover:text-foreground",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <DarkModeToggle />

          {/* Auth buttons — desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 rounded-sm" aria-label={`Account menu for ${user.name ?? user.email}`}>
                    {user.picture ? (
                      <img src={user.picture} alt="" className="h-5 w-5 rounded-sm" aria-hidden="true" />
                    ) : (
                      <User className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="max-w-[120px] truncate">{user.name ?? user.username ?? user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-sm rounded-t-none border-t-0 mt-0">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground font-mono truncate">{user.email}</div>
                  <DropdownMenuSeparator />
                  {user.isAdmin && (
                    <DropdownMenuItem asChild className="rounded-sm cursor-pointer">
                      <Link href="/admin">
                        <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="rounded-sm cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" variant="secondary" className="rounded-sm">
                <Link href="/login">Authenticate</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-sm"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 rounded-none border-l border-border bg-background p-0">
              <SheetHeader className="p-6 border-b border-border text-left">
                <SheetTitle>
                  <span className="flex items-center space-x-3">
                    <Hexagon className="h-6 w-6 text-foreground" aria-hidden="true" strokeWidth={1.5} />
                    <span className="tracking-tight">Nexus Wave</span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-4" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => {
                  const isActive = location === link.href;
                  return (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "px-4 py-3 text-lg font-medium transition-colors border-b border-border/50",
                          isActive ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  );
                })}
                <div className="mt-8 space-y-4 px-4">
                  {user ? (
                    <>
                      <div className="font-mono text-xs text-muted-foreground truncate mb-4">{user.email}</div>
                      {user.isAdmin && (
                        <SheetClose asChild>
                          <Link href="/admin" className="flex items-center gap-2 text-sm font-medium hover:text-foreground/80 transition-colors">
                            <Settings className="h-4 w-4" aria-hidden="true" />
                            Admin Panel
                          </Link>
                        </SheetClose>
                      )}
                      <SheetClose asChild>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 text-sm font-medium text-left hover:text-foreground/80 transition-colors"
                        >
                          <LogOut className="h-4 w-4" aria-hidden="true" />
                          Sign Out
                        </button>
                      </SheetClose>
                    </>
                  ) : (
                    <SheetClose asChild>
                      <Link href="/login" className="block w-full text-center border border-border bg-primary text-primary-foreground py-3 text-sm font-medium">
                        Authenticate
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