import { news } from '@/lib/content';
import { SITE } from '@/lib/site';

/** Replaces the legacy /rss feed the original site advertised. */

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export function GET() {
  const items = news.slice(0, 50);
  const latest = items[0] ? new Date(`${items[0].date}T12:00:00Z`).toUTCString() : undefined;

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)} — News Releases</title>
    <link>${SITE.url}/news/</link>
    <description>${esc(SITE.description)}</description>
    <language>en-ca</language>
    ${latest ? `<lastBuildDate>${latest}</lastBuildDate>` : ''}
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />
${items
  .map((n) => {
    const url = `${SITE.url}/news/${n.year}/${n.slug}/`;
    return `    <item>
      <title>${esc(n.headline)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${n.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(n.excerpt)}</description>
    </item>`;
  })
  .join('\n')}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
