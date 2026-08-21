import { useEffect, useState, type FormEvent } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";

export default function Login() {
  const { user, login, register, googleLogin } = useAuth();
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate("/"); }, [user, navigate]);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setNotice("");
    if (mode === "register" && form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      if (mode === "login") await login(form.email, form.password);
      else { await register(form.email, form.password); setNotice("Account created. Check your email to confirm your account."); }
    } catch { setError("Unable to complete authentication. Please check your details and try again."); }
    finally { setLoading(false); }
  }
  return <main className="min-h-[calc(100vh-80px)] grid lg:grid-cols-2">
    <section className="hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-12"><div><ShieldCheck className="h-8 w-8 mb-16" /><p className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">Private workspace</p><h1 tabIndex={-1} className="mt-5 max-w-lg text-5xl leading-tight">A quiet place to build, publish, and share.</h1></div><p className="text-sm opacity-70">Kuldeep K Yadav · Editorial workspace</p></section>
    <section className="flex items-center justify-center px-6 py-16"><div className="w-full max-w-md"><Link href="/" className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Back home</Link><div className="mt-12 mb-8"><p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{mode === "login" ? "Welcome back" : "Create account"}</p><h2 className="mt-3 text-4xl">{mode === "login" ? "Sign in" : "Register"}</h2><p className="mt-3 text-muted-foreground">Manage your profile and access the publishing workspace.</p></div>
      <form onSubmit={submit} className="space-y-5"><div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-2 h-12" /></div><div><Label htmlFor="password">Password</Label><Input id="password" type="password" required minLength={8} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="mt-2 h-12" /></div>{mode === "register" && <div><Label htmlFor="confirm">Confirm password</Label><Input id="confirm" type="password" required minLength={8} value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className="mt-2 h-12" /></div>}{error && <p className="text-sm text-destructive">{error}</p>}{notice && <p className="text-sm text-muted-foreground">{notice}</p>}<Button disabled={loading} className="w-full h-12">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{mode === "login" ? "Sign in" : "Create account"}<ArrowRight className="ml-2 h-4 w-4" /></Button></form>
      {mode === "login" && <div className="mt-6 flex justify-center"><GoogleLogin onSuccess={async ({ credential }) => { if (!credential) return; setLoading(true); setError(""); try { await googleLogin(credential); } catch { setError("Google sign-in failed."); } finally { setLoading(false); } }} onError={() => setError("Google sign-in failed.")} /></div>}
      <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setNotice(""); }} className="mt-6 text-sm text-muted-foreground hover:text-foreground">{mode === "login" ? "Need an account? Register" : "Already have an account? Sign in"}</button>
    </div></section>
  </main>;
}
