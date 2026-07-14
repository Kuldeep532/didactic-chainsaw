import { useState } from "react";
import { ExternalLink, BookOpen, Code2, Globe, Shield, Smartphone, Zap, Star, ChevronRight, Search, FileText, Video, Github } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Resource {
  title: string;
  description: string;
  url: string;
  tags: string[];
  type: "docs" | "tool" | "article" | "video" | "github";
  featured?: boolean;
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  resources: Resource[];
}

const CATEGORIES: Category[] = [
  {
    id: "accessibility",
    label: "Accessibility",
    icon: <Shield className="w-5 h-5" />,
    color: "text-green-600 bg-green-50 dark:bg-green-950/30",
    resources: [
      {
        title: "WCAG 2.2 Guidelines",
        description: "Web Content Accessibility Guidelines — the international standard for accessible web content.",
        url: "https://www.w3.org/TR/WCAG22/",
        tags: ["standard", "official"],
        type: "docs",
        featured: true,
      },
      {
        title: "WAI-ARIA Authoring Practices",
        description: "Patterns and best practices for accessible rich internet applications.",
        url: "https://www.w3.org/WAI/ARIA/apg/",
        tags: ["ARIA", "patterns"],
        type: "docs",
      },
      {
        title: "WebAIM Contrast Checker",
        description: "Check color contrast ratios for WCAG compliance.",
        url: "https://webaim.org/resources/contrastchecker/",
        tags: ["tool", "color"],
        type: "tool",
      },
      {
        title: "axe DevTools",
        description: "Automated accessibility testing tool for developers.",
        url: "https://www.deque.com/axe/devtools/",
        tags: ["testing", "automated"],
        type: "tool",
      },
      {
        title: "a11y.css",
        description: "CSS file that helps flag accessibility errors in your markup.",
        url: "https://ffoodd.github.io/a11y.css/",
        tags: ["CSS", "debug"],
        type: "tool",
      },
      {
        title: "Screen Reader Testing Guide",
        description: "How to test your website with NVDA, JAWS, VoiceOver and TalkBack.",
        url: "https://www.accessibility-developer-guide.com/knowledge/screen-readers/",
        tags: ["guide", "screen reader"],
        type: "article",
      },
    ],
  },
  {
    id: "android",
    label: "Android / Mobile",
    icon: <Smartphone className="w-5 h-5" />,
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
    resources: [
      {
        title: "Android Developer Docs",
        description: "Official Android documentation — guides, API references, and best practices.",
        url: "https://developer.android.com/docs",
        tags: ["official", "Android"],
        type: "docs",
        featured: true,
      },
      {
        title: "Material Design 3",
        description: "Google's design system for Android apps — components, theming, and motion.",
        url: "https://m3.material.io/",
        tags: ["design", "UI"],
        type: "docs",
      },
      {
        title: "Jetpack Compose",
        description: "Modern toolkit for building native Android UI declaratively.",
        url: "https://developer.android.com/jetpack/compose",
        tags: ["Compose", "UI"],
        type: "docs",
      },
      {
        title: "Android Kotlin Coroutines",
        description: "Concurrency design pattern for simplified async code in Android apps.",
        url: "https://developer.android.com/kotlin/coroutines",
        tags: ["Kotlin", "async"],
        type: "docs",
      },
      {
        title: "Firebase for Android",
        description: "Google's backend platform — Auth, Firestore, Cloud Messaging, and more.",
        url: "https://firebase.google.com/docs/android/setup",
        tags: ["Firebase", "backend"],
        type: "docs",
      },
      {
        title: "APK Analyzer",
        description: "Built-in Android Studio tool to inspect your APK contents and size.",
        url: "https://developer.android.com/studio/debug/apk-analyzer",
        tags: ["APK", "debug"],
        type: "tool",
      },
    ],
  },
  {
    id: "webdev",
    label: "Web Development",
    icon: <Code2 className="w-5 h-5" />,
    color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30",
    resources: [
      {
        title: "MDN Web Docs",
        description: "The definitive reference for HTML, CSS, JavaScript, and Web APIs.",
        url: "https://developer.mozilla.org/",
        tags: ["reference", "official"],
        type: "docs",
        featured: true,
      },
      {
        title: "TypeScript Handbook",
        description: "Official guide to TypeScript — types, interfaces, generics, and more.",
        url: "https://www.typescriptlang.org/docs/handbook/",
        tags: ["TypeScript", "guide"],
        type: "docs",
      },
      {
        title: "React Documentation",
        description: "Official React docs — hooks, components, and the React model.",
        url: "https://react.dev/",
        tags: ["React", "official"],
        type: "docs",
      },
      {
        title: "Tailwind CSS Docs",
        description: "Utility-first CSS framework reference and configuration guide.",
        url: "https://tailwindcss.com/docs",
        tags: ["CSS", "Tailwind"],
        type: "docs",
      },
      {
        title: "Vite Guide",
        description: "Next-generation frontend build tool — fast, HMR, and extensible.",
        url: "https://vite.dev/guide/",
        tags: ["Vite", "build"],
        type: "docs",
      },
      {
        title: "Can I Use",
        description: "Browser support tables for HTML5, CSS3, and JavaScript features.",
        url: "https://caniuse.com/",
        tags: ["browser", "compatibility"],
        type: "tool",
      },
    ],
  },
  {
    id: "performance",
    label: "Performance",
    icon: <Zap className="w-5 h-5" />,
    color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30",
    resources: [
      {
        title: "PageSpeed Insights",
        description: "Google's tool to measure real-world performance and Core Web Vitals.",
        url: "https://pagespeed.web.dev/",
        tags: ["Google", "CWV"],
        type: "tool",
        featured: true,
      },
      {
        title: "web.dev Performance",
        description: "Guides and best practices for fast, reliable, and engaging web apps.",
        url: "https://web.dev/explore/performance",
        tags: ["guide", "Google"],
        type: "article",
      },
      {
        title: "Lighthouse",
        description: "Open-source automated auditing tool for performance, accessibility, and SEO.",
        url: "https://developer.chrome.com/docs/lighthouse/overview/",
        tags: ["audit", "Chrome"],
        type: "tool",
      },
      {
        title: "Core Web Vitals",
        description: "Google's metrics — LCP, INP, and CLS — that measure user experience.",
        url: "https://web.dev/articles/vitals",
        tags: ["metrics", "SEO"],
        type: "article",
      },
      {
        title: "Bundle Phobia",
        description: "Find the cost of adding any npm package to your bundle.",
        url: "https://bundlephobia.com/",
        tags: ["npm", "bundle"],
        type: "tool",
      },
      {
        title: "WebPageTest",
        description: "Free website speed test from multiple locations worldwide.",
        url: "https://www.webpagetest.org/",
        tags: ["testing", "global"],
        type: "tool",
      },
    ],
  },
  {
    id: "opensource",
    label: "Open Source",
    icon: <Github className="w-5 h-5" />,
    color: "text-gray-600 bg-gray-50 dark:bg-gray-950/30",
    resources: [
      {
        title: "Choose a License",
        description: "Guidance on which open-source license is right for your project.",
        url: "https://choosealicense.com/",
        tags: ["license", "guide"],
        type: "article",
        featured: true,
      },
      {
        title: "Conventional Commits",
        description: "A specification for adding human and machine-readable meaning to commit messages.",
        url: "https://www.conventionalcommits.org/",
        tags: ["git", "standard"],
        type: "docs",
      },
      {
        title: "Semantic Versioning",
        description: "The SemVer specification — how to version your software meaningfully.",
        url: "https://semver.org/",
        tags: ["versioning", "standard"],
        type: "docs",
      },
      {
        title: "GitHub Skills",
        description: "Interactive courses to learn Git and GitHub from the official source.",
        url: "https://skills.github.com/",
        tags: ["GitHub", "learning"],
        type: "article",
      },
      {
        title: "Open Source Guides",
        description: "GitHub's comprehensive guides for starting and maintaining open-source projects.",
        url: "https://opensource.guide/",
        tags: ["guide", "community"],
        type: "article",
      },
      {
        title: "OSINT Framework",
        description: "Collection of OSINT tools and resources organized by category.",
        url: "https://osintframework.com/",
        tags: ["OSINT", "security"],
        type: "tool",
      },
    ],
  },
  {
    id: "learning",
    label: "Learning",
    icon: <BookOpen className="w-5 h-5" />,
    color: "text-red-600 bg-red-50 dark:bg-red-950/30",
    resources: [
      {
        title: "freeCodeCamp",
        description: "Free, self-paced curriculum covering web development, data science, and more.",
        url: "https://www.freecodecamp.org/",
        tags: ["free", "curriculum"],
        type: "article",
        featured: true,
      },
      {
        title: "The Odin Project",
        description: "Full-stack web development curriculum — from zero to job-ready.",
        url: "https://www.theodinproject.com/",
        tags: ["full-stack", "curriculum"],
        type: "article",
      },
      {
        title: "CS50 by Harvard",
        description: "Harvard's introduction to computer science — free on edX.",
        url: "https://cs50.harvard.edu/x/",
        tags: ["CS", "university"],
        type: "video",
      },
      {
        title: "Roadmap.sh",
        description: "Community-driven developer roadmaps for every role and technology.",
        url: "https://roadmap.sh/",
        tags: ["roadmap", "career"],
        type: "article",
      },
      {
        title: "Fireship",
        description: "High-quality, fast-paced developer tutorial videos on YouTube.",
        url: "https://www.youtube.com/@Fireship",
        tags: ["YouTube", "video"],
        type: "video",
      },
      {
        title: "Developer Handbook",
        description: "Open-source handbook of best practices, tools, and workflows for developers.",
        url: "https://github.com/apptension/developer-handbook",
        tags: ["handbook", "GitHub"],
        type: "github",
      },
    ],
  },
];

