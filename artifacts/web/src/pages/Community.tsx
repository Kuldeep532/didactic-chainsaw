
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "wouter";
import { BookOpen, Heart, Loader2, PenLine, Send, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

type Post = {
  id: string;
  title: string;
  content: string;
  post_type: string;
  app_scope: "geeta_nexus" | "nexus_plus" | "both";
  is_free: boolean;
  created_at: string;
};

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/+$/, "") ?? "";
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ?? "";

async function request(path: string, token: string | null, init?: RequestInit) {
  const response = await fetch(SUPABASE_URL + path, {
    ...init,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: token ? "Bearer " + token : "Bearer " + SUPABASE_KEY,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) throw new Error(await response.text());
  return response;
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
}

export default function Community() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [teamMember, setTeamMember] = useState<{ app_scope: string; can_publish_spiritual_posts: boolean; can_publish_nexus_plus_posts: boolean } | null>(null);
  const [form, setForm] = useState({ title: "", content: "", postType: "spiritual", appScope: "geeta_nexus" });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoadingPosts(true);
    try {
      const response = await request("/rest/v1/nexus_posts?select=id,title,content,post_type,app_scope,is_free,created_at&status=eq.approved&is_free=eq.true&order=created_at.desc", token);
      setPosts((await response.json()) as Post[]);
      if (token && user) {
        const memberResponse = await request("/rest/v1/nexus_team_members?select=app_scope,can_publish_spiritual_posts,can_publish_nexus_plus_posts&user_id=eq." + user.id + "&active=eq.true&limit=1", token);
        const members = await memberResponse.json() as Array<{ app_scope: string; can_publish_spiritual_posts: boolean; can_publish_nexus_plus_posts: boolean }>;
        setTeamMember(members[0] ?? null);
      }
    } catch {
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => { void load(); }, [token, user?.id]);

  const canPublishSpiritual = Boolean(teamMember?.can_publish_spiritual_posts);
  const canPublishNexus = Boolean(teamMember?.can_publish_nexus_plus_posts);
  const allowedScopes = useMemo(() => {
    const values: Array<"geeta_nexus" | "nexus_plus" | "both"> = [];
    if (canPublishSpiritual) values.push("geeta_nexus");
    if (canPublishNexus) values.push("nexus_plus");
    if (canPublishSpiritual && canPublishNexus) values.push("both");
    return values;
  }, [canPublishSpiritual, canPublishNexus]);

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !token || !allowedScopes.length || !form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    try {
      const spiritual = form.appScope === "geeta_nexus" || form.postType === "spiritual" || form.postType === "teaching";
      await request("/rest/v1/nexus_posts", token, {
        method: "POST",
        body: JSON.stringify({
          author_id: user.id,
          title: form.title.trim(),
          slug: slugify(form.title) + "-" + crypto.randomUUID().slice(0, 8),
          content: form.content.trim(),
          post_type: form.postType,
          app_scope: form.appScope,
          status: "pending",
          is_free: spiritual,
        }),
      });
      toast({ title: "Post submitted", description: "Your post is waiting for admin review." });
      setForm({ title: "", content: "", postType: "spiritual", appScope: form.appScope });
      await load();
    } catch {
      toast({ title: "Could not submit post", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col pb-20">
      <section className="border-b border-border bg-background px-4 pb-16 pt-24 md:px-8">
        <div className="mx-auto max-w-screen-xl">
          <p className="mb-3 text-sm font-medium text-muted-foreground">Nexus Community</p>
          <h1 className="mb-5 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">Spiritual knowledge, community and useful updates.</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
            The previous blog is now a community publishing space connected to Geeta Nexus and Nexus Plus.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-card py-10">
        <div className="mx-auto grid max-w-screen-xl gap-5 px-4 md:grid-cols-3 md:px-8">
          <Info icon={<BookOpen className="h-5 w-5" />} title="Geeta Nexus">Bhagavad Gita, spiritual learning and teaching content. Spiritual posts are free.</Info>
          <Info icon={<Sparkles className="h-5 w-5" />} title="Nexus Plus">Product updates, practical guides and community information for Nexus Plus.</Info>
          <Info icon={<Heart className="h-5 w-5" />} title="Free spiritual posts">Spiritual content for Geeta Nexus is always published as free community content.</Info>
        </div>
      </section>

      <section className="bg-background py-14">
        <div className="mx-auto grid max-w-screen-xl gap-8 px-4 md:px-8 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="mb-6 flex items-center gap-3"><Users className="h-5 w-5" /><h2 className="text-2xl font-bold">Community posts</h2></div>
            {loadingPosts ? (
              <div className="flex items-center gap-2 py-16 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Loading posts…</div>
            ) : posts.length === 0 ? (
              <Card><CardContent className="py-14 text-center text-muted-foreground">No approved community posts yet.</CardContent></Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{post.app_scope === "geeta_nexus" ? "Geeta Nexus" : post.app_scope === "nexus_plus" ? "Nexus Plus" : "Both"}</Badge>
                        {post.is_free && <Badge>Free</Badge>}
                      </div>
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent><p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{post.content}</p></CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <aside>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><PenLine className="h-5 w-5" /> Write a post</CardTitle></CardHeader>
              <CardContent>
                {!user ? (
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p>Sign in first. Publishing is available only to approved team members.</p>
                    <Button asChild className="w-full"><Link href="/login">Sign in</Link></Button>
                    <Button asChild variant="outline" className="w-full"><Link href="/join-team">Join Our Team</Link></Button>
                  </div>
                ) : !teamMember ? (
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p>Your account is signed in, but it is not yet an approved team account.</p>
                    <Button asChild className="w-full"><Link href="/join-team">Apply to Join the Team</Link></Button>
                  </div>
                ) : (
                  <form onSubmit={submitPost} className="space-y-4">
                    <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
                      <p className="font-medium text-foreground">Approved team member</p>
                      <p className="text-muted-foreground">{teamMember.app_scope.replace("_", " ")}</p>
                    </div>
                    <div className="space-y-2"><Label htmlFor="post-title">Title</Label><Input id="post-title" value={form.title} onChange={(e) => setForm(v => ({...v, title:e.target.value}))} required /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2"><Label htmlFor="post-type">Post type</Label>
                        <select id="post-type" className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={form.postType} onChange={(e)=>setForm(v=>({...v,postType:e.target.value}))}>
                          {canPublishSpiritual && <><option value="spiritual">Spiritual post</option><option value="teaching">Teaching</option></>}
                          {canPublishNexus && <><option value="nexus_plus">Nexus Plus update</option><option value="community">Community</option></>}
                        </select>
                      </div>
                      <div className="space-y-2"><Label htmlFor="post-scope">App</Label>
                        <select id="post-scope" className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={form.appScope} onChange={(e)=>setForm(v=>({...v,appScope:e.target.value}))}>
                          {allowedScopes.map(scope => <option key={scope} value={scope}>{scope === "geeta_nexus" ? "Geeta Nexus" : scope === "nexus_plus" ? "Nexus Plus" : "Both"}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="post-content">Content</Label><Textarea id="post-content" value={form.content} onChange={(e)=>setForm(v=>({...v,content:e.target.value}))} minLength={40} required className="min-h-44" /></div>
                    <Button type="submit" className="w-full" disabled={submitting}><Send className="mr-2 h-4 w-4" />{submitting ? "Submitting…" : "Submit for review"}</Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}

function Info({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <Card><CardContent className="p-6"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-border">{icon}</div><h2 className="mb-2 font-semibold">{title}</h2><p className="text-sm leading-relaxed text-muted-foreground">{children}</p></CardContent></Card>;
}
