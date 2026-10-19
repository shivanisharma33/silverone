import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { RevealOnScroll } from '@/components/Reveal';

/* ------------------------------------------------------------ breadcrumbs */

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, light = false }: { items: Crumb[]; light?: boolean }) {
  const all: Crumb[] = [{ label: 'Home', href: '/' }, ...items];
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className={`transition-colors ${
                    light ? 'text-white/60 hover:text-white' : 'text-[var(--color-slate)] hover:text-[var(--color-teal-900)]'
                  }`}
                >
                  {c.label}
                </Link>
              ) : (
                <span className={light ? 'text-white/90' : 'text-[var(--color-ink)]'} aria-current={last ? 'page' : undefined}>
                  {c.label}
                </span>
              )}
              {!last && (
                <ChevronRight
                  size={11}
                  className={light ? 'text-white/35' : 'text-[var(--color-slate)]/50'}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function breadcrumbSchema(items: Crumb[], baseUrl: string) {
  const all: Crumb[] = [{ label: 'Home', href: '/' }, ...items];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${baseUrl}${c.href}` } : {}),
    })),
  };
}

/* --------------------------------------------------------------- page hero */

export function PageHero({
  title,
  eyebrow,
  intro,
  image,
  imageAlt = '',
  imagePosition,
  crumbs,
  align = 'left',
  compact = false,
}: {
  title: string;
  eyebrow?: string;
  intro?: string;
  image?: string | null;
  imageAlt?: string;
  /** CSS object-position for the hero photo. Several legacy banners carry a
   *  large empty gradient below the photograph and need anchoring to the top. */
  imagePosition?: string;
  crumbs: Crumb[];
  align?: 'left' | 'center';
  compact?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-navy)] border-b border-[var(--color-navy-rule)]">
      {image && (
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          style={imagePosition ? { objectPosition: imagePosition } : undefined}
          className="object-cover opacity-85"
        />
      )}
      <div className="absolute inset-0 scrim-page" aria-hidden />
      <div
        className="pointer-events-none absolute -bottom-16 left-1/4 h-36 w-96 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.12),transparent_70%)] blur-2xl"
        aria-hidden
      />

      <div
        className={`shell relative ${compact ? 'py-11 lg:py-12' : 'py-12 lg:py-16'} ${
          align === 'center' ? 'text-center' : ''
        }`}
      >
        <div className={align === 'center' ? 'mx-auto max-w-3xl' : 'max-w-3xl'}>
          <Breadcrumbs items={crumbs} light />
          {eyebrow && (
            <p className="eyebrow mt-5 text-[0.625rem] text-[var(--color-gold-soft)]">{eyebrow}</p>
          )}
          <h1 className="mt-3 font-serif text-[clamp(2rem,4.3vw,3.4rem)] leading-[1.04] tracking-[-0.018em] text-white">
            {title}
          </h1>
          {intro && (
            <p className="mt-4 max-w-2xl text-[0.9375rem] leading-[1.6] text-white/78">{intro}</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- section header */

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  light = false,
  action,
  className = '',
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  light?: boolean;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <RevealOnScroll
      className={`${align === 'center' ? 'mx-auto max-w-2xl text-center' : ''} ${
        action ? 'flex flex-col gap-6 md:flex-row md:items-end md:justify-between' : ''
      } ${className}`}
    >
      <div className={align === 'center' ? '' : 'max-w-2xl'}>
        {eyebrow && (
          <p className={`eyebrow ${align === 'center' ? 'eyebrow-plain justify-center' : ''}`}>{eyebrow}</p>
        )}
        <h2
          className={`mt-4 font-serif text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.1] ${
            light ? 'text-white' : 'text-[var(--color-ink)]'
          }`}
        >
          {title}
        </h2>
        {intro && (
          <div
            className={`mt-4 text-[1.0625rem] leading-relaxed ${
              light ? 'text-white/70' : 'text-[var(--color-slate)]'
            }`}
          >
            {intro}
          </div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </RevealOnScroll>
  );
}

/* ----------------------------------------------------------------- layout */

export function Section({
  children,
  className = '',
  tone = 'warm',
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: 'warm' | 'white' | 'navy' | 'stone';
  id?: string;
}) {
  const tones = {
    warm: 'bg-[var(--color-warm)]',
    white: 'bg-white',
    stone: 'bg-[var(--color-stone-soft)]',
    navy: 'bg-[var(--color-navy)] text-white',
  };
  return (
    <section id={id} className={`${tones[tone]} py-16 lg:py-24 ${className}`}>
      {children}
    </section>
  );
}

/* -------------------------------------------------------------- rich text */

/**
 * Renders migrated CMS body copy. The HTML comes from the archived silverone.com
 * pages and is sanitised at build time by scripts/lib-html.mjs — it is static
 * project content, never visitor input.
 */
export function RichText({ html, className = '' }: { html: string; className?: string }) {
  return (
    <div className={`prose-sve ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

/* ------------------------------------------------------------------ misc */

export function Pill({ children, tone = 'gold' }: { children: ReactNode; tone?: 'gold' | 'teal' | 'light' }) {
  const tones = {
    gold: 'border-[var(--color-gold)]/40 text-[var(--color-gold-text)]',
    teal: 'border-[var(--color-teal-900)]/30 bg-[var(--color-teal-50)] text-[var(--color-teal-900)]',
    light: 'border-white/30 text-white/85',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="card border-dashed px-6 py-14 text-center">
      <p className="font-serif text-xl text-[var(--color-ink)]">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-slate)]">{body}</p>
    </div>
  );
}
