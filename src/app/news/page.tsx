import type { Metadata } from 'next';
import { PageHero, Section, breadcrumbSchema } from '@/components/ui';
import { NewsArchive } from '@/components/NewsArchive';
import { news, newsSummaries, newsYears } from '@/lib/content';
import { SITE } from '@/lib/site';

const CRUMBS = [{ label: 'News' }];

export const metadata: Metadata = {
  title: 'News Releases',
  description:
    'The complete archive of Silver One Resources Inc. news releases, from 2016 to the present — exploration results, corporate updates, financings and regulatory announcements.',
  alternates: { canonical: '/news/' },
};

export default function NewsIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(CRUMBS, SITE.url)) }}
      />
      <PageHero
        title="News Releases"
        eyebrow="News"
        intro={`The complete archive — ${news.length} releases published since ${newsYears[newsYears.length - 1]}.`}
        image="/assets/files/2002/news-banner.jpg"
        crumbs={CRUMBS}
        compact
      />
      <Section tone="warm">
        <div className="shell">
          <NewsArchive items={newsSummaries} years={newsYears} />
        </div>
      </Section>
    </>
  );
}
