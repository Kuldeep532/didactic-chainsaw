import { isFirebaseConfigured, getFirebaseAuth } from "./firebase";

export const nexusServices = {
  firebase: {
    configured: isFirebaseConfigured,
    getAuth: () => getFirebaseAuth(),
  },
  supabase: {
    configured: Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
    url: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  },
};

export function getNexusServiceStatus() {
  return {
    firebase: nexusServices.firebase.configured,
    supabase: nexusServices.supabase.configured,
    processing: "browser",
  } as const;
}
