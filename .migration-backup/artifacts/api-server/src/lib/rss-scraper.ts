/**
 * Simple RSS feed parser using native fetch (Node 24).
 * Parses basic RSS/Atom XML to extract articles.
 */

export interface RssArticle {
  title: string;
  link: string;
  description: string;
  pubDate?: string;
}

function parseRssXml(xml: string): RssArticle[] {
  const items: RssArticle[] = [];
  // Match RSS <item> blocks
  const itemRegex = /<item[^>]*>[\s\S]*?<\/item>/gi;
  const itemsMatch = xml.match(itemRegex);

  if (itemsMatch) {
    for (const itemXml of itemsMatch) {
      const title = extractTag(itemXml, "title");
      const link = extractTag(itemXml, "link");
      const description = extractTag(itemXml, "description") || extractTag(itemXml, "content:encoded");
      const pubDate = extractTag(itemXml, "pubDate");
      if (title && link) {
        items.push({ title, link, description: cleanHtml(description || ""), pubDate });
      }
    }
    return items;
  }

  // Fallback: match Atom <entry> blocks
  const entryRegex = /<entry[^>]*>[\s\S]*?<\/entry>/gi;
  const entriesMatch = xml.match(entryRegex);
  if (entriesMatch) {
    for (const entryXml of entriesMatch) {
      const title = extractTag(entryXml, "title");
      const linkMatch = entryXml.match(/<link[^>]+href="([^"]+)"/);
      const link = linkMatch ? linkMatch[1] : extractTag(entryXml, "link");
      const description = extractTag(entryXml, "summary") || extractTag(entryXml, "content");
      const pubDate = extractTag(entryXml, "updated") || extractTag(entryXml, "published");
      if (title && link) {
        items.push({ title, link, description: cleanHtml(description || ""), pubDate });
      }
    }
  }

  return items;
}

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "i");
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

function cleanHtml(input: string): string {
  return input
    .replace(/<[^>]+>/g, " ") // Strip HTML tags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

const DEFAULT_FEEDS = [
  "https://news.ycombinator.com/rss",
  "https://feeds.feedburner.com/TechCrunch",
];

export async function scrapeRssArticles(feedUrls: string[] = DEFAULT_FEEDS): Promise<RssArticle[]> {
  const allArticles: RssArticle[] = [];
  for (const url of feedUrls) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/rss+xml, application/xml, text/xml" } });
      if (!res.ok) continue;
      const xml = await res.text();
      const articles = parseRssXml(xml);
      allArticles.push(...articles);
    } catch {
      // Ignore feed errors, move on
    }
  }
  return allArticles;
}

export { slugify, cleanHtml };
