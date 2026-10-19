import type { Metadata } from 'next';
import { PageHero, RichText, Section, breadcrumbSchema } from '@/components/ui';
import { RevealOnScroll } from '@/components/Reveal';
import { pages } from '@/lib/content';
import { SITE } from '@/lib/site';

const CRUMBS = [{ label: 'Legal Notices' }];

export const metadata: Metadata = {
  title: 'Legal Notices',
  description:
    'Legal notices, disclaimer and forward-looking information statement for the Silver One Resources Inc. website.',
  alternates: { canonical: '/disclaimer/' },
};



export default function DisclaimerPage() {
  const page = pages.disclaimer;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(CRUMBS, SITE.url)) }}
      />
      <PageHero
        title="Legal Notices"
        eyebrow="Legal"
        intro="Terms governing the use of this website, and the disclosures that apply to its content."
        image={page.banner}
        crumbs={CRUMBS}
        compact
      />
      <Section tone="warm">
        <div className="shell-narrow">
          <RevealOnScroll>
            <RichText html={page.html} />
            <div className="hairline mt-12 pt-8">
              <h2 className="font-serif text-xl">Qualified Person</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-slate)]">
                {SITE.qualifiedPerson}
              </p>
              <h2 className="mt-8 font-serif text-xl">Exchange Disclaimer</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-slate)]">
                {SITE.exchangeDisclaimer}
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </Section>
    </>
  );
}
