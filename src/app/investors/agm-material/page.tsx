import type { Metadata } from 'next';
import { DocumentListPage } from '@/components/DocumentListPage';
import { documents, pages } from '@/lib/content';

const CRUMBS = [
  { label: 'Investors', href: '/investors/' },
  { label: 'AGM Material' },
];

export const metadata: Metadata = {
  title: 'AGM Material',
  description:
    'Annual General Meeting materials for Silver One Resources Inc., including the notice and circular, proxy and financial statement request form.',
  alternates: { canonical: '/investors/agm-material/' },
};

export default function Page() {
  const rows = documents.agm ?? [];
  return (
    <DocumentListPage
      title="AGM Material"
      
      intro="Notice of meeting, management information circular, form of proxy and financial statement request form."
      crumbs={CRUMBS}
      rows={rows}
      banner={pages.shareStructure.banner}
      
    />
  );
}
