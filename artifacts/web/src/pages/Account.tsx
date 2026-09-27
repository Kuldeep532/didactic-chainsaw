import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Mail, ShieldCheck, FileText, LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Account() {
  const { user, logout, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) navigate("/login");
  }, [isLoading, user, navigate]);

  if (isLoading || !user) {
    return <div className="min-h-[60vh] bg-background" aria-busy="true" />;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="bg-background py-16">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium text-muted-foreground">Nexus account</p>
          <h1 className="text-4xl font-bold tracking-tight">Your account</h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            Manage your website session and quickly reach the products and policies connected to your Nexus Web Technology account.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-7">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold">Account email</h2>
            <p className="mt-2 break-all text-sm text-muted-foreground">{user.email}</p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-7">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold">Authentication</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Your web account is authenticated through Supabase Auth.
            </p>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-card p-7">
          <h2 className="text-lg font-semibold">Explore Nexus</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button asChild className="justify-between">
              <Link href="/apps">View Nexus apps <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/utilities">Open free utilities <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/legal/privacy"><FileText className="h-4 w-4" aria-hidden="true" /> Privacy Policy</Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/legal/refund"><FileText className="h-4 w-4" aria-hidden="true" /> Refund Policy</Link>
            </Button>
          </div>
          <Button variant="ghost" className="mt-5" onClick={() => void handleLogout()}>
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Sign out
          </Button>
        </section>
      </div>
    </div>
  );
}
