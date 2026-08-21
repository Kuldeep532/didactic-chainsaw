import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL ?? import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(
  url ?? "https://placeholder.supabase.co",
  key ?? "placeholder-anon-key",
);

export type ContentPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
};

export async function isAdmin(userId: string) {
  const { data } = await supabase.from("profiles").select("is_admin").eq("id", userId).maybeSingle();
  return data?.is_admin === true;
}

export async function publicPosts() {
  const { data, error } = await supabase.from("posts").select("*").eq("published", true).order("published_at", { ascending: false });
  if (error) throw error;
  return data as ContentPost[];
}

export async function publicApps() {
  const { data, error } = await supabase.from("apps").select("*").eq("published", true).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function publicResources() {
  const { data, error } = await supabase.from("resources").select("*").eq("published", true).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
