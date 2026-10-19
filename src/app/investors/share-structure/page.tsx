import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { PageHero, RichText, Section, breadcrumbSchema } from '@/components/ui';
import { RevealOnScroll } from '@/components/Reveal';
import { pages } from '@/lib/content';
import { SITE } from '@/lib/site';

const CRUMBS = [{ label: 'Investors', href: '/investors/' }, { label: 'Share Structure' }];

export const metadata: Metadata = {
  title: 'Share Structure',
  description:
    'Capital structure of Silver One Resources Inc. — issued and outstanding shares, warrants, options, fully diluted position, strategic shareholders and corporate milestones.',
  alternates: { canonical: '/investors/share-structure/' },
};

export default function ShareStructurePage() {
  const page = pages.shareStructure;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(CRUMBS, SITE.url)) }}
      />

      <PageHero
        title="Share Structure"
        eyebrow="Investors"
        intro="Capital structure, strategic shareholders and the milestones that shaped the Company."
        image={page.banner}
        crumbs={CRUMBS}
        compact
      />

      <Section tone="warm">
        <div className="shell-narrow lg:max-w-5xl">
          <RevealOnScroll>
            <RichText html={page.html} />
          </RevealOnScroll>

          <RevealOnScroll delay={0.08}>
            <div className="card mt-12 bg-[var(--color-teal-50)] p-6 lg:p-8">
              <h2 className="font-serif text-xl">Looking for the filings behind these figures?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-slate)]">
                Quarterly and annual financial statements, the management information circular and
                all other continuous-disclosure documents are published in full.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <Link href="/corporate/financials-statements/" className="btn btn-primary">
                  Financial Statements
                  <ArrowRight size={14} aria-hidden />
                </Link>
                <Link href="/documents/" className="btn btn-outline">
                  Document Library
                  <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </Section>
    </>
  );
}
