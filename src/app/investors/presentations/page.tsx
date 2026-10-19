import type { Metadata } from 'next';
import { DocumentListPage } from '@/components/DocumentListPage';
import { documents, pages } from '@/lib/content';

const CRUMBS = [
  { label: 'Investors', href: '/investors/' },
  { label: 'Presentations' },
];

export const metadata: Metadata = {
  title: 'Corporate Presentations',
  description:
    'The latest Silver One Resources corporate presentation, covering the Candelaria, Cherokee and Phoenix Silver projects.',
  alternates: { canonical: '/investors/presentations/' },
};

export default function Page() {
  const rows = documents.presentations ?? [];
  return (
    <DocumentListPage
      title="Corporate Presentations"
      
      intro="Our current corporate deck, covering strategy, the Candelaria resource and the exploration pipeline."
      crumbs={CRUMBS}
      rows={rows}
      banner={pages.shareStructure.banner}
      cover={rows[0]?.cover}
      coverAlt={rows[0] ? `Cover of the ${rows[0].title}` : undefined}
    />
  );
}
