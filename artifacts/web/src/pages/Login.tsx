import { useState, useEffect, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Hexagon, AlertCircle } from "lucide-react";
import { Link } from "wouter";

// VITE_GOOGLE_CLIENT_ID must be set in the environment for Google sign-in to work
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

// Minimal type for Google Identity Services window object
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          prompt: (momentNotification?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Login() {
  const { login, user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2 group">
            <Hexagon className="h-10 w-10 text-primary group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} aria-hidden="true" />
            <span className="font-bold text-lg text-foreground">Nexus Wave Technologies</span>
          </Link>
        </div>

        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm onSuccess={(token, user) => { login(token, user); navigate("/"); }} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm onSuccess={(token, user) => { login(token, user); navigate("/"); }} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────

function LoginForm({ onSuccess }: { onSuccess: (token: string, user: import("@/context/AuthContext").AuthUser) => void }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ emailOrUsername: "", password: "" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      toast({ title: "Welcome back!" });
      onSuccess(data.token, data.user);
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-md bg-destructive/10 text-destructive text-sm px-3 py-2">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="login-id">Email or Username</Label>
            <Input
              id="login-id"
              type="text"
              autoComplete="username email"
              value={form.emailOrUsername}
              onChange={(e) => setForm({ ...form, emailOrUsername: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />Signing in...</> : "Sign In"}
          </Button>

          <GoogleSignInButton onSuccess={onSuccess} />
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────

function RegisterForm({ onSuccess }: { onSuccess: (token: string, user: import("@/context/AuthContext").AuthUser) => void }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }
      toast({ title: "Account created", description: "Welcome to Nexus Wave Technologies." });
      onSuccess(data.token, data.user);
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Join Nexus Wave Technologies with a free account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-md bg-destructive/10 text-destructive text-sm px-3 py-2">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="reg-username">Username</Label>
            <Input
              id="reg-username"
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="yourname"
              pattern="[a-zA-Z0-9_]+"
              minLength={3}
              maxLength={32}
              required
            />
            <p className="text-xs text-muted-foreground">Letters, numbers, and underscores only.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reg-email">Email Address</Label>
            <Input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reg-password">Password</Label>
            <Input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={8}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reg-confirm">Confirm Password</Label>
            <Input
              id="reg-confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />Creating account...</> : "Create Account"}
          </Button>

          <GoogleSignInButton onSuccess={onSuccess} />
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Google Sign-In ───────────────────────────────────────────────────────────

/**
 * Loads the Google Identity Services script once and initialises the One Tap
 * flow.  When a credential is returned it is POSTed to /api/auth/google and
 * the resulting JWT is handed to `onSuccess`.
 *
 * Requires VITE_GOOGLE_CLIENT_ID to be set at build time.  When not set the
 * button is rendered in a disabled/info state so the UI is still consistent.
 */
function GoogleSignInButton({ onSuccess }: { onSuccess: (token: string, user: import("@/context/AuthContext").AuthUser) => void }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [gisReady, setGisReady] = useState(false);

  // Load the GIS script on mount (only when a client ID is configured)
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    if (window.google?.accounts?.id) {
      setGisReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGisReady(true);
    script.onerror = () => {
      console.warn("Failed to load Google Identity Services script");
    };
    document.head.appendChild(script);

    return () => {
      // Cancel any pending One Tap prompt on unmount
      window.google?.accounts.id.cancel();
    };
  }, []);

  const handleCredential = async (credential: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credential }),
      });
      const data = await res.json() as { token?: string; user?: import("@/context/AuthContext").AuthUser; error?: string };
      if (!res.ok || !data.token || !data.user) {
        toast({ title: data.error ?? "Google sign-in failed", variant: "destructive" });
        return;
      }
      toast({ title: "Signed in with Google" });
      onSuccess(data.token, data.user);
    } catch {
      toast({ title: "Google sign-in failed. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      toast({
        title: "Google Sign-In not configured",
        description: "Set VITE_GOOGLE_CLIENT_ID in your environment to enable Google sign-in.",
        variant: "destructive",
      });
      return;
    }

    if (!gisReady || !window.google?.accounts?.id) {
      toast({ title: "Google Sign-In is loading — please try again", variant: "destructive" });
      return;
    }

    setLoading(true);

    // Initialise GIS with a one-time callback for this sign-in attempt
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: ({ credential }) => {
        handleCredential(credential).finally(() => setLoading(false));
      },
      use_fedcm_for_prompt: true,
    });

    // Show the One Tap prompt
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // One Tap was blocked (third-party cookie restrictions, etc.)
        // Fall back: let the user know and stop loading
        setLoading(false);
        toast({
          title: "Google One Tap was blocked by your browser",
          description: "Try disabling third-party cookie restrictions or use email sign-in.",
          variant: "destructive",
        });
      }
    });
  };

  const isConfigured = Boolean(GOOGLE_CLIENT_ID);

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-2 text-muted-foreground">Or</span>
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full mt-4"
        onClick={handleClick}
        disabled={loading || (isConfigured && !gisReady)}
        title={!isConfigured ? "Google Sign-In requires VITE_GOOGLE_CLIENT_ID to be configured" : undefined}
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
      {!isConfigured && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          Google sign-in requires configuration — use email sign-in above.
        </p>
      )}
    </div>
  );
}
