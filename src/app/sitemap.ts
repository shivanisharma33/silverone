import type { MetadataRoute } from 'next';
import { documentLibrary, news, newsYears, projects, team } from '@/lib/content';
import { SITE } from '@/lib/site';

type Entry = MetadataRoute.Sitemap[number];
type Freq = Entry['changeFrequency'];

/** Every indexable route, mirroring the original silverone.com URL shapes. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const latest = news[0]?.date;
  const docsUpdated = documentLibrary.find((d) => d.dateIso)?.dateIso ?? latest;

  const staticRoutes: { path: string; priority: number; freq: Freq; modified?: string }[] = [
    { path: '/', priority: 1, freq: 'weekly', modified: latest },
    { path: '/corporate/about-silver-one/', priority: 0.8, freq: 'yearly' },
    { path: '/corporate/management/', priority: 0.6, freq: 'yearly' },
    { path: '/corporate/directors/', priority: 0.6, freq: 'yearly' },
    { path: '/corporate/financials-statements/', priority: 0.7, freq: 'monthly', modified: docsUpdated },
    { path: '/projects/overview/', priority: 0.9, freq: 'monthly' },
    { path: '/projects/usa-projects/', priority: 0.9, freq: 'monthly' },
    { path: '/investors/', priority: 0.9, freq: 'monthly' },
    { path: '/investors/why-silver/', priority: 0.6, freq: 'yearly' },
    { path: '/investors/overview/', priority: 0.7, freq: 'daily' },
    { path: '/investors/share-structure/', priority: 0.7, freq: 'monthly' },
    { path: '/investors/interviews/', priority: 0.6, freq: 'monthly' },
    { path: '/investors/presentations/', priority: 0.8, freq: 'monthly', modified: docsUpdated },
    { path: '/investors/factsheets/', priority: 0.6, freq: 'monthly' },
    { path: '/investors/agm-material/', priority: 0.5, freq: 'yearly' },
    { path: '/investors/estma_reports-2/', priority: 0.5, freq: 'yearly' },
    { path: '/investors/life/', priority: 0.5, freq: 'yearly' },
    { path: '/documents/', priority: 0.7, freq: 'monthly', modified: docsUpdated },
    { path: '/news/', priority: 0.9, freq: 'weekly', modified: latest },
    { path: '/contact/', priority: 0.7, freq: 'yearly' },
    { path: '/contact/subscribe-for-email-updates/', priority: 0.4, freq: 'yearly' },
    { path: '/disclaimer/', priority: 0.3, freq: 'yearly' },
  ];

  const entries: Entry[] = staticRoutes.map((r) => ({
    url: `${base}${r.path}`,
    changeFrequency: r.freq,
    priority: r.priority,
    ...(r.modified ? { lastModified: r.modified } : {}),
  }));

  for (const p of projects) {
    entries.push({
      url: `${base}${p.href}`,
      changeFrequency: 'monthly',
      priority: 0.85,
      ...(latest ? { lastModified: latest } : {}),
    });
  }

  for (const p of team.management) {
    entries.push({
      url: `${base}/corporate/management/${p.slug}/`,
      changeFrequency: 'yearly',
      priority: 0.4,
    });
  }

  for (const p of team.directors) {
    entries.push({
      url: `${base}/corporate/directors/${p.slug}/`,
      changeFrequency: 'yearly',
      priority: 0.4,
    });
  }

  for (const y of newsYears) {
    entries.push({ url: `${base}/news/${y}/`, changeFrequency: 'monthly', priority: 0.5 });
  }

  for (const n of news) {
    entries.push({
      url: `${base}/news/${n.year}/${n.slug}/`,
      lastModified: n.date,
      changeFrequency: 'yearly',
      priority: 0.6,
    });
  }

  return entries;
}
