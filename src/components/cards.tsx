import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Download, FileText, MapPin } from 'lucide-react';
import type { DocRow, NewsItem, NewsSummary, Project } from '@/lib/types';
import { formatDate, formatDateShort } from '@/lib/format';

/* --------------------------------------------------------------- project */

/**
 * Photographic project card. `tall` is used on pages that give the card a
 * full column; the default near-square crop matches the homepage band, where
 * three sit side by side next to the About copy.
 */
export function ProjectCard({
  project,
  priority = false,
  tall = false,
}: {
  project: Project;
  priority?: boolean;
  tall?: boolean;
}) {
  return (
    <Link
      href={project.href}
      className="group relative isolate block overflow-hidden rounded-[3px] bg-[var(--color-navy)] focus-visible:outline-offset-4"
    >
      <div className={`relative ${tall ? 'aspect-[3/4]' : 'aspect-[4/3] sm:aspect-[7/6]'}`}>
        {project.banner && (
          <Image
            src={project.banner}
            alt={`${project.name} project, ${project.location}`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        )}
        <div className="absolute inset-0 scrim-soft" aria-hidden />

        {/* Subtle gradient overlay that darkens on hover */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-deep)]/70 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-90"
          aria-hidden
        />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
          <span className="min-w-0">
            <span className="flex items-center gap-1.5 text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-[var(--color-gold-soft)]">
              <MapPin size={10} aria-hidden />
              {project.location}
            </span>
            <span className="mt-1.5 block font-serif text-[1.2rem] leading-tight text-white">
              {project.name}
            </span>
            <span className="mt-1.5 line-clamp-3 text-[0.6875rem] leading-[1.45] text-white/75">
              {project.tagline}
            </span>
          </span>

          <span
            aria-hidden
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/35 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[var(--color-navy)] group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
          >
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ news */

export function NewsCard({ item, compact = false }: { item: NewsItem; compact?: boolean }) {
  const href = `/news/${item.year}/${item.slug}/`;

  if (compact) {
    return (
      <Link href={href} className="group flex items-start gap-5 py-5 transition-colors">
        <div className="min-w-0 flex-1">
          <time dateTime={item.date} className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-text)]">
            {formatDateShort(item.date)}
          </time>
          <h3 className="mt-1.5 font-serif text-lg leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-teal-900)]">
            {item.headline}
          </h3>
        </div>
        <span className="mt-6 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--color-stone)] text-[var(--color-teal-900)] transition-all duration-300 group-hover:border-[var(--color-teal-900)] group-hover:bg-[var(--color-teal-900)] group-hover:text-white">
          <ArrowRight size={13} aria-hidden />
        </span>
      </Link>
    );
  }

  return (
    <article className="card card-hover group flex h-full flex-col">
      <Link href={href} className="flex h-full flex-col p-6 lg:p-7">
        <time
          dateTime={item.date}
          className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-text)]"
        >
          {formatDate(item.date)}
        </time>
        <h3 className="mt-3 font-serif text-[1.3rem] leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-teal-900)]">
          {item.headline}
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--color-slate)]">
          {item.excerpt}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-[var(--color-teal-900)]">
          Read release
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </span>
      </Link>
    </article>
  );
}

/** Dense archive row used on the news index. */
export function NewsRow({ item }: { item: NewsSummary }) {
  const d = new Date(`${item.date}T12:00:00Z`);
  const month = d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase();
  const day = d.toLocaleDateString('en-US', { day: '2-digit', timeZone: 'UTC' });
  const year = d.toLocaleDateString('en-US', { year: 'numeric', timeZone: 'UTC' });

  return (
    <article className="group border-b border-[var(--color-stone)]">
      <Link
        href={`/news/${item.year}/${item.slug}/`}
        className="grid gap-3 py-6 transition-colors md:grid-cols-[4.5rem_1fr_auto] md:items-start md:gap-7"
      >
        {/* Stacked date block, as on the reference archive */}
        <time
          dateTime={item.date}
          className="flex shrink-0 items-baseline gap-2 border-[var(--color-stone)] pt-0.5 md:block md:border-r md:pr-4 md:text-center"
        >
          <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-text)]">
            {month}
          </span>
          <span className="block font-serif text-[1.6rem] leading-none text-[var(--color-ink)] md:mt-1">
            {day}
          </span>
          <span className="block text-[0.6875rem] text-[var(--color-slate)] md:mt-1">{year}</span>
        </time>

        <div className="min-w-0">
          <h3 className="font-serif text-[1.2rem] leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-teal-900)] lg:text-[1.35rem]">
            {item.headline}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-slate)]">
            {item.excerpt}
          </p>
          {item.docCount > 0 && (
            <p className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-[var(--color-slate)]">
              <FileText size={12} aria-hidden />
              {item.docCount} attached document{item.docCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <span className="mt-1 hidden h-9 w-9 place-items-center rounded-full border border-[var(--color-stone)] text-[var(--color-teal-900)] transition-all duration-300 group-hover:border-[var(--color-teal-900)] group-hover:bg-[var(--color-teal-900)] group-hover:text-white md:grid">
          <ArrowRight size={14} aria-hidden />
        </span>
      </Link>
    </article>
  );
}

/* -------------------------------------------------------------- document */

export function DocumentCard({ row, categoryLabel }: { row: DocRow; categoryLabel?: string }) {
  return (
    <article className="card card-hover flex h-full flex-col p-5 lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {categoryLabel && (
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-text)]">
              {categoryLabel}
            </p>
          )}
          <h3 className="mt-1.5 font-serif text-[1.15rem] leading-snug text-[var(--color-ink)]">
            {row.title}
          </h3>
          {row.date && (
            <p className="mt-1.5 text-xs text-[var(--color-slate)]">
              {row.dateIso ? formatDate(row.dateIso) : row.date}
            </p>
          )}
        </div>
        <FileText size={18} strokeWidth={1.4} className="mt-0.5 shrink-0 text-[var(--color-slate)]/60" aria-hidden />
      </div>

      <ul className="mt-5 flex flex-1 flex-wrap items-end gap-2">
        {row.links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/dl inline-flex items-center gap-2 border border-[var(--color-stone)] px-3 py-2 text-xs font-semibold text-[var(--color-teal-900)] transition-colors hover:border-[var(--color-teal-900)] hover:bg-[var(--color-teal-50)]"
            >
              <Download size={13} aria-hidden />
              <span>{l.label}</span>
              {l.size && <span className="font-normal text-[var(--color-slate)]">({l.size})</span>}
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}

