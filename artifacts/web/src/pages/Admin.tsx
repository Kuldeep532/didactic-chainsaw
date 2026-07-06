import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAdminListContactMessages,
  useAdminListSupportRequests,
  useCreateNotification,
  useCreateBlogPost,
  useListBlogPosts,
} from "@workspace/api-client-react";

const ADMIN_STORAGE_KEY = "nexus_admin_pass";

function getAdminHeaders(): Record<string, string> | undefined {
  const pass = sessionStorage.getItem(ADMIN_STORAGE_KEY);
  if (!pass) return undefined;
  return { Authorization: `Bearer admin:${pass}` };
}

function LoginGate({ onLogin }: { onLogin: (pass: string) => void }) {
  const [pass, setPass] = useState("");
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onLogin(pass);
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="admin-pass">Password</Label>
              <Input
                id="admin-pass"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ContactsTab() {
  const { data, isLoading } = useAdminListContactMessages({
    request: { headers: getAdminHeaders() },
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

function SupportTab() {
  const { data, isLoading } = useAdminListSupportRequests({
    request: { headers: getAdminHeaders() },
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
              <TableCell>
                <Badge variant="outline">{req.appId}</Badge>
              </TableCell>
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

function BlogTab() {
  const { data: posts, isLoading } = useListBlogPosts();
  const createPost = useCreateBlogPost();
  const { toast } = useToast();
  const [form, setForm] = useState({ title: "", slug: "", content: "", excerpt: "" });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createPost.mutate(
      { data: form },
      {
        onSuccess: () => {
          toast({ title: "Blog post created" });
          setForm({ title: "", slug: "", content: "", excerpt: "" });
        },
        onError: () => {
          toast({ title: "Failed to create post", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">New Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bp-title">Title</Label>
                <Input id="bp-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="bp-slug">Slug</Label>
                <Input id="bp-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              </div>
            </div>
            <div>
              <Label htmlFor="bp-excerpt">Excerpt</Label>
              <Input id="bp-excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{p.title}</p>
                      <p className="text-sm text-muted-foreground">/{p.slug} • {new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={p.published ? "default" : "secondary"}>{p.published ? "Published" : "Draft"}</Badge>
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
          toast({ title: "Notification sent!" });
          setTitle("");
          setMessage("");
          setActionUrl("");
        },
        onError: () => {
          toast({ title: "Failed to send notification", variant: "destructive" });
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Send App Notification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Target App</Label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nexus_plus">Nexus Plus</SelectItem>
                <SelectItem value="geeta_nexus">Geeta Nexus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="n-title">Title</Label>
            <Input id="n-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="n-message">Message</Label>
            <Textarea id="n-message" value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="n-url">Action URL (optional)</Label>
            <Input id="n-url" value={actionUrl} onChange={(e) => setActionUrl(e.target.value)} placeholder="https://..." />
          </div>
          <Button type="submit" disabled={createNotif.isPending}>
            {createNotif.isPending ? "Broadcasting..." : "Broadcast Notification"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function Admin() {
  const [adminPass, setAdminPass] = useState<string | null>(() =>
    sessionStorage.getItem(ADMIN_STORAGE_KEY)
  );

  if (!adminPass) {
    return <LoginGate onLogin={(p) => { sessionStorage.setItem(ADMIN_STORAGE_KEY, p); setAdminPass(p); }} />;
  }

  return (
    <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Button variant="outline" size="sm" onClick={() => { sessionStorage.removeItem(ADMIN_STORAGE_KEY); setAdminPass(null); }}>
          Logout
        </Button>
      </div>
      <Tabs defaultValue="contacts">
        <TabsList className="mb-6">
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="contacts"><ContactsTab /></TabsContent>
        <TabsContent value="support"><SupportTab /></TabsContent>
        <TabsContent value="blog"><BlogTab /></TabsContent>
        <TabsContent value="notifications"><NotificationsTab /></TabsContent>
      </Tabs>
    </div>
  );
}
