import type { Metadata } from 'next';
import { DocumentListPage } from '@/components/DocumentListPage';
import { documents, pages } from '@/lib/content';

const CRUMBS = [
  { label: 'Corporate', href: '/corporate/about-silver-one/' },
  { label: 'Financial Statements' },
];

export const metadata: Metadata = {
  title: 'Financial Statements',
  description:
    'Quarterly and annual financial statements and MD&A for Silver One Resources Inc., from 2008 to the present.',
  alternates: { canonical: '/corporate/financials-statements/' },
};

export default function Page() {
  const rows = documents.financials ?? [];
  return (
    <DocumentListPage
      title="Financial Statements"
      eyebrow="Corporate"
      intro="Quarterly and annual financial statements with the accompanying Management Discussion & Analysis, by year."
      crumbs={CRUMBS}
      rows={rows}
      banner={pages.about.banner}
      
    />
  );
}
