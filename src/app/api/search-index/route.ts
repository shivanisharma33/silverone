import { NextResponse } from 'next/server';
import { documentLibrary, news, projects, team } from '@/lib/content';

/**
 * Compact index for the header search. Served on demand — the overlay fetches
 * it the first time it is opened, so nothing is paid for on first paint.
 *
 * The previous site had no search; this indexes the migrated content only, so
 * every hit points at a page that exists.
 */
export async function GET() {
  const entries: { t: string; h: string; k: string; d?: string }[] = [];

  for (const n of news) {
    entries.push({ t: n.headline, h: `/news/${n.year}/${n.slug}/`, k: 'News', d: n.date });
  }
  for (const p of projects) {
    entries.push({ t: `${p.name} Project — ${p.location}`, h: p.href, k: 'Project' });
  }
  for (const p of team.management) {
    entries.push({ t: `${p.name} — ${p.role}`, h: `/corporate/management/${p.slug}/`, k: 'Management' });
  }
  for (const p of team.directors) {
    entries.push({ t: `${p.name} — ${p.role}`, h: `/corporate/directors/${p.slug}/`, k: 'Directors' });
  }
  for (const d of documentLibrary) {
    entries.push({
      t: d.title + (d.group ? ` (${d.group})` : ''),
      h: d.links[0]?.href ?? '/documents/',
      k: d.categoryLabel,
      d: d.dateIso ?? undefined,
    });
  }
  for (const [t, h] of [
    ['About Silver One', '/corporate/about-silver-one/'],
    ['Management', '/corporate/management/'],
    ['Board of Directors', '/corporate/directors/'],
    ['Financial Statements', '/corporate/financials-statements/'],
    ['Projects Overview', '/projects/overview/'],
    ['USA Projects', '/projects/usa-projects/'],
    ['Investor Information', '/investors/'],
    ['Why Silver?', '/investors/why-silver/'],
    ['Stock Information', '/investors/overview/'],
    ['Share Structure', '/investors/share-structure/'],
    ['Interviews', '/investors/interviews/'],
    ['Document Library', '/documents/'],
    ['News Releases', '/news/'],
    ['Contact', '/contact/'],
    ['Legal Notices', '/disclaimer/'],
  ]) {
    entries.push({ t, h, k: 'Page' });
  }

  return NextResponse.json(entries, {
    headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
  });
}
