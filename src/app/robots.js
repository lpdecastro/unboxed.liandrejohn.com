const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots() {
  return {
    // Intentionally allows every crawler, including AI/answer-engine bots
    // (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) — visibility
    // to AI assistants is a goal here, not something to restrict.
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
