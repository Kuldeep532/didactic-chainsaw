import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export default function Login() {
  const { login, register, user, supabaseConfigured } = useAuth();
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<"login" | "register">("login");

  if (user) {
    navigate("/nexus");
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-16 md:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <section className="rounded-2xl border border-border bg-card p-8 md:p-10">
            <p className="mb-3 text-sm font-medium text-muted-foreground">Nexus account</p>
            <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Sign in to Nexus Wave</h1>
            <p className="mb-8 text-muted-foreground leading-relaxed">
              Use one account for your Nexus Wave web experience. Connected Nexus apps can use the same Supabase account.
            </p>
            <div className="space-y-5">
              <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">Your password is handled by Supabase Auth and is never stored in this website application.</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">You can review account and data handling in our Privacy Policy.</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-8 md:p-10">
            {!supabaseConfigured ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5" role="alert">
                <div className="flex gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
                  <div>
                    <h2 className="font-semibold text-foreground">Sign-in is not configured yet</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Configure the Supabase project URL and publishable key in the website hosting environment.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <Tabs value={mode} onValueChange={(value) => setMode(value as "login" | "register")}>
                <TabsList className="mb-7 grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign in</TabsTrigger>
                  <TabsTrigger value="register">Create account</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <AuthForm mode="login" onSubmit={login} onSuccess={() => navigate("/nexus")} />
                </TabsContent>
                <TabsContent value="register">
                  <AuthForm mode="register" onSubmit={register} onSuccess={() => navigate("/nexus")} />
                </TabsContent>
              </Tabs>
            )}

            <p className="mt-7 text-center text-xs leading-relaxed text-muted-foreground">
              By creating an account, you agree to the{" "}
              <Link href="/legal/terms" className="underline hover:text-foreground">Terms and Conditions</Link>
              {" "}and acknowledge the{" "}
              <Link href="/legal/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function AuthForm({
  mode,
  onSubmit,
  onSuccess,
}: {
  mode: "login" | "register";
  onSubmit: (email: string, password: string) => Promise<{ confirmationRequired: boolean }>;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isRegister = mode === "register";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email address and password.");
      return;
    }
    if (password.length < 8) {
      setError("Please use at least 8 characters for your password.");
      return;
    }
    if (isRegister && password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const result = await onSubmit(email.trim(), password);
      if (isRegister && result.confirmationRequired) {
        toast({
          title: "Check your email",
          description: "Your account was created. Confirm your email address before signing in.",
        });
        return;
      }
      toast({
        title: isRegister ? "Account created" : "Welcome back",
        description: "You are now signed in to Nexus Wave.",
      });
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(userFriendlyAuthError(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor={`${mode}-email`}>Email address</Label>
        <Input
          id={`${mode}-email`}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${mode}-password`}>Password</Label>
        <div className="relative">
          <Input
            id={`${mode}-password`}
            type={showPassword ? "text" : "password"}
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            required
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isRegister && (
        <div className="space-y-2">
          <Label htmlFor="register-confirm">Confirm password</Label>
          <Input
            id="register-confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter the password again"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={loading}
            required
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : isRegister ? <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" /> : <LockKeyhole className="mr-2 h-4 w-4" aria-hidden="true" />}
        {isRegister ? "Create account" : "Sign in"}
      </Button>
    </form>
  );
}

function userFriendlyAuthError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials") || lower.includes("invalid credential")) return "The email or password is incorrect.";
  if (lower.includes("already registered") || lower.includes("already been registered")) return "An account with this email already exists.";
  if (lower.includes("password") && lower.includes("weak")) return "Please choose a stronger password.";
  if (lower.includes("email")) return "Please check the email address and try again.";
  if (lower.includes("rate limit") || lower.includes("too many")) return "Too many attempts. Please wait a little and try again.";
  return message;
}
