import type { Metadata } from 'next';
import { PageHero, Section, breadcrumbSchema } from '@/components/ui';
import { StockCharts } from '@/components/StockCharts';
import { RevealOnScroll } from '@/components/Reveal';
import { pages } from '@/lib/content';
import { SITE } from '@/lib/site';

const CRUMBS = [{ label: 'Investors', href: '/investors/' }, { label: 'Stock Information' }];

export const metadata: Metadata = {
  title: 'Stock Information',
  description:
    'Share price charts and delayed quotes for Silver One Resources Inc. on the TSX Venture Exchange (SVE), OTCQX (SLVRF) and the Frankfurt Stock Exchange (BRK1).',
  alternates: { canonical: '/investors/overview/' },
};

export default function StockInformationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(CRUMBS, SITE.url)) }}
      />
      <PageHero
        title="Stock Information"
        eyebrow="Investors"
        intro="Delayed price charts and quote detail for each of Silver One's three listings."
        image={pages.shareStructure.banner}
        crumbs={CRUMBS}
        compact
      />
      <Section tone="warm">
        <div className="shell">
          <RevealOnScroll>
            <StockCharts />
          </RevealOnScroll>
        </div>
      </Section>
    </>
  );
}
