'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  Landmark,
  MapPin,
  PieChart,
  Play,
  Presentation,
  Scale,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { VideoModal, type VideoModalSource } from '@/components/VideoModal';

/** Low-contrast contour decoration behind the investor panel. */
function TopoLines() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full text-[var(--color-gold)] opacity-[0.05]"
      preserveAspectRatio="none"
      viewBox="0 0 760 520"
    >
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const o = i * 26;
        return (
          <path
            key={i}
            d={`M-20 ${430 - o * 0.9} C 120 ${392 - o * 0.85}, 250 ${470 - o} , 400 ${412 - o * 0.9} S 640 ${338 - o * 0.78}, 780 ${398 - o * 0.9}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
}

export function FeaturedVideoInvestors({
  videoId,
  poster,
  posterAlt,
  videoTitle,
  videoMeta,
}: {
  videoId: string;
  poster: string;
  posterAlt: string;
  videoTitle: string;
  videoMeta: string;
}) {
  const [open, setOpen] = useState<VideoModalSource | null>(null);
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-12% 0px' },
          transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <>
      <section
        aria-labelledby="investor-resources-heading"
        className="grid lg:min-h-[640px] lg:grid-cols-[44fr_56fr] border-y border-[var(--color-stone)]"
      >
        {/* ------------------------------------------------- Featured Video */}
        <div className="relative isolate min-h-[26rem] overflow-hidden bg-[var(--color-navy-deep)] sm:min-h-[30rem] lg:min-h-0">
          <motion.div
            {...(reduce
              ? {}
              : {
                  initial: { scale: 1.05, opacity: 0.5 },
                  whileInView: { scale: 1, opacity: 1 },
                  viewport: { once: true, margin: '-10% 0px' },
                  transition: { duration: 1.3, ease: [0.22, 1, 0.36, 1] as const },
                })}
            className="absolute inset-0"
          >
            <Image
              src={poster}
              alt={posterAlt}
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover object-[62%_46%]"
            />
          </motion.div>

          <div className="absolute inset-0 scrim" aria-hidden />

          {/* Ambient subtle radial glow */}
          <div
            className="pointer-events-none absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.15),transparent_70%)] blur-2xl"
            aria-hidden
          />

          <div className="relative flex h-full flex-col justify-between p-8 sm:p-10 lg:p-14 xl:p-16">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow text-[0.625rem] text-[var(--color-gold-soft)]">
                  Site Tour Video
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[0.625rem] font-medium text-white/90 backdrop-blur-xs">
                  <MapPin size={10} className="text-[var(--color-gold-soft)]" aria-hidden />
                  Candelaria, Nevada
                </span>
              </div>

              <motion.h2
                {...rise(0.14)}
                className="mt-5 max-w-md font-serif text-[clamp(2.2rem,3.6vw,3.2rem)] leading-[1.04] tracking-[-0.018em] text-white"
              >
                Inside the Candelaria Project
              </motion.h2>

              <motion.p
                {...rise(0.22)}
                className="mt-4 max-w-sm text-[0.9375rem] leading-[1.62] text-white/80"
              >
                Experience an aerial and on-ground exploration tour of the past-producing Candelaria mine, examining historic heap-leach pads and active drill targets.
              </motion.p>
            </div>

            {/* Play button trigger */}
            <motion.div {...rise(0.3)} className="mt-10 pt-4">
              <button
                type="button"
                onClick={() =>
                  setOpen({
                    provider: 'youtube',
                    id: videoId,
                    title: videoTitle,
                    meta: videoMeta,
                    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
                  })
                }
                className="group inline-flex items-center gap-5 text-left transition-transform duration-300 hover:translate-x-1"
              >
                <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white shadow-[0_12px_36px_-8px_rgba(0,0,0,0.6)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08] group-hover:bg-[var(--color-gold-soft)]">
                  {/* Subtle pulsing halo */}
                  <span className="absolute inset-0 animate-[ping_3s_ease-in-out_infinite] rounded-full bg-white/25" />
                  <Play
                    size={22}
                    className="translate-x-[2px] fill-[var(--color-navy)] text-[var(--color-navy)] transition-colors group-hover:fill-[var(--color-navy-deep)] group-hover:text-[var(--color-navy-deep)]"
                    aria-hidden
                  />
                </span>
                <div>
                  <span className="text-[1rem] font-semibold text-white group-hover:text-[var(--color-gold-soft)] transition-colors">
                    Watch Feature Video
                  </span>
                  <span className="sr-only"> — {videoTitle}</span>
                  <div className="mt-1 flex items-center gap-2 text-xs text-white/65">
                    <span>3 min</span>
                    <span>·</span>
                    <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-[var(--color-gold-soft)]">
                      1080p HD
                    </span>
                  </div>
                </div>
              </button>
            </motion.div>
          </div>
        </div>

        {/* --------------------------------------------- Investor Resources */}
        <div className="relative isolate overflow-hidden bg-[var(--color-warm)] px-6 py-12 sm:px-10 lg:flex lg:flex-col lg:justify-center lg:px-12 lg:py-16 xl:px-14">
          <TopoLines />

          {/* Subtle warm glow on corner */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.08),transparent_70%)] blur-2xl"
            aria-hidden
          />

          <div className="relative">
            {/* Header + Overview */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <motion.div {...rise(0.05)}>
                  <p className="eyebrow text-[0.625rem]">Investor Information</p>
                  <h2
                    id="investor-resources-heading"
                    className="mt-2 font-serif text-[clamp(1.75rem,2.5vw,2.3rem)] leading-[1.08] text-[var(--color-ink)]"
                  >
                    Key Resources for Investors
                  </h2>
                </motion.div>
                <motion.p
                  {...rise(0.1)}
                  className="mt-2 max-w-lg text-[0.875rem] leading-[1.62] text-[var(--color-slate)]"
                >
                  Essential corporate materials, presentations, share capital breakdown, and regulatory filings for current and prospective shareholders.
                </motion.p>
              </div>

              <motion.div {...rise(0.15)} className="shrink-0">
                <Link
                  href="/investors/"
                  className="inline-flex items-center gap-1.5 rounded-[3px] border border-[var(--color-stone-hard)] bg-white px-4 py-2.5 text-[0.8125rem] font-semibold text-[var(--color-teal-900)] shadow-2xs transition-all hover:border-[var(--color-teal-900)] hover:bg-[var(--color-teal-900)] hover:text-white"
                >
                  <span>All Investor Materials</span>
                  <ArrowRight size={14} aria-hidden />
                </Link>
              </motion.div>
            </div>

            {/* Quick Listing Ticker Strip */}
            <motion.div
              {...rise(0.18)}
              className="mt-6 flex flex-wrap items-center gap-2 border-y border-[var(--color-stone)] py-3 text-[0.75rem]"
            >
              <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-[var(--color-slate)]">
                Listings:
              </span>
              <a
                href="https://money.tmx.com/en/quote/SVE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-[2px] bg-white px-2 py-1 font-mono font-semibold text-[var(--color-teal-900)] shadow-2xs transition-colors hover:bg-[var(--color-stone)]"
              >
                <span>TSX-V:</span>
                <span className="font-bold text-[var(--color-ink)]">SVE</span>
                <ArrowUpRight size={11} className="text-[var(--color-slate)]" aria-hidden />
              </a>
              <a
                href="https://www.otcmarkets.com/stock/SLVRF/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-[2px] bg-white px-2 py-1 font-mono font-semibold text-[var(--color-teal-900)] shadow-2xs transition-colors hover:bg-[var(--color-stone)]"
              >
                <span>OTCQX:</span>
                <span className="font-bold text-[var(--color-ink)]">SLVRF</span>
                <ArrowUpRight size={11} className="text-[var(--color-slate)]" aria-hidden />
              </a>
              <a
                href="https://www.boerse-frankfurt.de/equity/CA8280621092"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-[2px] bg-white px-2 py-1 font-mono font-semibold text-[var(--color-teal-900)] shadow-2xs transition-colors hover:bg-[var(--color-stone)]"
              >
                <span>FSE:</span>
                <span className="font-bold text-[var(--color-ink)]">BRK1</span>
                <ArrowUpRight size={11} className="text-[var(--color-slate)]" aria-hidden />
              </a>
            </motion.div>

            {/* Featured Highlight Cards: 2 Prominent primary cards */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                href="/investors/presentations/"
                className="group relative flex flex-col justify-between overflow-hidden rounded-[3px] border border-[var(--color-gold)]/40 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-gold)] hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold-text)] transition-colors group-hover:bg-[var(--color-gold)] group-hover:text-white">
                    <Presentation size={18} strokeWidth={1.6} aria-hidden />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-gold)]/15 px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-[var(--color-gold-text)]">
                    <Sparkles size={10} aria-hidden />
                    Key Deck
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="font-serif text-[1.1rem] leading-tight text-[var(--color-ink)] group-hover:text-[var(--color-teal-900)] transition-colors">
                    Corporate Presentation
                  </h3>
                  <p className="mt-1.5 text-[0.78125rem] leading-relaxed text-[var(--color-slate)]">
                    Comprehensive asset reviews, NI 43-101 resource breakdown, drill assays & catalysts.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[0.75rem] font-semibold text-[var(--color-gold-text)] group-hover:text-[var(--color-teal-900)]">
                  <span>View presentation</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" aria-hidden />
                </div>
              </Link>

              <Link
                href="/investors/factsheets/"
                className="group relative flex flex-col justify-between overflow-hidden rounded-[3px] border border-[var(--color-gold)]/40 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-gold)] hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold-text)] transition-colors group-hover:bg-[var(--color-gold)] group-hover:text-white">
                    <FileText size={18} strokeWidth={1.6} aria-hidden />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-stone-hard)]/40 px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-[var(--color-slate)]">
                    One-Pager
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="font-serif text-[1.1rem] leading-tight text-[var(--color-ink)] group-hover:text-[var(--color-teal-900)] transition-colors">
                    Corporate Factsheet
                  </h3>
                  <p className="mt-1.5 text-[0.78125rem] leading-relaxed text-[var(--color-slate)]">
                    Executive summary of projects, capital structure, resource stats, and key milestones.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[0.75rem] font-semibold text-[var(--color-gold-text)] group-hover:text-[var(--color-teal-900)]">
                  <span>View factsheet</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" aria-hidden />
                </div>
              </Link>
            </div>

            {/* 4 Core Resource Cards */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Link
                href="/investors/overview/"
                className="group flex flex-col justify-between rounded-[3px] border border-[var(--color-stone)] bg-white/90 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-teal-900)]/40 hover:bg-white hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-warm)] text-[var(--color-teal-900)] transition-colors group-hover:bg-[var(--color-teal-900)] group-hover:text-white">
                    <BarChart3 size={15} strokeWidth={1.6} aria-hidden />
                  </div>
                  <ArrowRight size={12} className="text-[var(--color-slate)] opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                </div>
                <div className="mt-3">
                  <span className="block text-[0.8125rem] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-teal-900)] transition-colors">
                    Stock Charts
                  </span>
                  <span className="mt-0.5 block text-[0.6875rem] leading-snug text-[var(--color-slate)]">
                    Live market data & quotes
                  </span>
                </div>
              </Link>

              <Link
                href="/investors/share-structure/"
                className="group flex flex-col justify-between rounded-[3px] border border-[var(--color-stone)] bg-white/90 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-teal-900)]/40 hover:bg-white hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-warm)] text-[var(--color-teal-900)] transition-colors group-hover:bg-[var(--color-teal-900)] group-hover:text-white">
                    <PieChart size={15} strokeWidth={1.6} aria-hidden />
                  </div>
                  <ArrowRight size={12} className="text-[var(--color-slate)] opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                </div>
                <div className="mt-3">
                  <span className="block text-[0.8125rem] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-teal-900)] transition-colors">
                    Share Structure
                  </span>
                  <span className="mt-0.5 block text-[0.6875rem] leading-snug text-[var(--color-slate)]">
                    Capital & warrants breakdown
                  </span>
                </div>
              </Link>

              <Link
                href="/corporate/financials-statements/"
                className="group flex flex-col justify-between rounded-[3px] border border-[var(--color-stone)] bg-white/90 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-teal-900)]/40 hover:bg-white hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-warm)] text-[var(--color-teal-900)] transition-colors group-hover:bg-[var(--color-teal-900)] group-hover:text-white">
                    <FileSpreadsheet size={15} strokeWidth={1.6} aria-hidden />
                  </div>
                  <ArrowRight size={12} className="text-[var(--color-slate)] opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                </div>
                <div className="mt-3">
                  <span className="block text-[0.8125rem] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-teal-900)] transition-colors">
                    Financials
                  </span>
                  <span className="mt-0.5 block text-[0.6875rem] leading-snug text-[var(--color-slate)]">
                    Audited statements & MD&A
                  </span>
                </div>
              </Link>

              <Link
                href="/investors/agm-material/"
                className="group flex flex-col justify-between rounded-[3px] border border-[var(--color-stone)] bg-white/90 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-teal-900)]/40 hover:bg-white hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-warm)] text-[var(--color-teal-900)] transition-colors group-hover:bg-[var(--color-teal-900)] group-hover:text-white">
                    <Landmark size={15} strokeWidth={1.6} aria-hidden />
                  </div>
                  <ArrowRight size={12} className="text-[var(--color-slate)] opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                </div>
                <div className="mt-3">
                  <span className="block text-[0.8125rem] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-teal-900)] transition-colors">
                    AGM Materials
                  </span>
                  <span className="mt-0.5 block text-[0.6875rem] leading-snug text-[var(--color-slate)]">
                    Circulars & proxy notices
                  </span>
                </div>
              </Link>
            </div>

            {/* Secondary Links Footer */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[0.75rem] text-[var(--color-slate)]">
              <span className="text-[0.6875rem] font-medium">Additional Investor Filings:</span>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/investors/interviews/"
                  className="font-medium text-[var(--color-teal-900)] underline decoration-[var(--color-stone-hard)] underline-offset-4 hover:decoration-[var(--color-teal-900)] transition-colors"
                >
                  Executive Interviews
                </Link>
                <span>·</span>
                <Link
                  href="/investors/why-silver/"
                  className="font-medium text-[var(--color-teal-900)] underline decoration-[var(--color-stone-hard)] underline-offset-4 hover:decoration-[var(--color-teal-900)] transition-colors"
                >
                  Why Silver?
                </Link>
                <span>·</span>
                <Link
                  href="/investors/estma_reports-2/"
                  className="font-medium text-[var(--color-teal-900)] underline decoration-[var(--color-stone-hard)] underline-offset-4 hover:decoration-[var(--color-teal-900)] transition-colors"
                >
                  ESTMA Reports
                </Link>
                <span>·</span>
                <Link
                  href="/investors/life/"
                  className="font-medium text-[var(--color-teal-900)] underline decoration-[var(--color-stone-hard)] underline-offset-4 hover:decoration-[var(--color-teal-900)] transition-colors"
                >
                  LIFE Filings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VideoModal source={open} onClose={() => setOpen(null)} />
    </>
  );
}