/** Compact table-style row for long document lists. */
export function DocumentRow({ row }: { row: DocRow }) {
  return (
    <div className="grid gap-3 border-b border-[var(--color-stone)] py-4 md:grid-cols-[8.5rem_1fr_auto] md:items-center md:gap-6">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-gold-text)]">
        {row.dateIso ? formatDateShort(row.dateIso) : row.date}
      </p>
      <p className="text-[0.9375rem] font-medium text-[var(--color-ink)]">{row.title}</p>
      <ul className="flex flex-wrap gap-2">
        {row.links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-[var(--color-stone)] px-2.5 py-1.5 text-xs font-semibold text-[var(--color-teal-900)] transition-colors hover:border-[var(--color-teal-900)] hover:bg-[var(--color-teal-50)]"
              aria-label={`${l.label} — ${row.title} (PDF${l.size ? `, ${l.size}` : ''}, opens in a new tab)`}
            >
              <Download size={12} aria-hidden />
              {l.label}
              {l.size && <span className="font-normal text-[var(--color-slate)]">{l.size}</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------- investor resource */

export function InvestorResourceCard({
  label,
  href,
  icon: Icon,
  external = false,
}: {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  external?: boolean;
}) {
  const content = (
    <>
      <Icon size={16} strokeWidth={1.4} className="text-[var(--color-teal-900)]" />
      <span className="mt-auto flex items-end justify-between gap-1.5 pt-3">
        <span className="text-[0.6875rem] font-semibold leading-tight text-[var(--color-ink)]">
          {label}
        </span>
        {external ? (
          <ArrowUpRight
            size={12}
            className="shrink-0 text-[var(--color-slate)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        ) : (
          <ArrowRight
            size={12}
            className="shrink-0 text-[var(--color-slate)] transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          />
        )}
      </span>
    </>
  );

  const cls =
    'card card-hover group flex min-h-[5.1rem] flex-col p-3 hover:border-[var(--color-teal-900)]/30';

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {content}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

/* ---------------------------------------------------- homepage news card */

/**
 * Compact release card for the homepage band: headline and excerpt on the
 * left, circular arrow on the right, sized so three sit in one row beside the
 * section heading.
 */
export function HomeNewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="card card-hover group h-full">
      <Link
        href={`/news/${item.year}/${item.slug}/`}
        className="flex h-full items-start gap-3 p-5"
      >
        <span className="min-w-0 flex-1">
          <time
            dateTime={item.date}
            className="block text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-[var(--color-gold-text)]"
          >
            {formatDateShort(item.date)}
          </time>
          <span className="mt-2 line-clamp-3 font-serif text-[1rem] leading-[1.28] text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-teal-900)]">
            {item.headline}
          </span>
          <span className="mt-2 line-clamp-2 text-[0.75rem] leading-[1.5] text-[var(--color-slate)]">
            {item.excerpt}
          </span>
        </span>

        <span
          aria-hidden
          className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--color-stone)] text-[var(--color-teal-900)] transition-all duration-300 group-hover:border-[var(--color-teal-900)] group-hover:bg-[var(--color-teal-900)] group-hover:text-white"
        >
          <ArrowRight size={12} />
        </span>
      </Link>
    </article>
  );
}
