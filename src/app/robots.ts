import type { MetadataRoute } from "next";
import { absUrl } from "@/seo/site";

// Training/data-harvesting crawlers — keep blocked
const TRAINING_CRAWLERS = [
  "CCBot",
  "anthropic-ai",
  "Bytespider",
  "ChatGPT-User",
  "Claude-Web",
  "Meta-ExternalFetcher",
  "Diffbot",
  "ImagesiftBot",
  "omgili",
  "omgilibot",
  "YouBot",
] as const;

// Search-index crawlers — allowed (feed live AI search results)
// GPTBot, OAI-SearchBot → ChatGPT Search
// ClaudeBot → Claude.ai search
// PerplexityBot, Perplexity-User → Perplexity
// Google-Extended → Google AI Overviews
// Applebot-Extended → Apple Intelligence
// Meta-ExternalAgent → Meta AI

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      ...TRAINING_CRAWLERS.map((userAgent) => ({
        userAgent,
        disallow: "/",
      })),
    ],
    sitemap: absUrl("/sitemap.xml"),
  };
}
