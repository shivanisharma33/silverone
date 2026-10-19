/**
 * Shapes of the migrated content layer.
 *
 * Kept separate from `content.ts` so that client components can import these
 * without dragging the JSON corpus into the browser bundle — a value import
 * from `content.ts` pulls in every news release, project and document.
 */

export type NewsDoc = { label: string; href: string };
export type NewsImage = { src: string; alt: string };

export type NewsItem = {
  slug: string;
  year: string;
  date: string;
  dateLabel: string;
  headline: string;
  subhead: string;
  html: string;
  docs: NewsDoc[];
  images: NewsImage[];
  excerpt: string;
  sourceUrl: string;
};

/** Trimmed projection used by the client-side archive browser. */
export type NewsSummary = {
  slug: string;
  year: string;
  date: string;
  /** Human-readable date, kept so search matches 'October 2026' as typed. */
  dateLabel: string;
  headline: string;
  excerpt: string;
  docCount: number;
};

export type DocLink = { label: string; href: string; size?: string };

export type DocRow = {
  date: string;
  dateIso: string | null;
  title: string;
  links: DocLink[];
  group?: string;
  cover?: string;
  project?: string;
  projectSlug?: string;
};

export type GalleryItem = { src: string; thumb: string; caption: string };

export type TabVideo = {
  provider: 'youtube' | 'vimeo' | 'other';
  id: string | null;
  src: string;
  watchUrl: string;
  title: string;
};

export type ProjectTab = {
  id: string;
  label: string;
  html: string;
  docs: DocRow[];
  gallery: GalleryItem[];
  videos: TabVideo[];
};

export type Project = {
  slug: string;
  name: string;
  location: string;
  state: string;
  tagline: string;
  href: string;
  pageTitle: string;
  banner: string | null;
  metaDesc: string;
  tabs: ProjectTab[];
  sourceUrl: string;
};

export type Person = {
  name: string;
  slug: string;
  role: string;
  html: string;
  excerpt: string;
};

export type Interview = {
  title: string;
  publisher: string;
  dateLabel: string;
  date: string | null;
  url: string;
  videoId: string | null;
};

export type SimplePage = {
  title: string;
  metaTitle: string;
  metaDesc: string;
  banner: string | null;
  html: string;
  images: NewsImage[];
};

/** Document-library categories, in display order. */
export const DOC_CATEGORIES = [
  { key: 'presentations', label: 'Corporate Presentations' },
  { key: 'factsheets', label: 'Factsheets' },
  { key: 'technical', label: 'Technical Reports' },
  { key: 'financials', label: 'Financial Statements' },
  { key: 'agm', label: 'AGM Materials' },
  { key: 'estma', label: 'ESTMA Reports' },
  { key: 'life', label: 'LIFE Disclosures' },
] as const;

export type DocCategoryKey = (typeof DOC_CATEGORIES)[number]['key'];

export type LibraryEntry = DocRow & { category: DocCategoryKey; categoryLabel: string };
