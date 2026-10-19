import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  FileBarChart,
  FileSpreadsheet,
  FileText,
  Landmark,
  PieChart,
  Presentation,
  Scale,
} from 'lucide-react';
import { PageHero, Section, SectionHeading, breadcrumbSchema } from '@/components/ui';
import { NewsCard } from '@/components/cards';
import { StockCharts } from '@/components/StockCharts';
import { RevealChild, RevealGroup, RevealOnScroll } from '@/components/Reveal';
import { documentCount, documents, formatDate, latestNews, pages } from '@/lib/content';
import { LISTINGS, SITE } from '@/lib/site';

const CRUMBS = [{ label: 'Investors' }];

export const metadata: Metadata = {
  title: 'Investor Information',
  description:
    'Investor resources for Silver One Resources Inc. (TSX-V: SVE, OTCQX: SLVRF, FSE: BRK1) — stock information, share structure, presentations, financial statements, technical reports and regulatory filings.',
  alternates: { canonical: '/investors/' },
};

const RESOURCES = [
  {
    label: 'Stock Information',
    body: 'Real-time quotes and market data across all three listings.',
    href: '/investors/overview/',
    icon: BarChart3,
  },
  {
    label: 'Share Structure',
    body: 'Current share capital, warrants, options and ownership.',
    href: '/investors/share-structure/',
    icon: PieChart,
  },
  {
    label: 'Corporate Presentations',
    body: 'Latest presentations and investor materials.',
    href: '/investors/presentations/',
    icon: Presentation,
  },
  {
    label: 'Factsheet',
    body: 'One-page company overview and key information.',
    href: '/investors/factsheets/',
    icon: FileText,
  },
  {
    label: 'Financial Statements',
    body: 'Annual and interim financial statements with MD&A.',
    href: '/corporate/financials-statements/',
    icon: FileSpreadsheet,
  },
  {
    label: 'AGM Materials',
    body: 'Annual meeting materials, circular and proxy.',
    href: '/investors/agm-material/',
    icon: Landmark,
  },
  {
    label: 'ESTMA Reports',
    body: 'Payments to governments under the Extractive Sector Transparency Measures Act.',
    href: '/investors/estma_reports-2/',
    icon: FileBarChart,
  },
  {
    label: 'LIFE',
    body: 'Listed Issuer Financing Exemption offering documents.',
    href: '/investors/life/',
    icon: Scale,
  },
];

export default function InvestorsPage() {
  const presentations = [
    ...(documents.presentations ?? []),
    ...(documents.factsheets ?? []),
  ]
    .sort((a, b) => ((a.dateIso || '') < (b.dateIso || '') ? 1 : -1))
    .slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(CRUMBS, SITE.url)) }}
      />

      <PageHero
        title="Resources for Investors"
        eyebrow="Investor Information"
        intro="Access our latest presentations, financial information, reports and corporate resources."
        image={pages.shareStructure.banner}
        imageAlt=""
        crumbs={CRUMBS}
      />

      {/* ------------------------------------------------- resource cards -- */}
      <Section tone="warm" className="py-12 lg:py-14">
        <div className="shell">
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.045}>
            {RESOURCES.map((r) => (
              <RevealChild key={r.href}>
                <Link
                  href={r.href}
                  className="card card-hover group flex h-full flex-col p-5 hover:border-[var(--color-teal-900)]/30"
                >
                  <r.icon size={19} strokeWidth={1.4} className="text-[var(--color-teal-900)]" aria-hidden />
                  <span className="mt-4 block text-[0.9375rem] font-semibold leading-snug text-[var(--color-ink)]">
                    {r.label}
                  </span>
                  <span className="mt-1.5 block flex-1 text-[0.75rem] leading-[1.5] text-[var(--color-slate)]">
                    {r.body}
                  </span>
                  <ArrowRight
                    size={14}
                    className="mt-4 text-[var(--color-gold-text)] transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>
              </RevealChild>
            ))}
          </RevealGroup>

          <RevealOnScroll delay={0.1}>
            <p className="mt-7 text-[0.8125rem] text-[var(--color-slate)]">
              {documentCount} documents are published across presentations, filings, technical
              reports and disclosures.{' '}
              <Link
                href="/documents/"
                className="font-semibold text-[var(--color-teal-900)] underline underline-offset-2"
              >
                Browse the full document library
              </Link>
              .
            </p>
          </RevealOnScroll>
        </div>
      </Section>

      {/* ------------------------------------------ stock + presentations -- */}
      <Section tone="white" className="py-12 lg:py-14">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <RevealOnScroll>
              <p className="eyebrow text-[0.625rem]">Market</p>
              <h2 className="mt-3 font-serif text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.1]">
                Stock Information
              </h2>
              <div className="mt-7">
                <StockCharts />
              </div>
            </RevealOnScroll>
          </div>

          <aside className="lg:col-span-4">
            <RevealOnScroll delay={0.08}>
              <p className="eyebrow text-[0.625rem]">Documents</p>
              <h2 className="mt-3 font-serif text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.1]">
                Recent Presentations
              </h2>

              <ul className="mt-6 space-y-3">
                {presentations.map((d) => {
                  const link = d.links[0];
                  if (!link) return null;
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card card-hover group flex items-start gap-3.5 p-4"
                      >
                        <FileText
                          size={17}
                          strokeWidth={1.4}
                          className="mt-0.5 shrink-0 text-[var(--color-teal-900)]"
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[0.875rem] font-semibold leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-teal-900)]">
                            {d.title}
                          </span>
                          <span className="mt-1 block text-[0.6875rem] text-[var(--color-slate)]">
                            {d.dateIso ? formatDate(d.dateIso) : d.date}
                            {link.size ? ` · PDF, ${link.size}` : ' · PDF'}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={14}
                          className="mt-0.5 shrink-0 text-[var(--color-slate)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="card mt-6 bg-[var(--color-teal-50)] p-5">
                <h3 className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-text)]">
                  Listings
                </h3>
                <ul className="mt-3 space-y-2">
                  {LISTINGS.map((l) => (
                    <li key={l.symbol} className="flex items-center justify-between gap-4 text-[0.8125rem]">
                      <span className="text-[var(--color-slate)]">{l.exchange}</span>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-teal-900)]"
                      >
                        {l.symbol}
                        <ArrowUpRight size={12} aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          </aside>
        </div>
      </Section>

      {/* ------------------------------------------------------ latest news */}
      <Section tone="warm" className="py-12 lg:py-14">
        <div className="shell">
          <SectionHeading
            eyebrow="Latest News"
            title="Recent Announcements"
            action={
              <Link href="/news/" className="btn btn-outline h-10">
                All news
                <ArrowRight size={15} aria-hidden />
              </Link>
            }
          />
          <RevealGroup className="mt-9 grid gap-4 sm:grid-cols-3">
            {latestNews(3).map((n) => (
              <RevealChild key={n.slug}>
                <NewsCard item={n} />
              </RevealChild>
            ))}
          </RevealGroup>
        </div>
      </Section>
    </>
  );
}
