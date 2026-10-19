import type { Metadata } from 'next';
import { DocumentListPage } from '@/components/DocumentListPage';
import { documents, pages } from '@/lib/content';

const CRUMBS = [
  { label: 'Investors', href: '/investors/' },
  { label: 'Factsheet' },
];

export const metadata: Metadata = {
  title: 'Factsheet',
  description:
    'Download the Silver One Resources factsheet — a one-page summary of the Company, its projects and its capital structure.',
  alternates: { canonical: '/investors/factsheets/' },
};

export default function Page() {
  const rows = documents.factsheets ?? [];
  return (
    <DocumentListPage
      title="Factsheet"
      
      intro="A one-page summary of the Company, its projects and its share structure."
      crumbs={CRUMBS}
      rows={rows}
      banner={pages.shareStructure.banner}
      
    />
  );
}
