import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminListContactMessages, useAdminListSupportRequests,
  useCreateNotification, useCreateBlogPost, useListBlogPosts,
} from "@workspace/api-client-react";
import { Loader2, RefreshCw, Upload, Trash2, CheckCircle, XCircle, Clock, ShieldAlert, Megaphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { Link } from "wouter";

const BASE = (import.meta.env.VITE_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

function getHeaders(token: string | null): Record<string, string> {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

// ─── Access guard ─────────────────────────────────────────────────────────────

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>You must be signed in to access the admin panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" aria-hidden="true" />
              Access Denied
            </CardTitle>
            <CardDescription>Your account does not have admin privileges.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

// ─── Contacts Tab ─────────────────────────────────────────────────────────────

function ContactsTab() {
  const { token } = useAuth();
  const { data, isLoading } = useAdminListContactMessages({
    request: { headers: getHeaders(token) },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading contacts...</p>;
  if (!data?.length) return <p className="text-muted-foreground">No contact messages yet.</p>;

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((msg) => (
            <TableRow key={msg.id}>
              <TableCell className="font-medium">{msg.firstName} {msg.lastName}</TableCell>
              <TableCell>{msg.email}</TableCell>
              <TableCell>{msg.subject}</TableCell>
              <TableCell className="max-w-xs truncate">{msg.message}</TableCell>
              <TableCell>{new Date(msg.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Support Tab ──────────────────────────────────────────────────────────────

function SupportTab() {
  const { token } = useAuth();
  const { data, isLoading } = useAdminListSupportRequests({
    request: { headers: getHeaders(token) },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading support requests...</p>;
  if (!data?.length) return <p className="text-muted-foreground">No support requests yet.</p>;

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>App</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((req) => (
            <TableRow key={req.id}>
              <TableCell className="font-medium">{req.name}</TableCell>
              <TableCell><Badge variant="outline">{req.appId}</Badge></TableCell>
              <TableCell>{req.subject}</TableCell>
              <TableCell className="max-w-xs truncate">{req.message}</TableCell>
              <TableCell>{req.status}</TableCell>
              <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Blog Tab ─────────────────────────────────────────────────────────────────

function BlogTab() {
  const { token } = useAuth();
  const { data: posts, isLoading } = useListBlogPosts();
  const createPost = useCreateBlogPost();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: "", slug: "", content: "", excerpt: "", category: "" });
  const [scraping, setScraping] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createPost.mutate(
      { data: form },
      {
        onSuccess: () => {
          toast({ title: "Blog post created" });
          setForm({ title: "", slug: "", content: "", excerpt: "", category: "" });
        },
        onError: () => toast({ title: "Failed to create post", variant: "destructive" }),
      }
    );
  };

  const handleScrape = async () => {
    setScraping(true);
    try {
      const res = await fetch(`${BASE}/api/admin/scrape-blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getHeaders(token) },
      });
      if (!res.ok) throw new Error();
      const data = await res.json() as { insertedCount: number };
      toast({ title: `Scraped ${data.insertedCount} new articles` });
      queryClient.invalidateQueries({ queryKey: ["/blog-posts"] });
    } catch {
      toast({ title: "Scrape failed", variant: "destructive" });
    } finally {
      setScraping(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${BASE}/api/admin/blog-posts/${id}`, {
        method: "DELETE",
        headers: getHeaders(token),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Post deleted" });
      queryClient.invalidateQueries({ queryKey: ["/blog-posts"] });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Auto-Scrape Blog</CardTitle>
          <Button variant="outline" size="sm" onClick={handleScrape} disabled={scraping}>
            {scraping ? <Loader2 className="h-4 w-4 animate-spin mr-1" aria-hidden="true" /> : <RefreshCw className="h-4 w-4 mr-1" aria-hidden="true" />}
            {scraping ? "Scraping..." : "Scrape RSS"}
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Pull latest articles from Hacker News and TechCrunch RSS feeds. Duplicates are skipped automatically.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">New Blog Post</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="bp-title">Title</Label>
                <Input id="bp-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bp-slug">Slug</Label>
                <Input id="bp-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bp-category">Category</Label>
              <Input id="bp-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Technology, News, Updates" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bp-excerpt">Excerpt</Label>
              <Input id="bp-excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bp-content">Content</Label>
              <Textarea id="bp-content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} required />
            </div>
            <Button type="submit" disabled={createPost.isPending}>Publish Post</Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold mb-4">Published Posts</h3>
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : posts?.length ? (
          <div className="space-y-3">
            {posts.map((p) => (
              <Card key={p.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{p.title}</p>
                      <p className="text-sm text-muted-foreground">/{p.slug} · {new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={p.published ? "default" : "secondary"}>{p.published ? "Published" : "Draft"}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)} aria-label={`Delete post ${p.title}`}>
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No blog posts yet.</p>
        )}
      </div>
    </div>
  );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────

function NotificationsTab() {
  const createNotif = useCreateNotification();
  const { toast } = useToast();
  const [channel, setChannel] = useState("nexus_plus");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [actionUrl, setActionUrl] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createNotif.mutate(
      { data: { targetChannel: channel, title, message, actionUrl, broadcastType: "website_news" } },
      {
        onSuccess: () => {
          toast({ title: "Notification sent" });
          setTitle(""); setMessage(""); setActionUrl("");
        },
        onError: () => toast({ title: "Failed to send notification", variant: "destructive" }),
      }
    );
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Send App Notification</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="n-channel">Target App</Label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger id="n-channel"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="nexus_plus">Nexus Plus</SelectItem>
                <SelectItem value="geeta_nexus">Geeta Nexus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="n-title">Title</Label>
            <Input id="n-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="n-message">Message</Label>
            <Textarea id="n-message" value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="n-url">Action URL (optional)</Label>
            <Input id="n-url" type="url" value={actionUrl} onChange={(e) => setActionUrl(e.target.value)} placeholder="https://..." />
          </div>
          <Button type="submit" disabled={createNotif.isPending}>
            {createNotif.isPending ? "Broadcasting..." : "Broadcast Notification"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Global Messages Tab ────────────────────────────────────────────────────

interface GlobalMessage {
  id: number;
  title: string;
  message: string;
  target: string;
  enabled: boolean;
  actionUrl: string | null;
  kind: string;
  startsAt: string;
  expiresAt: string;
  createdAt: string;
}

function GlobalMessagesTab() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<GlobalMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    message: "",
    target: "all",
    kind: "info",
    actionUrl: "",
    startsAt: "",
    expiresAt: "",
    enabled: true,
  });

  const load = async () => {
    try {
      const res = await fetch(`${BASE}/api/admin/messages`, { headers: getHeaders(token) });
      if (res.ok) setMessages(await res.json() as GlobalMessage[]);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim() || !form.startsAt || !form.expiresAt) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(`${BASE}/api/admin/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getHeaders(token) },
        body: JSON.stringify({
          title: form.title,
          message: form.message,
          target: form.target,
          kind: form.kind,
          actionUrl: form.actionUrl || undefined,
          startsAt: new Date(form.startsAt).toISOString(),
          expiresAt: new Date(form.expiresAt).toISOString(),
          enabled: form.enabled,
        }),
      });
      if (!res.ok) throw new Error("Failed to create message");
      toast({ title: "Announcement created" });
      setForm({ title: "", message: "", target: "all", kind: "info", actionUrl: "", startsAt: "", expiresAt: "", enabled: true });
      load();
    } catch {
      toast({ title: "Failed to create announcement", variant: "destructive" });
    }
  };

  const toggle = async (id: number, enabled: boolean) => {
    const res = await fetch(`${BASE}/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getHeaders(token) },
      body: JSON.stringify({ enabled: !enabled }),
    });
    if (res.ok) {
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, enabled: !enabled } : m));
      toast({ title: enabled ? "Announcement disabled" : "Announcement enabled" });
    }
  };

  const remove = async (id: number) => {
    const res = await fetch(`${BASE}/api/admin/messages/${id}`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Announcement deleted" });
    }
  };

  const statusBadge = (m: GlobalMessage) => {
    const now = new Date().toISOString();
    if (!m.enabled) return <Badge variant="outline">Disabled</Badge>;
    if (m.startsAt > now) return <Badge variant="secondary">Scheduled</Badge>;
    if (m.expiresAt < now) return <Badge variant="destructive">Expired</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Megaphone className="h-5 w-5" aria-hidden="true" />
            New Announcement
          </CardTitle>
          <CardDescription>Create timed messages for the website or mobile apps. Expired messages disappear automatically.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="msg-title">Title <span aria-hidden="true">*</span></Label>
                <Input id="msg-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="msg-target">Target</Label>
                <Select value={form.target} onValueChange={(v) => setForm({ ...form, target: v })}>
                  <SelectTrigger id="msg-target"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="nexus_plus">Nexus Plus App</SelectItem>
                    <SelectItem value="geeta_nexus">Geeta Nexus App</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="msg-body">Message <span aria-hidden="true">*</span></Label>
              <Textarea id="msg-body" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="msg-kind">Kind</Label>
                <Select value={form.kind} onValueChange={(v) => setForm({ ...form, kind: v })}>
                  <SelectTrigger id="msg-kind"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="msg-start">Start Time <span aria-hidden="true">*</span></Label>
                <Input id="msg-start" type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="msg-expiry">Expiry Time <span aria-hidden="true">*</span></Label>
                <Input id="msg-expiry" type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="msg-url">Action URL (optional)</Label>
              <Input id="msg-url" type="url" value={form.actionUrl} onChange={(e) => setForm({ ...form, actionUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-3">
              <Switch id="msg-enabled" checked={form.enabled} onCheckedChange={(v) => setForm({ ...form, enabled: v })} />
              <Label htmlFor="msg-enabled" className="cursor-pointer">Enabled immediately</Label>
            </div>
            <Button type="submit">Create Announcement</Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Announcements</h3>
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="h-4 w-4 mr-1" aria-hidden="true" />
            Refresh
          </Button>
        </div>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-muted-foreground">No announcements yet.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <Card key={m.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{m.title}</p>
                        {statusBadge(m)}
                        <Badge variant="outline">{m.target}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{m.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(m.startsAt).toLocaleString()} → {new Date(m.expiresAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Switch
                        checked={m.enabled}
                        onCheckedChange={() => toggle(m.id, m.enabled)}
                        aria-label={`${m.enabled ? "Disable" : "Enable"} announcement ${m.title}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => remove(m.id)}
                        aria-label={`Delete announcement ${m.title}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Training Center Tab ──────────────────────────────────────────────────────

interface Dataset {
  id: number;
  name: string;
  description: string | null;
  status: string;
  rowCount: number;
  chunkCount: number;
  errorMessage: string | null;
  createdAt: string;
}

function TrainingCenterTab() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", contentColumn: "" });
  const [uploading, setUploading] = useState(false);

  const loadDatasets = async () => {
    try {
      const res = await fetch(`${BASE}/api/admin/datasets`, { headers: getHeaders(token) });
      if (res.ok) setDatasets(await res.json() as Dataset[]);
    } finally {
      setLoadingDatasets(false);
    }
  };

  // Use useEffect (not useState) for side effects on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadDatasets(); }, []);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      toast({ title: "Only CSV files are supported", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File size must be under 10 MB", variant: "destructive" });
      return;
    }
    if (!form.name.trim()) {
      toast({ title: "Please enter a dataset name first", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const csvContent = await file.text();
      const res = await fetch(`${BASE}/api/ai/train`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getHeaders(token) },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          csvContent,
          contentColumn: form.contentColumn || undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json() as { error?: string }).error ?? "Upload failed");
      toast({ title: "Dataset processing started", description: "Refresh the list in a moment to see the status." });
      setForm({ name: "", description: "", contentColumn: "" });
      e.target.value = "";
      setTimeout(loadDatasets, 3000);
    } catch (err) {
      toast({ title: String(err) || "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const toggleDataset = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const res = await fetch(`${BASE}/api/admin/datasets/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getHeaders(token) },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setDatasets((prev) => prev.map((d) => d.id === id ? { ...d, status: newStatus } : d));
      toast({ title: `Dataset ${newStatus === "active" ? "activated" : "deactivated"}` });
    }
  };

  const deleteDataset = async (id: number) => {
    const res = await fetch(`${BASE}/api/admin/datasets/${id}`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    if (res.ok) {
      setDatasets((prev) => prev.filter((d) => d.id !== id));
      toast({ title: "Dataset deleted" });
    }
  };

  const statusIcon = (status: string) => {
    if (status === "active") return <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />;
    if (status === "error") return <XCircle className="h-4 w-4 text-destructive" aria-hidden="true" />;
    if (status === "processing") return <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />;
    return <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Training Data</CardTitle>
          <CardDescription>
            Upload a CSV file to add knowledge to Nexus Mitra. The system will parse, chunk, embed, and index the content automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ds-name">Dataset Name <span aria-hidden="true">*</span></Label>
              <Input
                id="ds-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. App FAQ 2025"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ds-column">Content Column (optional)</Label>
              <Input
                id="ds-column"
                value={form.contentColumn}
                onChange={(e) => setForm({ ...form, contentColumn: e.target.value })}
                placeholder="Leave blank to auto-detect"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ds-desc">Description (optional)</Label>
            <Input
              id="ds-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of this dataset"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ds-file">CSV File <span aria-hidden="true">*</span></Label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="ds-file"
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-muted hover:bg-muted/80 cursor-pointer text-sm font-medium transition-colors"
              >
                <Upload className="h-4 w-4" aria-hidden="true" />
                {uploading ? "Processing..." : "Choose CSV File"}
                <input
                  id="ds-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="sr-only"
                  disabled={uploading}
                />
              </label>
              <p className="text-xs text-muted-foreground">Max 10 MB. UTF-8 CSV with header row.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Knowledge Sources</h3>
          <Button variant="outline" size="sm" onClick={loadDatasets}>
            <RefreshCw className="h-4 w-4 mr-1" aria-hidden="true" />
            Refresh
          </Button>
        </div>
        {loadingDatasets ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : datasets.length === 0 ? (
          <p className="text-muted-foreground">No datasets uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {datasets.map((d) => (
              <Card key={d.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {statusIcon(d.status)}
                        <p className="font-medium truncate">{d.name}</p>
                        <Badge variant={d.status === "active" ? "default" : d.status === "error" ? "destructive" : "secondary"} className="shrink-0">
                          {d.status}
                        </Badge>
                      </div>
                      {d.description && <p className="text-sm text-muted-foreground truncate">{d.description}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {d.rowCount} rows · {d.chunkCount} chunks · {new Date(d.createdAt).toLocaleDateString()}
                      </p>
                      {d.errorMessage && <p className="text-xs text-destructive mt-1 truncate">{d.errorMessage}</p>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {(d.status === "active" || d.status === "inactive") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleDataset(d.id, d.status)}
                        >
                          {d.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteDataset(d.id)}
                        aria-label={`Delete dataset ${d.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function Admin() {
  const { user, logout } = useAuth();

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground mt-1">Signed in as {user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>Sign Out</Button>
        </div>
        <Tabs defaultValue="contacts">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="training">Training Center</TabsTrigger>
          </TabsList>
          <TabsContent value="contacts"><ContactsTab /></TabsContent>
          <TabsContent value="support"><SupportTab /></TabsContent>
          <TabsContent value="messages"><GlobalMessagesTab /></TabsContent>
          <TabsContent value="blog"><BlogTab /></TabsContent>
          <TabsContent value="notifications"><NotificationsTab /></TabsContent>
          <TabsContent value="training"><TrainingCenterTab /></TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  );
}
