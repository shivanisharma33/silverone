import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero, Section, breadcrumbSchema } from '@/components/ui';
import { NewsArchive } from '@/components/NewsArchive';
import { newsSummariesByYear, newsYears } from '@/lib/content';
import { SITE } from '@/lib/site';

type Params = { params: Promise<{ year: string }> };

export function generateStaticParams() {
  return newsYears.map((year) => ({ year }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { year } = await params;
  if (!newsYears.includes(year)) return { title: 'Year not found' };
  const items = newsSummariesByYear(year);
  return {
    title: `${year} News Releases`,
    description: `All ${items.length} Silver One Resources news releases published in ${year}.`,
    alternates: { canonical: `/news/${year}/` },
  };
}

/**
 * With `cacheComponents` enabled, reading `params` must happen inside a
 * Suspense boundary so the static shell can stream ahead of the URL data.
 */
export default function NewsYearPage({ params }: Params) {
  return (
    <Suspense fallback={<YearSkeleton />}>
      <NewsYearContent params={params} />
    </Suspense>
  );
}

function YearSkeleton() {
  return (
    <div className="bg-[var(--color-warm)] py-24" role="status" aria-label="Loading releases">
      <div className="shell animate-pulse space-y-4">
        <div className="h-10 w-1/3 rounded bg-[var(--color-stone)]" />
        <div className="h-4 w-2/3 rounded bg-[var(--color-stone)]" />
      </div>
    </div>
  );
}

async function NewsYearContent({ params }: Params) {
  const { year } = await params;
  if (!newsYears.includes(year)) notFound();

  const items = newsSummariesByYear(year);
  const crumbs = [{ label: 'News', href: '/news/' }, { label: year }];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs, SITE.url)) }}
      />
      <PageHero
        title={`${year} News Releases`}
        eyebrow="News Archive"
        intro={`${items.length} release${items.length === 1 ? '' : 's'} published in ${year}.`}
        image="/assets/files/2002/news-banner.jpg"
        crumbs={crumbs}
        compact
      />
      <Section tone="warm">
        <div className="shell">
          <NewsArchive items={items} years={newsYears} activeYear={year} />
        </div>
      </Section>
    </>
  );
}
