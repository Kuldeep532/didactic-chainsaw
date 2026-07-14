import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getFirebaseAuth, onAuthStateChanged, signOut, isFirebaseConfigured } from "@/lib/firebase";

export interface AuthUser {
  id: number;
  email: string;
  name: string | null;
  picture: string | null;
  isAdmin: boolean;
  username: string | null;
  firebaseUid: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  firebaseConfigured: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "nwt_auth_token";
const USER_KEY = "nwt_auth_user";

const BASE = (import.meta.env.VITE_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const firebaseConfigured = isFirebaseConfigured;

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    if (isFirebaseConfigured) {
      try {
        await signOut(getFirebaseAuth());
      } catch {
        // ignore Firebase sign-out errors
      }
    }
  }, []);

  // Verify stored backend token on mount and sync Firebase auth state.
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const verifyToken = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`${BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (res.ok) {
          const u = (await res.json()) as AuthUser;
          setUser(u);
          localStorage.setItem(USER_KEY, JSON.stringify(u));
        } else {
          throw new Error("token invalid");
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();

    if (isFirebaseConfigured) {
      unsubscribe = onAuthStateChanged(getFirebaseAuth(), (fbUser) => {
        if (!fbUser) {
          // Firebase signed out; clear local session if we still had one.
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        }
      });
    }

    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, firebaseConfigured, login, logout }}>
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
