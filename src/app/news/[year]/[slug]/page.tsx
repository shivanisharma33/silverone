import Link from 'next/link';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Download, FileText } from 'lucide-react';
import { Breadcrumbs, RichText, Section, SectionHeading, breadcrumbSchema } from '@/components/ui';
import { NewsCard } from '@/components/cards';
import { RevealChild, RevealGroup } from '@/components/Reveal';
import { findNews, formatDate, news } from '@/lib/content';
import { SITE } from '@/lib/site';

type Params = { params: Promise<{ year: string; slug: string }> };

export function generateStaticParams() {
  return news.map((n) => ({ year: n.year, slug: n.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { year, slug } = await params;
  const item = findNews(year, slug);
  if (!item) return { title: 'News release not found' };

  const image = item.images[0]?.src;
  return {
    title: item.headline,
    description: item.excerpt.slice(0, 180),
    alternates: { canonical: `/news/${item.year}/${item.slug}/` },
    openGraph: {
      type: 'article',
      title: item.headline,
      description: item.excerpt.slice(0, 180),
      publishedTime: item.date,
      url: `${SITE.url}/news/${item.year}/${item.slug}/`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: item.headline,
      description: item.excerpt.slice(0, 180),
    },
  };
}

/**
 * With `cacheComponents` enabled, reading `params` must happen inside a
 * Suspense boundary so the static shell can stream ahead of the URL data.
 */
export default function NewsArticlePage({ params }: Params) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <NewsArticleContent params={params} />
    </Suspense>
  );
}

function ArticleSkeleton() {
  return (
    <div className="bg-[var(--color-warm)] py-20" role="status" aria-label="Loading news release">
      <div className="shell-narrow animate-pulse space-y-4 lg:max-w-4xl">
        <div className="h-3 w-40 rounded bg-[var(--color-stone)]" />
        <div className="h-12 w-full rounded bg-[var(--color-stone)]" />
        <div className="h-12 w-3/4 rounded bg-[var(--color-stone)]" />
        <div className="mt-8 h-4 w-full rounded bg-[var(--color-stone)]" />
        <div className="h-4 w-11/12 rounded bg-[var(--color-stone)]" />
        <div className="h-4 w-10/12 rounded bg-[var(--color-stone)]" />
      </div>
    </div>
  );
}

async function NewsArticleContent({ params }: Params) {
  const { year, slug } = await params;
  const item = findNews(year, slug);
  if (!item) notFound();

  const index = news.findIndex((n) => n.year === year && n.slug === slug);
  const newer = index > 0 ? news[index - 1] : null;
  const older = index < news.length - 1 ? news[index + 1] : null;
  const related = news.filter((_, i) => i !== index).slice(0, 3);

  const crumbs = [
    { label: 'News', href: '/news/' },
    { label: item.year, href: `/news/${item.year}/` },
    { label: item.headline.length > 56 ? item.headline.slice(0, 56) + '…' : item.headline },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: item.headline,
            datePublished: item.date,
            dateModified: item.date,
            description: item.excerpt.slice(0, 250),
            image: item.images.map((i) => `${SITE.url}${i.src}`).slice(0, 3),
            mainEntityOfPage: `${SITE.url}/news/${item.year}/${item.slug}/`,
            author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
            publisher: {
              '@type': 'Organization',
              name: SITE.name,
              logo: { '@type': 'ImageObject', url: `${SITE.url}/brand/logo-footer.png` },
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs, SITE.url)) }}
      />

      <Section tone="warm" className="pt-9 lg:pt-12">
        <article className="shell-narrow lg:max-w-4xl">
          <Breadcrumbs items={crumbs} />

          <header className="mt-9">
            <time
              dateTime={item.date}
              className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-text)]"
            >
              {formatDate(item.date)}
            </time>
            <h1 className="mt-4 font-serif text-[clamp(1.9rem,4.4vw,3.1rem)] leading-[1.08]">
              {item.headline}
            </h1>
            {item.subhead && (
              <p className="mt-4 text-lg leading-relaxed text-[var(--color-slate)]">{item.subhead}</p>
            )}
          </header>

          {item.docs.length > 0 && (
            <aside
              aria-label="Related documents"
              className="card mt-9 bg-[var(--color-teal-50)] p-5 lg:p-6"
            >
              <h2 className="flex items-center gap-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-900)]">
                <FileText size={13} aria-hidden />
                Related Document{item.docs.length > 1 ? 's' : ''}
              </h2>
              <ul className="mt-3.5 flex flex-wrap gap-2.5">
                {item.docs.map((d) => (
                  <li key={d.href}>
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-[var(--color-teal-900)]/25 bg-white px-3.5 py-2 text-xs font-semibold text-[var(--color-teal-900)] transition-colors hover:border-[var(--color-teal-900)] hover:bg-white"
                      aria-label={`${d.label} — ${item.headline} (PDF, opens in a new tab)`}
                    >
                      <Download size={13} aria-hidden />
                      {d.label}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <div className="rule-gold mt-10" />
          <RichText html={item.html} className="mt-8" />

          <footer className="mt-14 border-t border-[var(--color-stone)] pt-8">
            <p className="text-xs text-[var(--color-slate)]">
              This news release is reproduced as issued by {SITE.name}.
            </p>

            <nav
              aria-label="More news releases"
              className="mt-7 grid gap-4 sm:grid-cols-2"
            >
              {older && (
                <Link
                  href={`/news/${older.year}/${older.slug}/`}
                  className="card card-hover group p-5"
                  rel="prev"
                >
                  <span className="flex items-center gap-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-slate)]">
                    <ArrowLeft size={12} aria-hidden />
                    Previous release
                  </span>
                  <span className="mt-2 block font-serif text-[0.95rem] leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-teal-900)]">
                    {older.headline}
                  </span>
                </Link>
              )}
              {newer && (
                <Link
                  href={`/news/${newer.year}/${newer.slug}/`}
                  className="card card-hover group p-5 sm:text-right"
                  rel="next"
                >
                  <span className="flex items-center gap-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-slate)] sm:justify-end">
                    Next release
                    <ArrowRight size={12} aria-hidden />
                  </span>
                  <span className="mt-2 block font-serif text-[0.95rem] leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-teal-900)]">
                    {newer.headline}
                  </span>
                </Link>
              )}
            </nav>

            <Link href="/news/" className="btn btn-outline mt-8">
              <ArrowLeft size={15} aria-hidden />
              Back to all news
            </Link>
          </footer>
        </article>
      </Section>

      <Section tone="white">
        <div className="shell">
          <SectionHeading eyebrow="More News" title="Latest Releases" />
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((n) => (
              <RevealChild key={`${n.year}-${n.slug}`}>
                <NewsCard item={n} />
              </RevealChild>
            ))}
          </RevealGroup>
        </div>
      </Section>
    </>
  );
}
