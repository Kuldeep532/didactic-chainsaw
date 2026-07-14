import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  isFirebaseConfigured,
} from "@/lib/firebase";
import {
  Loader2, Hexagon, Eye, EyeOff, AlertCircle, CheckCircle2,
  ShieldCheck, Zap, Globe, Smartphone, Lock, ArrowRight,
} from "lucide-react";
import { Link } from "wouter";

const BASE = (import.meta.env.VITE_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

const BENEFITS = [
  { icon: <ShieldCheck className="h-5 w-5" />, title: "Secure Authentication", desc: "Firebase-backed auth with Google Sign-In support." },
  { icon: <Zap className="h-5 w-5" />, title: "Admin Panel Access", desc: "Manage blog posts, view messages, and send notifications." },
  { icon: <Globe className="h-5 w-5" />, title: "Personalised Experience", desc: "Your session stays synced across devices." },
  { icon: <Smartphone className="h-5 w-5" />, title: "Mobile App Integration", desc: "Same account works across Nexus Plus and Geeta Nexus." },
];

export default function Login() {
  const { login, user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  if (user) {
    navigate("/");
    return null;
  }

  const handleFirebaseSuccess = async (firebaseToken: string) => {
    const res = await fetch(`${BASE}/api/auth/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: firebaseToken }),
    });
    const data = await res.json();
    if (!res.ok || !data.token || !data.user) {
      throw new Error(data.error ?? "Server sign-in failed");
    }
    toast({ title: "Welcome to Nexus Wave Technologies 👋" });
    login(data.token, data.user);
    navigate("/");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      {/* Left panel — benefits (desktop only) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] bg-gradient-to-br from-primary/5 via-primary/10 to-blue-600/10 border-r border-border flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2.5 group w-fit" aria-label="Nexus Wave Technologies Home">
          <Hexagon className="h-9 w-9 text-primary group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} aria-hidden="true" />
          <span className="font-bold text-xl text-foreground">Nexus Wave</span>
        </Link>

        <div>
          <h2 className="text-3xl font-bold mb-3 leading-snug">
            One account.<br />
            The entire <span className="text-primary">Nexus Wave</span> ecosystem.
          </h2>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            Sign in to access the admin panel, manage your apps, and experience the full platform.
          </p>

          <div className="space-y-5">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex items-start gap-4">
                <div className="shrink-0 p-2 bg-primary/10 rounded-lg text-primary">{b.icon}</div>
                <div>
                  <p className="font-semibold text-sm">{b.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground/60">
          &copy; {new Date().getFullYear()} Nexus Wave Technologies · info@nexusweb.co.in
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center gap-2 group">
              <Hexagon className="h-10 w-10 text-primary group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} aria-hidden="true" />
              <span className="font-bold text-lg text-foreground">Nexus Wave Technologies</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your account to continue.</p>
          </div>

          {!isFirebaseConfigured && (
            <div className="flex gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 text-sm text-amber-800 dark:text-amber-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication not configured</p>
                <p className="text-xs mt-0.5 opacity-80">Set the <code className="font-mono">VITE_FIREBASE_*</code> environment variables to enable login.</p>
              </div>
            </div>
          )}

          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm onSuccess={handleFirebaseSuccess} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm onSuccess={handleFirebaseSuccess} />
            </TabsContent>
          </Tabs>

          <p className="text-xs text-center text-muted-foreground mt-8">
            By continuing, you agree to our{" "}
            <Link href="/legal/terms" className="underline hover:text-foreground">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────

function LoginForm({ onSuccess }: { onSuccess: (firebaseToken: string) => Promise<void> }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isFirebaseConfigured) { setError("Authentication is not configured. Set VITE_FIREBASE_* env vars."); return; }
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const { token } = await signInWithEmail(form.email, form.password);
      await onSuccess(token);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      setError(friendlyError(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="login-email">Email address</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
          disabled={loading}
          className="h-11"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <Label htmlFor="login-password">Password</Label>
          <button type="button" className="text-xs text-muted-foreground hover:text-primary transition-colors" tabIndex={-1}>
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            type={showPass ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
            disabled={loading}
            className="h-11 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full h-11 font-semibold" disabled={loading || !isFirebaseConfigured}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Sign In
        {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
      </Button>

      <GoogleSignInButton onSuccess={onSuccess} />
    </form>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────

function RegisterForm({ onSuccess }: { onSuccess: (firebaseToken: string) => Promise<void> }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });

  const strength = passwordStrength(form.password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isFirebaseConfigured) { setError("Authentication is not configured. Set VITE_FIREBASE_* env vars."); return; }
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const { token } = await signUpWithEmail(form.email, form.password);
      toast({ title: "Account created! Welcome to Nexus Wave 🎉" });
      await onSuccess(token);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(friendlyError(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="reg-email">Email address</Label>
        <Input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
          disabled={loading}
          className="h-11"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-password">Password</Label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showPass ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
            disabled={loading}
            className="h-11 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {form.password && (
          <div className="mt-1.5">
            <div className="flex gap-1 mb-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength.score ? strength.color : "bg-muted"}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{strength.label}</p>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-confirm">Confirm password</Label>
        <div className="relative">
          <Input
            id="reg-confirm"
            type={showPass ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            required
            disabled={loading}
            className={`h-11 pr-10 ${form.confirmPassword && form.password !== form.confirmPassword ? "border-destructive" : form.confirmPassword && form.password === form.confirmPassword ? "border-green-500" : ""}`}
          />
          {form.confirmPassword && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {form.password === form.confirmPassword
                ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                : <AlertCircle className="h-4 w-4 text-destructive" />}
            </span>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full h-11 font-semibold" disabled={loading || !isFirebaseConfigured}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
        Create Account
      </Button>

      <GoogleSignInButton onSuccess={onSuccess} />
    </form>
  );
}

// ─── Google Button ────────────────────────────────────────────────────────────

function GoogleSignInButton({ onSuccess }: { onSuccess: (token: string) => Promise<void> }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!isFirebaseConfigured) { toast({ title: "Authentication is not configured", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const { token } = await signInWithGoogle();
      await onSuccess(token);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign-in failed";
      toast({ title: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex items-center my-4">
        <div className="flex-1 border-t border-border" />
        <span className="px-3 text-xs text-muted-foreground bg-background">OR</span>
        <div className="flex-1 border-t border-border" />
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 font-medium"
        onClick={handleClick}
        disabled={loading || !isFirebaseConfigured}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
        ) : (
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        )}
        Continue with Google
      </Button>
    </>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw) && /[^a-zA-Z0-9]/.test(pw)) score++;
  const labels = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-green-600"];
  return { score, label: labels[score] ?? "Strong", color: colors[score] ?? "bg-green-500" };
}

function friendlyError(msg: string): string {
  if (msg.includes("wrong-password") || msg.includes("invalid-credential")) return "Incorrect email or password.";
  if (msg.includes("user-not-found")) return "No account found with this email.";
  if (msg.includes("email-already-in-use")) return "An account with this email already exists.";
  if (msg.includes("weak-password")) return "Password is too weak. Use at least 6 characters.";
  if (msg.includes("invalid-email")) return "Please enter a valid email address.";
  if (msg.includes("too-many-requests")) return "Too many attempts. Please wait and try again.";
  if (msg.includes("popup-closed")) return "Sign-in cancelled. Please try again.";
  return msg;
}
