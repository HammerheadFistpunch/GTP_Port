import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://angrysquirrel.org");
  const entries = (
    await getCollection(
      "entries",
      ({ data }) => !data.draft && Boolean(data.date),
    )
  ).sort(
    (a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0),
  );

  const items = entries
    .map((entry) => {
      const link = new URL(`/archive/${entry.id}/`, base).href;
      const pubDate = entry.data.date?.toUTCString() ?? new Date(0).toUTCString();

      return [
        "    <item>",
        `      <title>${escapeXml(entry.data.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${escapeXml(pubDate)}</pubDate>`,
        `      <description>${escapeXml(entry.data.description)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const channelUrl = new URL("/journal/", base).href;
  const selfUrl = new URL("/rss.xml", base).href;

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>TheAngrySquirrel Journal</title>\n    <link>${escapeXml(channelUrl)}</link>\n    <description>Journal entries from Patrick Rich at TheAngrySquirrel.</description>\n    <language>en-us</language>\n    <atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml" />\n${items}\n  </channel>\n</rss>\n`,
    {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
      },
    },
  );
};
