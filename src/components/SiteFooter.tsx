'use client';

import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUpRight, 
  FileText, 
  TrendingUp, 
  Newspaper, 
  ShieldCheck, 
  BellRing,
  ExternalLink,
  Layers
} from 'lucide-react';
import { CONTACT, FOOTER_LEGAL, LISTINGS, NAV, SITE } from '@/lib/site';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { SocialLinks } from '@/components/SocialLinks';

const BUILD_YEAR = new Date().getFullYear();

const PROJECT_BADGES: Record<string, { badge: string; color: string }> = {
  '/projects/usa-projects/candelaria/': { badge: 'Flagship • NV', color: 'bg-[var(--color-gold)]/20 text-[var(--color-gold-soft)] border-[var(--color-gold)]/30' },
  '/projects/usa-projects/cherokee/': { badge: 'Exploration • NV', color: 'bg-[var(--color-teal-500)]/20 text-teal-200 border-[var(--color-teal-500)]/30' },
  '/projects/usa-projects/silver_phoenix/': { badge: 'High Grade • AZ', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
};

export function SiteFooter() {
  const year = BUILD_YEAR;

  const corporateGroup = NAV.find((g) => g.label === 'Corporate');
  const projectsGroup = NAV.find((g) => g.label === 'Projects');
  const investorsGroup = NAV.find((g) => g.label === 'Investors');


  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#0e212d] via-[#09151e] to-[#050b10] text-white/80">
      {/* Decorative luminous top border with center jewel */}
      <div className="relative w-full">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--color-gold)]/70 to-transparent" />
        <div className="absolute top-1/2 left-1/2 h-1.5 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-gold)] blur-[2px]" />
      </div>

      {/* Background ambient lighting glows */}
      <div 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-[var(--color-teal-700)]/10 blur-[120px]" 
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none absolute bottom-10 right-0 h-80 w-80 rounded-full bg-[var(--color-gold)]/5 blur-[100px]" 
        aria-hidden="true" 
      />

      <div className="shell relative z-10 pt-12 pb-14 lg:pt-16 lg:pb-16">
        
        {/* ===================================================================
            TOP TIER: Elevated Investor & Newsletter Hub Card
           =================================================================== */}
        <div className="relative mb-14 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          {/* Subtle gradient sheen inside the card */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--color-teal-900)]/20 via-transparent to-[var(--color-gold)]/10 opacity-70" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
            {/* Left: Newsletter Subscription */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">
                <BellRing size={12} className="text-[var(--color-gold)] animate-pulse" />
                Investor Updates & Alerts
              </div>
              <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Stay informed on project developments
              </h2>
              <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-white/65">
                Subscribe to receive verified Silver One news releases, drill intercepts, and regulatory announcements directly in your inbox.
              </p>
              <div className="mt-5 max-w-lg">
                <NewsletterSignup variant="dark" compact />
              </div>
            </div>

            {/* Right: Fast Investor Dispatch Cards */}
            <div className="grid gap-3 sm:grid-cols-3 lg:col-span-5">
              <Link
                href="/investors/presentations/"
                className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-gold)]/50 hover:bg-white/[0.07] hover:shadow-lg"
              >
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold)]/15 text-[var(--color-gold-soft)] group-hover:bg-[var(--color-gold)] group-hover:text-[#0b151f] transition-colors">
                    <FileText size={18} />
                  </div>
                  <h3 className="mt-3 text-xs font-bold uppercase tracking-wider text-white">Presentation</h3>
                  <p className="mt-1 text-[0.8125rem] text-white/60">Corporate slide deck</p>
                </div>
                <div className="mt-3 flex items-center text-xs font-semibold text-[var(--color-gold-soft)] group-hover:text-white">
                  <span>View Deck</span>
                  <ArrowUpRight size={14} className="ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>

              <Link
                href="/investors/factsheets/"
                className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-teal-500)]/50 hover:bg-white/[0.07] hover:shadow-lg"
              >
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-teal-700)]/20 text-teal-300 group-hover:bg-[var(--color-teal-500)] group-hover:text-[#0b151f] transition-colors">
                    <TrendingUp size={18} />
                  </div>
                  <h3 className="mt-3 text-xs font-bold uppercase tracking-wider text-white">Factsheet</h3>
                  <p className="mt-1 text-[0.8125rem] text-white/60">Summary & metrics</p>
                </div>
                <div className="mt-3 flex items-center text-xs font-semibold text-teal-300 group-hover:text-white">
                  <span>Download</span>
                  <ArrowUpRight size={14} className="ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>

              <Link
                href="/news/"
                className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.07] hover:shadow-lg"
              >
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white group-hover:bg-white group-hover:text-[#0b151f] transition-colors">
                    <Newspaper size={18} />
                  </div>
                  <h3 className="mt-3 text-xs font-bold uppercase tracking-wider text-white">News Releases</h3>
                  <p className="mt-1 text-[0.8125rem] text-white/60">Latest announcements</p>
                </div>
                <div className="mt-3 flex items-center text-xs font-semibold text-white/80 group-hover:text-white">
                  <span>Archive</span>
                  <ArrowUpRight size={14} className="ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* ===================================================================
            MIDDLE TIER: Main Navigation & Company Info Grid
           =================================================================== */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Identity, Market Tickers, and Direct Office Contact */}
          <div className="lg:col-span-4 lg:pr-4">
            <Link href="/" aria-label="Silver One Resources Inc. — home" className="inline-block transition-transform hover:opacity-95">
              <Image
                src="/brand/logo.png"
                alt="Silver One Resources Inc."
                width={220}
                height={58}
                className="h-10 w-auto object-contain brightness-105"
              />
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-white/65">
              {SITE.tagline} Advancing high-grade silver properties located in Nevada and Arizona, USA.
            </p>

            {/* Market Ticker Chips */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">
                  Live Exchange Listings
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {LISTINGS.map((l) => (
                  <a
                    key={l.symbol}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col justify-between rounded-lg border border-white/10 bg-white/[0.03] p-2.5 transition-all duration-200 hover:border-[var(--color-gold)]/40 hover:bg-white/[0.08]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-white/50 group-hover:text-white/80">
                        {l.exchange}
                      </span>
                      <ExternalLink size={10} className="text-white/30 group-hover:text-[var(--color-gold-soft)]" />
                    </div>
                    <span className="mt-1 text-sm font-bold tracking-tight text-white group-hover:text-[var(--color-gold-soft)]">
                      {l.symbol}
                    </span>
                    <span className="text-[0.625rem] text-white/40">{l.currency}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Office Contact details */}
            <address className="mt-7 space-y-3 text-sm not-italic border-t border-white/10 pt-6">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--color-gold)]/25 bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                  <MapPin size={13} aria-hidden />
                </span>
                <span className="text-xs leading-relaxed text-white/70">
                  <strong className="font-semibold text-white">{CONTACT.office.org}</strong>
                  <br />
                  {CONTACT.office.lines.join(', ')}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--color-gold)]/25 bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                  <Phone size={13} aria-hidden />
                </span>
                <a
                  href={CONTACT.office.telHref}
                  className="text-xs text-white/70 transition-colors hover:text-white"
                >
                  {CONTACT.office.tel}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--color-gold)]/25 bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                  <Mail size={13} aria-hidden />
                </span>
                <a
                  href={`mailto:${CONTACT.office.email}`}
                  className="text-xs text-white/70 transition-colors hover:text-white"
                >
                  {CONTACT.office.email}
                </a>
              </div>
            </address>
          </div>

          {/* Navigation Columns */}
          <nav aria-label="Footer Navigation" className="grid gap-8 sm:grid-cols-3 lg:col-span-8 lg:gap-6">
            
            {/* Corporate Column */}
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1 w-3 rounded-full bg-[var(--color-gold)]" />
                <h3 className="font-sans text-[0.75rem] font-bold uppercase tracking-[0.18em] text-[var(--color-gold-soft)]">
                  Corporate
                </h3>
              </div>
              <ul className="mt-5 space-y-2.5">
                {corporateGroup?.children?.slice(0, 8).map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      className="group flex items-center text-sm text-white/65 transition-all duration-150 hover:text-white hover:translate-x-1"
                    >
                      <span className="mr-1.5 text-[var(--color-gold)] opacity-0 transition-opacity group-hover:opacity-100">›</span>
                      <span>{c.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Projects Column */}
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1 w-3 rounded-full bg-[var(--color-teal-500)]" />
                <h3 className="font-sans text-[0.75rem] font-bold uppercase tracking-[0.18em] text-[var(--color-gold-soft)]">
                  USA Projects
                </h3>
              </div>
              <ul className="mt-5 space-y-3">
                {projectsGroup?.children?.map((c) => {
                  const badgeInfo = PROJECT_BADGES[c.href];
                  return (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        className="group flex flex-col text-sm text-white/65 transition-all duration-150 hover:text-white hover:translate-x-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex items-center">
                            <span className="mr-1.5 text-[var(--color-gold)] opacity-0 transition-opacity group-hover:opacity-100">›</span>
                            <span className="font-medium text-white/80 group-hover:text-white">{c.label}</span>
                          </span>
                          {badgeInfo && (
                            <span className={`inline-block rounded border px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase ${badgeInfo.color}`}>
                              {badgeInfo.badge}
                            </span>
                          )}
                        </div>
                        {c.description && (
                          <span className="text-xs text-white/45 pl-3.5 group-hover:text-white/60">
                            {c.description}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 pt-4 border-t border-white/10">
                <Link
                  href="/projects/usa-projects/"
                  className="inline-flex items-center text-xs font-semibold text-[var(--color-gold-soft)] transition-colors hover:text-white"
                >
                  <Layers size={13} className="mr-1.5 text-[var(--color-gold)]" />
                  All Properties Overview →
                </Link>
              </div>
            </div>

            {/* Investors Column */}
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1 w-3 rounded-full bg-emerald-400" />
                <h3 className="font-sans text-[0.75rem] font-bold uppercase tracking-[0.18em] text-[var(--color-gold-soft)]">
                  Investors
                </h3>
              </div>
              <ul className="mt-5 space-y-2.5">
                {investorsGroup?.children?.slice(0, 9).map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      className="group flex items-center text-sm text-white/65 transition-all duration-150 hover:text-white hover:translate-x-1"
                    >
                      <span className="mr-1.5 text-[var(--color-gold)] opacity-0 transition-opacity group-hover:opacity-100">›</span>
                      <span>{c.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </nav>
        </div>

        {/* ===================================================================
            REGULATORY / NI 43-101 VERIFICATION ACCREDITATION PANEL
           =================================================================== */}
        <div className="mt-12 rounded-xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-gold-soft)]">
            <ShieldCheck size={16} className="text-[var(--color-gold)]" />
            <span>Regulatory & NI 43-101 Technical Disclosure</span>
          </div>
          <div className="mt-2.5 grid gap-3 text-xs leading-relaxed text-white/50 lg:grid-cols-2">
            <p>{SITE.qualifiedPerson}</p>
            <p>{SITE.exchangeDisclaimer}</p>
          </div>
        </div>

        {/* ===================================================================
            BOTTOM BAR: Copyright, Legal Links, Socials & Back to Top
           =================================================================== */}
        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-7 md:flex-row md:items-center md:justify-between">
          
          {/* Copyright */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-white/50">
            <span>© {year} {SITE.name}. All rights reserved.</span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span>TSX-V: SVE | OTCQX: SLVRF | FSE: BRK1</span>
          </div>

          {/* Legal navigation */}
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            {FOOTER_LEGAL.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Socials */}
          <div className="flex items-center gap-4">
            <SocialLinks tone="dark" />
          </div>
        </div>

      </div>
    </footer>
  );
}
