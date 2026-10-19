/**
 * Generates the thin page files for the investor document routes. Each one is
 * the same shape, so keeping them in a table avoids seven near-identical files
 * drifting apart.
 */
import fs from 'node:fs';
import path from 'node:path';

const PAGES = [
  {
    dir: 'src/app/investors/presentations',
    route: '/investors/presentations/',
    key: 'presentations',
    title: 'Corporate Presentations',
    crumb: 'Presentations',
    meta: 'The latest Silver One Resources corporate presentation, covering the Candelaria, Cherokee and Phoenix Silver projects.',
    intro: 'Our current corporate deck, covering strategy, the Candelaria resource and the exploration pipeline.',
    cover: true,
  },
  {
    dir: 'src/app/investors/factsheets',
    route: '/investors/factsheets/',
    key: 'factsheets',
    title: 'Factsheet',
    crumb: 'Factsheet',
    meta: 'Download the Silver One Resources factsheet — a one-page summary of the Company, its projects and its capital structure.',
    intro: 'A one-page summary of the Company, its projects and its share structure.',
  },
  {
    dir: 'src/app/investors/agm-material',
    route: '/investors/agm-material/',
    key: 'agm',
    title: 'AGM Material',
    crumb: 'AGM Material',
    meta: 'Annual General Meeting materials for Silver One Resources Inc., including the notice and circular, proxy and financial statement request form.',
    intro: 'Notice of meeting, management information circular, form of proxy and financial statement request form.',
  },
  {
    dir: 'src/app/investors/estma_reports-2',
    route: '/investors/estma_reports-2/',
    key: 'estma',
    title: 'ESTMA Reports',
    crumb: 'ESTMA Reports',
    meta: 'Silver One Resources reports filed under the Extractive Sector Transparency Measures Act (ESTMA), from 2017 onward.',
    intro:
      'Annual reports filed under the Extractive Sector Transparency Measures Act, disclosing payments made to governments.',
  },
  {
    dir: 'src/app/investors/life',
    route: '/investors/life/',
    key: 'life',
    title: 'LIFE',
    crumb: 'LIFE',
    meta: 'Listed Issuer Financing Exemption (LIFE) offering documents for Silver One Resources Inc.',
    intro:
      'Offering documents prepared under the Listed Issuer Financing Exemption of National Instrument 45-106.',
  },
  {
    dir: 'src/app/corporate/financials-statements',
    route: '/corporate/financials-statements/',
    key: 'financials',
    title: 'Financial Statements',
    crumb: 'Financial Statements',
    section: 'Corporate',
    sectionHref: '/corporate/about-silver-one/',
    meta: 'Quarterly and annual financial statements and MD&A for Silver One Resources Inc., from 2008 to the present.',
    intro:
      'Quarterly and annual financial statements with the accompanying Management Discussion & Analysis, by year.',
    banner: 'pages.about.banner',
  },
];

const tpl = (p) => `import type { Metadata } from 'next';
import { DocumentListPage } from '@/components/DocumentListPage';
import { documents, pages } from '@/lib/content';

const CRUMBS = [
  { label: '${p.section || 'Investors'}', href: '${p.sectionHref || '/investors/'}' },
  { label: '${p.crumb}' },
];

export const metadata: Metadata = {
  title: '${p.title.replace(/'/g, "\\'")}',
  description:
    '${p.meta.replace(/'/g, "\\'")}',
  alternates: { canonical: '${p.route}' },
};

export default function Page() {
  const rows = documents.${p.key} ?? [];
  return (
    <DocumentListPage
      title="${p.title}"
      ${p.section ? `eyebrow="${p.section}"` : ''}
      intro="${p.intro.replace(/"/g, '&quot;')}"
      crumbs={CRUMBS}
      rows={rows}
      banner={${p.banner || 'pages.shareStructure.banner'}}
      ${p.cover ? 'cover={rows[0]?.cover}\n      coverAlt={rows[0] ? `Cover of the ${rows[0].title}` : undefined}' : ''}
    />
  );
}
`;

for (const p of PAGES) {
  fs.mkdirSync(p.dir, { recursive: true });
  fs.writeFileSync(path.join(p.dir, 'page.tsx'), tpl(p));
  console.log('wrote', path.join(p.dir, 'page.tsx'));
}
