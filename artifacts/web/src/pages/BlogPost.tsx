import { useState, useEffect, useMemo } from "react";
import { useParams } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useGetBlogPostBySlug, useListBlogPosts } from "@workspace/api-client-react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Hexagon,
  ArrowRight,
  Share2,
  Copy,
  ChevronUp,
  Hash,
} from "lucide-react";

/* ─── Reading Progress Bar ─── */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min(100, (scrollTop / docHeight) * 100));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div
        className="h-full bg-primary transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* ─── Social Share Bar ─── */
function SocialShare({ title, slug }: { title: string; slug: string }) {
  const { toast } = useToast();
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${baseUrl}/blog/${slug}`;

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    toast({ title: "Link copied!" });
  };

  const share = (provider: string) => {
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(title);
    const links: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      reddit: `https://www.reddit.com/submit?url=${u}&title=${t}`,
    };
    if (links[provider]) {
      window.open(links[provider], "_blank", "width=550,height=420");
    }
  };

  const items = [
    { key: "copy", label: "Copy", icon: Copy, action: copy },
    { key: "twitter", label: "X / Twitter", icon: null, svg: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, action: () => share("twitter") },
    { key: "facebook", label: "Facebook", icon: null, svg: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, action: () => share("facebook") },
    { key: "linkedin", label: "LinkedIn", icon: null, svg: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, action: () => share("linkedin") },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-1 flex items-center gap-1">
        <Share2 className="h-3.5 w-3.5" /> Share
      </span>
      {items.map((item) => (
        <button
          key={item.key}
          onClick={item.action}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors text-muted-foreground"
          title={item.label}
        >
          {item.icon ? <item.icon className="h-4 w-4" /> : item.svg}
        </button>
      ))}
    </div>
  );
}

/* ─── Related Posts ─── */
function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const { data: posts } = useListBlogPosts();
  const related = useMemo(() => {
    if (!posts) return [];
    return posts.filter((p) => p.slug !== currentSlug).slice(0, 3);
  }, [posts, currentSlug]);

  if (!related.length) return null;

  return (
    <div className="mt-16">
      <h3 className="text-xl font-bold tracking-tight mb-6">Related Documents</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {related.map((post) => (
          <Card key={post.id} className="group border-border bg-background rounded-none hover:border-foreground transition-colors duration-300">
            <CardContent className="p-6">
              {post.category && <span className="inline-block px-2 py-1 bg-muted border border-border font-mono text-[10px] uppercase tracking-wider mb-3">{post.category}</span>}
              <h4 className="font-semibold text-base mb-3 group-hover:text-primary transition-colors line-clamp-2">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h4>
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ─── Scroll to Top ─── */
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-40 w-10 h-10 bg-foreground text-background shadow-none border border-foreground hover:bg-background hover:text-foreground transition-all flex items-center justify-center rounded-none"
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}

/* ─── Main Component ─── */
export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useGetBlogPostBySlug(slug ?? "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Hexagon className="h-8 w-8 text-foreground animate-spin" aria-hidden="true" strokeWidth={1} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 md:px-8 max-w-screen-md py-24 text-center border border-border my-12 bg-card">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Document Not Found</h1>
        <p className="text-muted-foreground mb-8">The requested technical document does not exist.</p>
        <Button asChild variant="outline" className="rounded-none">
          <Link href="/blog">Return to Log</Link>
        </Button>
      </div>
    );
  }

  /* Estimate reading time: ~200 words per minute */
  const wordCount = post.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <>
      <ReadingProgress />
      <ScrollToTop />

      <div className="flex flex-col w-full pb-20">
        {/* Hero */}
        <section className="bg-background py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 md:px-8 max-w-screen-md">
            <Button asChild variant="outline" size="sm" className="mb-8 group rounded-none font-mono uppercase tracking-wider text-xs">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-3 w-3 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                Index
              </Link>
            </Button>

            {post.category && (
              <span className="inline-block px-2 py-1 mb-4 border border-border bg-muted font-mono uppercase tracking-wider text-[10px]">
                {post.category}
              </span>
            )}

            <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {readTime} min read
              </span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 md:px-8 max-w-screen-md">
            <article className="prose prose-neutral dark:prose-invert max-w-none">
              {post.content.split("\n").map((line, i) => {
                if (line.startsWith("# ")) return <h1 key={i} className="text-3xl font-bold mt-10 mb-4 tracking-tight">{line.slice(2)}</h1>;
                if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 tracking-tight">{line.slice(3)}</h2>;
                if (line.startsWith("### ")) return <h3 key={i} className="text-xl font-bold mt-6 mb-3 tracking-tight">{line.slice(4)}</h3>;
                if (line.startsWith("- ")) return <li key={i} className="ml-6 mb-2 list-disc pl-2">{line.slice(2)}</li>;
                if (line.trim() === "") return <br key={i} />;
                if (line.startsWith("*") && line.endsWith("*") && line.includes("Source:")) {
                  return (
                    <p key={i} className="text-sm font-mono text-muted-foreground mt-8 pt-4 border-t border-border">
                      {line.replace(/\*/g, "")}
                    </p>
                  );
                }
                return <p key={i} className="mb-5 leading-relaxed text-foreground/90 text-lg">{line}</p>;
              })}
            </article>

            {/* Share */}
            <div className="mt-16 pt-8 border-t border-border">
              <SocialShare title={post.title} slug={post.slug} />
            </div>

            {/* Related */}
            <RelatedPosts currentSlug={post.slug} />

            {/* Back to blog CTA */}
            <div className="mt-20 border-t border-border pt-12">
              <Button asChild variant="outline" className="w-full h-12 rounded-none font-medium text-base">
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Archive
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
