const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/+$/, "") ?? "";
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

const ACCESS_TOKEN_KEY = "nwt_supabase_access_token";
const REFRESH_TOKEN_KEY = "nwt_supabase_refresh_token";

export interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  email_confirmed_at?: string | null;
  created_at?: string;
}

export interface AuthResult {
  user: SupabaseUser;
  accessToken: string | null;
  refreshToken: string | null;
  confirmationRequired: boolean;
}

interface SessionResponse {
  access_token?: string;
  refresh_token?: string;
  user?: SupabaseUser;
  error?: string;
  error_description?: string;
  msg?: string;
}

function assertConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error("Sign-in is temporarily unavailable. Please try again later.");
  }
}

function authHeaders(accessToken?: string): HeadersInit {
  return {
    apikey: SUPABASE_KEY,
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}

async function readError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as SessionResponse;
    return payload.error_description ?? payload.msg ?? payload.error ?? "Authentication request failed.";
  } catch {
    return "Authentication request failed.";
  }
}

function storeTokens(accessToken: string | null, refreshToken: string | null) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  else localStorage.removeItem(ACCESS_TOKEN_KEY);

  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  else localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
  assertConfigured();

  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error(await readError(response));

  const data = (await response.json()) as SessionResponse;
  if (!data.user || !data.access_token) throw new Error("Sign-in completed without a valid session.");

  storeTokens(data.access_token, data.refresh_token ?? null);
  return {
    user: data.user,
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? null,
    confirmationRequired: false,
  };
}

export async function signUpWithPassword(email: string, password: string): Promise<AuthResult> {
  assertConfigured();

  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error(await readError(response));

  const data = (await response.json()) as SessionResponse;
  if (!data.user) throw new Error("Account creation did not return a user record.");

  const confirmationRequired = !data.access_token;
  storeTokens(data.access_token ?? null, data.refresh_token ?? null);

  return {
    user: data.user,
    accessToken: data.access_token ?? null,
    refreshToken: data.refresh_token ?? null,
    confirmationRequired,
  };
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken || !isSupabaseConfigured) return null;

  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    return null;
  }

  const data = (await response.json()) as SessionResponse;
  if (!data.access_token) {
    clearTokens();
    return null;
  }

  storeTokens(data.access_token, data.refresh_token ?? refreshToken);
  return data.access_token;
}

export async function getSessionUser(): Promise<{ user: SupabaseUser | null; accessToken: string | null }> {
  if (!isSupabaseConfigured) {
    clearTokens();
    return { user: null, accessToken: null };
  }

  let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!accessToken) return { user: null, accessToken: null };

  let response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: authHeaders(accessToken),
  });

  if (response.status === 401) {
    accessToken = await refreshAccessToken();
    if (!accessToken) return { user: null, accessToken: null };
    response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: authHeaders(accessToken),
    });
  }

  if (!response.ok) {
    clearTokens();
    return { user: null, accessToken: null };
  }

  const user = (await response.json()) as SupabaseUser;
  return { user, accessToken };
}

export async function signOutFromSupabase() {
  if (!isSupabaseConfigured) {
    clearTokens();
    return;
  }

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (accessToken) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: authHeaders(accessToken),
    }).catch(() => undefined);
  }

  clearTokens();
}
