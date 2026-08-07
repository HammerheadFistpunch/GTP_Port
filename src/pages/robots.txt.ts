import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://angrysquirrel.org");
  const sitemap = new URL("/sitemap.xml", base).href;

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
