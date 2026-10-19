import type { Metadata } from 'next';
import { DocumentListPage } from '@/components/DocumentListPage';
import { documents, pages } from '@/lib/content';

const CRUMBS = [
  { label: 'Investors', href: '/investors/' },
  { label: 'ESTMA Reports' },
];

export const metadata: Metadata = {
  title: 'ESTMA Reports',
  description:
    'Silver One Resources reports filed under the Extractive Sector Transparency Measures Act (ESTMA), from 2017 onward.',
  alternates: { canonical: '/investors/estma_reports-2/' },
};

export default function Page() {
  const rows = documents.estma ?? [];
  return (
    <DocumentListPage
      title="ESTMA Reports"
      
      intro="Annual reports filed under the Extractive Sector Transparency Measures Act, disclosing payments made to governments."
      crumbs={CRUMBS}
      rows={rows}
      banner={pages.shareStructure.banner}
      
    />
  );
}
