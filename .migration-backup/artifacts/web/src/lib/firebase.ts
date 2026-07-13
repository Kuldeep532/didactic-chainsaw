import { initializeApp, type FirebaseApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type Auth,
  type IdTokenResult,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured) throw new Error("Firebase is not configured. Set VITE_FIREBASE_* environment variables.");
  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<{ user: User; token: string; idTokenResult: IdTokenResult }> {
  const result = await signInWithPopup(getFirebaseAuth(), googleProvider);
  const idTokenResult = await result.user.getIdTokenResult(true);
  return { user: result.user, token: idTokenResult.token, idTokenResult };
}

export async function signUpWithEmail(email: string, password: string): Promise<{ user: User; token: string; idTokenResult: IdTokenResult }> {
  const result = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
  const idTokenResult = await result.user.getIdTokenResult(true);
  return { user: result.user, token: idTokenResult.token, idTokenResult };
}

export async function signInWithEmail(email: string, password: string): Promise<{ user: User; token: string; idTokenResult: IdTokenResult }> {
  const result = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  const idTokenResult = await result.user.getIdTokenResult(true);
  return { user: result.user, token: idTokenResult.token, idTokenResult };
}

export { signOut, onAuthStateChanged, type User, type Auth, type IdTokenResult };
