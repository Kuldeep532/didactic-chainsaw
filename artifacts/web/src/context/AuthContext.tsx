import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase, isAdmin } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  isAdmin: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapUser(user: User, admin: boolean): AuthUser {
  return { id: user.id, email: user.email ?? "", name: user.user_metadata?.name ?? null, picture: null, isAdmin: admin };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) setUser(mapUser(data.session.user, await isAdmin(data.session.user.id)));
      setIsLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) setUser(mapUser(nextSession.user, await isAdmin(nextSession.user.id)));
      else setUser(null);
      setIsLoading(false);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  const value: AuthContextValue = {
    user, session, isLoading,
    login: async (email, password) => { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; },
    googleLogin: async (idToken) => {
      const response = await fetch("/api/v1/auth/google", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idToken, appId: "web", platform: "web", origin: window.location.origin }) });
      if (!response.ok) throw new Error("Google sign-in failed.");
      const data = await response.json();
      if (data.token) sessionStorage.setItem("backend_session", data.token);
      const { error } = await supabase.auth.signInWithIdToken({ provider: "google", token: idToken });
      if (error) throw error;
    },
    register: async (email, password) => { const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/login` } }); if (error) throw error; },
    logout: async () => { await supabase.auth.signOut(); },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used within AuthProvider"); return value; }
export function getAuthHeaders(session: Session | null) { return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}; }
