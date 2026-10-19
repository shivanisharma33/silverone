import type { Metadata } from 'next';
import { PageHero, Section, breadcrumbSchema } from '@/components/ui';
import { TeamTabs } from '@/components/TeamTabs';
import { TeamGrid } from '@/components/TeamGrid';
import { team } from '@/lib/content';
import { SITE } from '@/lib/site';

const CRUMBS = [{ label: 'Corporate', href: '/corporate/about-silver-one/' }, { label: 'Management' }];

export const metadata: Metadata = {
  title: 'Management',
  description:
    'The Silver One Resources management team and advisors, led by President and CEO Gregory Crowe.',
  alternates: { canonical: '/corporate/management/' },
};

export default function ManagementPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(CRUMBS, SITE.url)) }}
      />
      <PageHero
        title="Management"
        eyebrow="Our Team"
        intro="An experienced team with a proven track record in exploration, development and value creation."
        image="/assets/derived/corporate-banner.jpg"
        imageAlt=""
        crumbs={CRUMBS}
      />
      <Section tone="warm" className="py-10 lg:py-12">
        <div className="shell">
          <TeamTabs active="management" />
          <div className="mt-9">
            <TeamGrid people={team.management} basePath="/corporate/management/" label="Management team" />
          </div>
        </div>
      </Section>
    </>
  );
}