const TYPE_ICONS: Record<Resource["type"], React.ReactNode> = {
  docs: <FileText className="w-3.5 h-3.5" />,
  tool: <Zap className="w-3.5 h-3.5" />,
  article: <BookOpen className="w-3.5 h-3.5" />,
  video: <Video className="w-3.5 h-3.5" />,
  github: <Github className="w-3.5 h-3.5" />,
};

const TYPE_LABEL: Record<Resource["type"], string> = {
  docs: "Docs",
  tool: "Tool",
  article: "Article",
  video: "Video",
  github: "GitHub",
};

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const allResources = CATEGORIES.flatMap((c) =>
    c.resources.map((r) => ({ ...r, category: c.id }))
  );

  const filtered = allResources.filter((r) => {
    const matchCat = activeCategory === "all" || r.category === activeCategory;
    const q = query.toLowerCase();
    const matchQ =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchQ;
  });

  const featured = allResources.filter((r) => r.featured);

  const getCategoryMeta = (id: string) =>
    CATEGORIES.find((c) => c.id === id);

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Hero */}
      <section className="bg-muted/30 py-20 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl text-center">
          <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium mb-4 bg-background text-muted-foreground">
            <Star className="w-3.5 h-3.5 mr-2 text-primary" />
            Curated by Nexus Wave Technologies
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Resources & References
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A curated collection of tools, documentation, guides, and learning materials
            for developers, designers, and accessibility advocates.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search resources..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              aria-label="Search resources"
            />
          </div>
        </div>
      </section>

      {/* Featured */}
      {!query && activeCategory === "all" && (
        <section className="py-12 border-b border-border/50">
          <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" aria-hidden="true" />
              Featured Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((r) => {
                const cat = getCategoryMeta(
                  CATEGORIES.find((c) => c.resources.includes(
                    c.resources.find((cr) => cr.title === r.title)!
                  ))?.id ?? ""
                );
                return (
                  <a
                    key={r.title}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-3 p-5 border border-border rounded-xl bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`flex items-center gap-2 text-sm font-medium px-2 py-1 rounded-md ${cat?.color}`}>
                        {cat?.icon}
                        <span>{cat?.label}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{r.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                    </div>
                    <div className="flex gap-1.5 flex-wrap mt-auto">
                      {r.tags.slice(0, 2).map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="md:w-56 shrink-0">
              <nav aria-label="Resource categories">
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setActiveCategory("all")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeCategory === "all"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      All Resources
                      <span className="ml-auto text-xs opacity-70">{allResources.length}</span>
                    </button>
                  </li>
                  {CATEGORIES.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          activeCategory === cat.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat.icon}
                        {cat.label}
                        <span className="ml-auto text-xs opacity-70">{cat.resources.length}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {filtered.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">No resources found</p>
                  <p className="text-sm mt-1">Try a different search term or category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filtered.map((r) => {
                    const catMeta = getCategoryMeta(r.category);
                    return (
                      <a
                        key={r.title + r.url}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col gap-3 p-5 border border-border rounded-xl bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold group-hover:text-primary transition-colors leading-snug">
                              {r.featured && (
                                <Star className="inline w-3.5 h-3.5 text-yellow-500 mr-1 mb-0.5" />
                              )}
                              {r.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap mt-auto">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${catMeta?.color}`}>
                            {TYPE_ICONS[r.type]}
                            {TYPE_LABEL[r.type]}
                          </span>
                          {r.tags.slice(0, 2).map((t) => (
                            <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                          ))}
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl text-center">
          <h2 className="text-2xl font-bold mb-3">Missing something?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Have a resource you'd like to see added? Reach out and we'll consider adding it to the list.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Suggest a Resource
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
