import type { Metadata } from 'next';
import { PageHero, Section, breadcrumbSchema } from '@/components/ui';
import { DocumentLibrary } from '@/components/DocumentLibrary';
import { documentCount, documentLibrary, pages } from '@/lib/content';
import { SITE } from '@/lib/site';

const CRUMBS = [{ label: 'Investors', href: '/investors/' }, { label: 'Document Library' }];

export const metadata: Metadata = {
  title: 'Document Library',
  description:
    'Every Silver One Resources document in one place — corporate presentations, factsheets, NI 43-101 technical reports, financial statements, AGM materials, ESTMA reports and LIFE disclosures.',
  alternates: { canonical: '/documents/' },
};

export default function DocumentLibraryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(CRUMBS, SITE.url)) }}
      />
      <PageHero
        title="Document Library"
        eyebrow="Investors"
        intro={`Every published document in one searchable index — ${documentCount} files across ${documentLibrary.length} entries.`}
        image={pages.shareStructure.banner}
        crumbs={CRUMBS}
        compact
      />
      <Section tone="warm">
        <div className="shell">
          <DocumentLibrary entries={documentLibrary} />
        </div>
      </Section>
    </>
  );
}
