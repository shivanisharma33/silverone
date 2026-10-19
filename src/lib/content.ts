/**
 * Typed accessors over the migrated content layer in src/content.
 *
 * This module imports the whole JSON corpus, so it must only be reached from
 * Server Components. Client components import shapes from `@/lib/types` and
 * helpers from `@/lib/format` instead, and receive their data as props.
 */
import newsData from '@/content/news.json';
import projectsData from '@/content/projects.json';
import teamData from '@/content/team.json';
import documentsData from '@/content/documents.json';
import interviewsData from '@/content/interviews.json';
import pagesData from '@/content/pages.json';
import homeData from '@/content/home.json';

import {
  DOC_CATEGORIES,
  type DocRow,
  type Interview,
  type LibraryEntry,
  type NewsItem,
  type NewsSummary,
  type Person,
  type Project,
  type SimplePage,
} from '@/lib/types';

export * from '@/lib/types';
export { formatDate, formatDateShort } from '@/lib/format';

export const news = newsData as NewsItem[];
export const projects = projectsData as Project[];
export const team = teamData as { management: Person[]; directors: Person[] };
export const documents = documentsData as Record<string, DocRow[]>;
export const interviews = interviewsData as Interview[];
export const pages = pagesData as Record<string, SimplePage>;
export const home = homeData as {
  metaDesc: string;
  metaKeywords: string;
  slides: string[];
  summaryHtml: string;
  features: { id: string; bg: string | null; heading: string }[];
  videoUrl: string;
  videoId: string | null;
  videoTitle: string;
  aboutHtml: string;
};

/* -------------------------------------------------------------- queries -- */

export const newsYears = [...new Set(news.map((n) => n.year))].sort((a, b) => b.localeCompare(a));

export function newsByYear(year: string): NewsItem[] {
  return news.filter((n) => n.year === year);
}

export function findNews(year: string, slug: string): NewsItem | undefined {
  return news.find((n) => n.year === year && n.slug === slug);
}

export function latestNews(count = 3): NewsItem[] {
  return news.slice(0, count);
}

export function findProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function findPerson(group: 'management' | 'directors', slug: string): Person | undefined {
  return team[group].find((p) => p.slug === slug);
}

/** News releases that mention a project by name — used for "related news". */
export function newsForProject(project: Project, limit = 6): NewsItem[] {
  const needles = [project.name.toLowerCase()];
  if (project.slug === 'silver_phoenix') needles.push('silver phoenix', 'phoenix silver');
  return news
    .filter((n) => {
      const hay = `${n.headline} ${n.excerpt}`.toLowerCase();
      return needles.some((x) => hay.includes(x));
    })
    .slice(0, limit);
}

/* ---------------------------------------------------- document library --- */

export const documentLibrary: LibraryEntry[] = DOC_CATEGORIES.flatMap(({ key, label }) =>
  (documents[key] || []).map((row) => ({ ...row, category: key, categoryLabel: label }))
).sort((a, b) => ((a.dateIso || '') < (b.dateIso || '') ? 1 : -1));

export const documentCount = documentLibrary.reduce((n, d) => n + d.links.length, 0);

/* ------------------------------------------------------ client payloads -- */

/**
 * Trim a release down to what a list view renders. Serialising full NewsItems
 * into an RSC payload would ship every article body to the browser.
 */
export function toSummary(n: NewsItem): NewsSummary {
  return {
    slug: n.slug,
    year: n.year,
    date: n.date,
    dateLabel: n.dateLabel,
    headline: n.headline,
    excerpt: n.excerpt,
    docCount: n.docs.length,
  };
}

export const newsSummaries: NewsSummary[] = news.map(toSummary);

export function newsSummariesByYear(year: string): NewsSummary[] {
  return newsSummaries.filter((n) => n.year === year);
}
