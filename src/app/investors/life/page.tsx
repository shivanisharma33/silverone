import type { Metadata } from 'next';
import { DocumentListPage } from '@/components/DocumentListPage';
import { documents, pages } from '@/lib/content';

const CRUMBS = [
  { label: 'Investors', href: '/investors/' },
  { label: 'LIFE' },
];

export const metadata: Metadata = {
  title: 'LIFE',
  description:
    'Listed Issuer Financing Exemption (LIFE) offering documents for Silver One Resources Inc.',
  alternates: { canonical: '/investors/life/' },
};

export default function Page() {
  const rows = documents.life ?? [];
  return (
    <DocumentListPage
      title="LIFE"
      
      intro="Offering documents prepared under the Listed Issuer Financing Exemption of National Instrument 45-106."
      crumbs={CRUMBS}
      rows={rows}
      banner={pages.shareStructure.banner}
      
    />
  );
}
