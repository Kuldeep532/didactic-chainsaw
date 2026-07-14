import { useState, useMemo, useRef, type FormEvent } from "react";
import { Link } from "wouter";
import { useListBlogPosts, type BlogPost } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Share2,
  Mail,
  ArrowRight,
  Sparkles,
  Newspaper,
  Clock,
  Loader2,
  Hash,
} from "lucide-react";

/* ─── constants ─── */
const POSTS_PER_PAGE = 6;
const CATEGORIES = ["All", "News", "Updates", "Technology", "Security", "Tutorials"];

/* ─── utils ─── */
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function highlightKeyword(text: string, keyword: string) {
  if (!keyword.trim()) return text;
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(regex, '<mark class="bg-primary/15 text-primary font-medium rounded px-0.5">$1</mark>');
}

/* ─── skeleton card ─── */
function SkeletonCard() {
  return (
    <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm animate-pulse">
      <div className="h-40 bg-muted/80" />
      <CardContent className="p-5 space-y-3">
        <div className="h-5 w-20 rounded bg-muted" />
        <div className="h-6 w-3/4 rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
        </div>
        <div className="h-4 w-32 rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

/* ─── hero section ─── */
function BlogHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-border/40 p-8 md:p-12 mb-10">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Insights & Updates
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
            The Nexus Wave Blog
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Technology, updates, and insights from the Nexus Wave Technologies team.
            Stay informed about our apps, features, and the tech behind them.
          </p>
        </div>
        <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-2xl bg-primary/10 text-primary shrink-0">
          <Newspaper className="h-12 w-12" />
        </div>
      </div>
    </div>
  );
}

/* ─── share popover ─── */
function SharePopover({ post }: { post: { title: string; slug: string } }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${baseUrl}/blog/${post.slug}`;

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    toast({ title: "Link copied!" });
    setOpen(false);
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(post.title);
    const u = encodeURIComponent(url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${u}`, "_blank", "width=550,height=420");
    setOpen(false);
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "width=550,height=420");
    setOpen(false);
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "width=550,height=420");
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </button>
      {open && (
        <div className="absolute right-0 mt-2 z-20 w-44 rounded-lg border border-border bg-card shadow-lg p-1 space-y-0.5">
          <button onClick={copy} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left">
            <Copy className="h-4 w-4" /> Copy Link
          </button>
          <button onClick={shareTwitter} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Twitter
          </button>
          <button onClick={shareFacebook} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </button>
          <button onClick={shareLinkedIn} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── featured post card ─── */
function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Card className="group overflow-hidden border-border/50 bg-gradient-to-br from-card to-muted/20 backdrop-blur-sm transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20">
      <CardContent className="p-0">
        <div className="h-56 bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Newspaper className="h-20 w-20 text-primary/20 group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-primary-foreground shadow-lg">Featured</Badge>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
            {post.category && (
              <span className="inline-flex items-center gap-1 text-primary">
                <Hash className="h-3 w-3" />
                {post.category}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(post.createdAt)}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h2>
          <p className="text-muted-foreground line-clamp-3 mb-4 max-w-2xl">
            {post.excerpt || post.content.slice(0, 200)}
          </p>
          <div className="flex items-center justify-between">
            <Button asChild size="sm">
              <Link href={`/blog/${post.slug}`}>
                Read Article <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <SharePopover post={post} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── post card ─── */
function PostCard({ post }: { post: BlogPost }) {
  return (
    <Card className="group overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20">
      <CardContent className="p-0">
        <div className="h-44 bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Newspaper className="h-12 w-12 text-muted-foreground/20 group-hover:scale-125 group-hover:text-primary/20 transition-all duration-700" />
          </div>
          {post.category && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="text-xs">{post.category}</Badge>
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Clock className="h-3 w-3" />
            {formatDate(post.createdAt)}
          </div>
          <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {post.excerpt || post.content.slice(0, 140)}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Read more <ArrowRight className="h-4 w-4" />
            </span>
            <SharePopover post={post} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── newsletter ─── */
function Newsletter() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast({ title: "Thanks for subscribing!" });
      setEmail("");
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="mt-16 rounded-2xl border border-border/40 bg-gradient-to-br from-muted/50 to-background p-8 md:p-12 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
        <Mail className="h-7 w-7" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">Stay in the loop</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        Get the latest updates, tech insights, and feature announcements delivered straight to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" disabled={loading} className="shrink-0">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground mt-3">No spam. Unsubscribe anytime.</p>
    </div>
  );
}

/* ─── main page ─── */
export default function Blog() {
  const { data: posts, isLoading, error } = useListBlogPosts();
  const searchRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  /* Reset page when filters change */
  const filtered = useMemo(() => {
    if (!posts) return [];
    let list = posts;
    if (activeCategory !== "All") {
      list = list.filter((p) => (p.category || "News") === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt || "").toLowerCase().includes(q) ||
          (p.content || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [posts, activeCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  /* Featured = most recent or pinned (if we add that later, just pick first) */
  const featured = filtered[0];
  const regularPosts = paginated.slice(featured ? 1 : 0);

  /* Search suggestions (titles) */
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || !posts) return [];
    const q = searchQuery.toLowerCase();
    return posts
      .filter((p) => p.title.toLowerCase().includes(q))
      .slice(0, 5)
      .map((p) => p.title);
  }, [searchQuery, posts]);

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const selectCategory = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 max-w-screen-xl py-10">
      <BlogHero />

      {/* ── Search + Filters ── */}
      <div className="mb-10 space-y-4" ref={searchRef}>
        {/* Search bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles by title, content, or keywords..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-10 pr-10 h-12 text-base bg-card/60 backdrop-blur-sm border-border/50 focus:border-primary/40"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 rounded-lg border border-border bg-card shadow-lg overflow-hidden">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setSearchQuery(s); setCurrentPage(1); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <Search className="h-3.5 w-3.5 text-muted-foreground" />
                  <span dangerouslySetInnerHTML={{ __html: highlightKeyword(s, searchQuery) }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Active filter chips */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {(searchQuery || activeCategory !== "All") && (
            <span className="text-muted-foreground">Active filters:</span>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-destructive/10" onClick={clearSearch}>
              Search: {searchQuery} <X className="h-3 w-3" />
            </Badge>
          )}
          {activeCategory !== "All" && (
            <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-destructive/10" onClick={() => selectCategory("All")}>
              Category: {activeCategory} <X className="h-3 w-3" />
            </Badge>
          )}
          <span className="ml-auto text-muted-foreground">
            {filtered.length} article{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── Loading State ── */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* ── Error State ── */}
      {error && !isLoading && (
        <div className="text-center py-20">
          <p className="text-destructive font-medium mb-2">Failed to load blog posts.</p>
          <p className="text-muted-foreground text-sm">Please try again later.</p>
        </div>
      )}

      {/* ── Empty State ── */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="text-center py-20 rounded-2xl border border-dashed border-border/60 bg-muted/20">
          <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">No articles found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            Try adjusting your search terms or filters. New articles are added regularly.
          </p>
          <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveCategory("All"); setCurrentPage(1); }}>
            Clear all filters
          </Button>
        </div>
      )}

      {/* ── Content ── */}
      {!isLoading && !error && filtered.length > 0 && (
        <>
          {/* Featured post (first one) */}
          {featured && currentPage === 1 && !searchQuery && activeCategory === "All" && (
            <div className="mb-8">
              <FeaturedPost post={featured} />
            </div>
          )}

          {/* Post grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-md text-sm font-medium transition-all ${
                    page === currentPage
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {page}
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <Newsletter />
    </div>
  );
}
