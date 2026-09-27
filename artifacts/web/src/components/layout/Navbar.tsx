import { Link, useLocation } from "wouter";
import { Menu, Hexagon, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/apps", label: "Apps" },
  { href: "/utilities", label: "Utilities" },
  { href: "/community", label: "Community" },
  { href: "/join-team", label: "Join Our Team" },
  { href: "/contact", label: "Contact" },
];

const MAIN_ADMIN_EMAIL = "kuldeepky538@gmail.com";

export default function Navbar() {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const isMainAdmin = user?.email?.toLowerCase() === MAIN_ADMIN_EMAIL;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="group flex items-center space-x-3" aria-label="Nexus Web Technology Home">
          <Hexagon className="h-6 w-6 transition-transform duration-500 group-hover:rotate-90" aria-hidden="true" strokeWidth={1.5} />
          <span className="font-bold tracking-tight">Nexus Web Technology</span>
        </Link>

        <nav className="hidden items-center space-x-8 text-sm font-medium md:flex" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn("transition-colors hover:text-foreground", isActive ? "text-foreground" : "text-muted-foreground")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 rounded-sm" aria-label="Account menu">
                    {user.picture ? <img src={user.picture} alt="" className="h-5 w-5 rounded-full" aria-hidden="true" /> : <User className="h-4 w-4" aria-hidden="true" />}
                    <span className="max-w-[160px] truncate">{user.name ?? user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">{user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account"><User className="mr-2 h-4 w-4" aria-hidden="true" /> My account</Link>
                  </DropdownMenuItem>
                  {isMainAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/team-admin"><Settings className="mr-2 h-4 w-4" aria-hidden="true" /> Team Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => void handleLogout()}>
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="rounded-sm">
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-sm md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full rounded-none border-l border-border bg-background sm:w-80">
              <SheetHeader className="border-b border-border pb-4 text-left">
                <SheetTitle className="flex items-center gap-3">
                  <Hexagon className="h-6 w-6" aria-hidden="true" />
                  Nexus Web Technology
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col pt-4" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => {
                  const isActive = location === link.href;
                  return (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn("border-b border-border/50 px-4 py-3 text-lg font-medium", isActive ? "text-foreground" : "text-muted-foreground")}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  );
                })}
                <div className="mt-6 px-4">
                  {user ? (
                    <div className="space-y-4">
                      <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                      <SheetClose asChild><Link href="/account" className="text-sm font-medium">My account</Link></SheetClose>
                      {isMainAdmin && <SheetClose asChild><Link href="/team-admin" className="block text-sm font-medium">Team Admin</Link></SheetClose>}
                      <button onClick={() => void handleLogout()} className="flex items-center gap-2 text-sm font-medium">
                        <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
                      </button>
                    </div>
                  ) : (
                    <SheetClose asChild>
                      <Link href="/login" className="block w-full rounded-sm bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground">
                        Sign in or create account
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
