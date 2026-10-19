import type { Metadata } from 'next';
import { PageHero, EmptyState, Section, breadcrumbSchema } from '@/components/ui';
import { InterviewGrid } from '@/components/InterviewGrid';
import { RevealOnScroll } from '@/components/Reveal';
import { interviews, pages } from '@/lib/content';
import { SITE } from '@/lib/site';

const CRUMBS = [{ label: 'Investors', href: '/investors/' }, { label: 'Interviews' }];

export const metadata: Metadata = {
  title: 'Interviews',
  description:
    'Video interviews and media coverage featuring Silver One Resources management, discussing the Candelaria, Cherokee and Phoenix Silver projects.',
  alternates: { canonical: '/investors/interviews/' },
};

export default function InterviewsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(CRUMBS, SITE.url)) }}
      />

      <PageHero
        title="Interviews"
        eyebrow="Investors"
        intro="Management interviews and media coverage, newest first."
        image={pages.shareStructure.banner}
        crumbs={CRUMBS}
        compact
      />

      <Section tone="warm">
        <div className="shell">
          {interviews.length === 0 ? (
            <EmptyState title="No interviews published" body="Check back for new media coverage." />
          ) : (
            <RevealOnScroll>
              <InterviewGrid items={interviews} />
            </RevealOnScroll>
          )}
        </div>
      </Section>
    </>
  );
}
