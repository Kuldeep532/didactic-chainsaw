import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import {
  getSessionUser,
  isSupabaseConfigured,
  signInWithPassword,
  signUpWithPassword,
  signOutFromSupabase,
  type SupabaseUser,
  type AuthResult,
} from "@/lib/supabase";

const MAIN_ADMIN_EMAIL = "kuldeepky538@gmail.com";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  isAdmin: boolean;
  username: string | null;
  firebaseUid: string | null;
  supabaseUser: SupabaseUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  firebaseConfigured: boolean;
  supabaseConfigured: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapUser(user: SupabaseUser): AuthUser {
  const metadata = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? "",
    name: typeof metadata.full_name === "string" ? metadata.full_name : typeof metadata.name === "string" ? metadata.name : null,
    picture: typeof metadata.avatar_url === "string" ? metadata.avatar_url : null,
    username: typeof metadata.username === "string" ? metadata.username : null,
    firebaseUid: null,
    isAdmin: user.email?.toLowerCase() === MAIN_ADMIN_EMAIL,
    supabaseUser: user,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncSession = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }
    try {
      const session = await getSessionUser();
      setToken(session.accessToken);
      setUser(session.user ? mapUser(session.user) : null);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    void syncSession().finally(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [syncSession]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await signInWithPassword(email, password);
    setToken(result.accessToken);
    setUser(mapUser(result.user));
    return result;
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const result = await signUpWithPassword(email, password);
    setToken(result.accessToken);
    setUser(result.accessToken ? mapUser(result.user) : null);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await signOutFromSupabase();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        firebaseConfigured: false,
        supabaseConfigured: isSupabaseConfigured,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getAuthHeaders(token: string | null): Record<string, string> {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
