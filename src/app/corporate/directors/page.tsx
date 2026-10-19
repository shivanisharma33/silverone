import type { Metadata } from 'next';
import { PageHero, Section, breadcrumbSchema } from '@/components/ui';
import { TeamTabs } from '@/components/TeamTabs';
import { TeamGrid } from '@/components/TeamGrid';
import { team } from '@/lib/content';
import { SITE } from '@/lib/site';

const CRUMBS = [{ label: 'Corporate', href: '/corporate/about-silver-one/' }, { label: 'Directors' }];

export const metadata: Metadata = {
  title: 'Directors',
  description:
    'The board of directors of Silver One Resources Inc., chaired by Luke Norman.',
  alternates: { canonical: '/corporate/directors/' },
};

export default function DirectorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(CRUMBS, SITE.url)) }}
      />
      <PageHero
        title="Board of Directors"
        eyebrow="Our Team"
        intro="Silver One’s board brings decades of combined experience in mineral exploration, capital markets and company building."
        image="/assets/derived/corporate-banner.jpg"
        imageAlt=""
        crumbs={CRUMBS}
      />
      <Section tone="warm" className="py-10 lg:py-12">
        <div className="shell">
          <TeamTabs active="directors" />
          <div className="mt-9">
            <TeamGrid people={team.directors} basePath="/corporate/directors/" label="Board of directors" />
          </div>
        </div>
      </Section>
    </>
  );
}
