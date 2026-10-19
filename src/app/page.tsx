import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  Compass,
  FileText,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { HomeHero } from '@/components/HomeHero';
import { ResourceMetrics } from '@/components/ResourceMetrics';
import { FeaturedVideoInvestors } from '@/components/FeaturedVideoInvestors';
import { HomeNewsCard, ProjectCard } from '@/components/cards';
import { RevealChild, RevealGroup, RevealOnScroll } from '@/components/Reveal';
import { NewsletterBand } from '@/components/NewsletterBand';
import { home, latestNews, projects } from '@/lib/content';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Silver One Resources Inc. | Silver Exploration & Development',
  description: SITE.description,
  alternates: { canonical: '/' },
};

/** Small uppercase section label with the gold rule, as used across the page. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow text-[0.625rem]">{children}</p>;
}

export default function HomePage() {
  const heroImage =
    home.slides.find((s) => s.includes('home-pg-sunset')) ?? home.slides[0];
  const recent = latestNews(3);
  const aboutImage = home.features.find((f) => f.id === 'feature-0')?.bg;

  return (
    <>
      <HomeHero
        image={heroImage}
        alt="Sunset over Silver One drilling at the Candelaria Project, with the Nevada range behind"
      />

      <ResourceMetrics />

      {/* --------------------------------------------------- About Section */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-24">
        {/* Subtle background ambient accents */}
        <div
          className="pointer-events-none absolute -left-48 top-1/4 h-96 w-96 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.06),transparent_70%)] blur-3xl"
          aria-hidden
        />

        <div className="shell relative">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left 7 cols: Editorial narrative & strategic pillars */}
            <div className="lg:col-span-7">
              <RevealOnScroll>
                <Eyebrow>About Silver One Resources</Eyebrow>
                <h2 className="mt-3 font-serif text-[clamp(1.85rem,3.2vw,2.75rem)] leading-[1.08] tracking-[-0.015em] text-[var(--color-ink)]">
                  Pioneering Silver Exploration in Tier-1 American Jurisdictions
                </h2>
                <p className="mt-5 text-[0.9375rem] leading-[1.68] text-[var(--color-slate)]">
                  Silver One Resources Inc. (TSX-V: SVE, OTCQX: SLVRF) is focused on advancing
                  quality silver assets in premier mining jurisdictions. The Company owns a 100%
                  interest in its flagship past-producing <strong className="font-semibold text-[var(--color-ink)]">Candelaria Mine</strong> in
                  Nevada, alongside the multi-kilometre <strong className="font-semibold text-[var(--color-ink)]">Cherokee</strong> vein system in
                  Lincoln County and the high-grade <strong className="font-semibold text-[var(--color-ink)]">Phoenix Silver</strong> project in Arizona.
                </p>
                <p className="mt-3.5 text-[0.9375rem] leading-[1.68] text-[var(--color-slate)]">
                  With substantial NI 43-101 compliant resources and near-term production potential
                  from historic heap-leach pads, Silver One combines tangible asset scale with
                  high-impact exploration upside.
                </p>

                {/* 3 Strategic Value Pillars */}
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="group rounded-[3px] border border-[var(--color-stone)] bg-[var(--color-warm)] p-4 transition-all duration-300 hover:border-[var(--color-gold)]/40 hover:bg-white hover:shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--color-teal-900)] shadow-xs transition-colors group-hover:bg-[var(--color-teal-900)] group-hover:text-[var(--color-gold-soft)]">
                      <ShieldCheck size={16} strokeWidth={1.75} aria-hidden />
                    </div>
                    <h3 className="mt-3 font-sans text-[0.8125rem] font-bold uppercase tracking-wider text-[var(--color-ink)]">
                      Tier-1 Stability
                    </h3>
                    <p className="mt-1 text-[0.75rem] leading-relaxed text-[var(--color-slate)]">
                      100% USA assets in Nevada & Arizona — the world’s top mining jurisdictions.
                    </p>
                  </div>

                  <div className="group rounded-[3px] border border-[var(--color-stone)] bg-[var(--color-warm)] p-4 transition-all duration-300 hover:border-[var(--color-gold)]/40 hover:bg-white hover:shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--color-teal-900)] shadow-xs transition-colors group-hover:bg-[var(--color-teal-900)] group-hover:text-[var(--color-gold-soft)]">
                      <Layers size={16} strokeWidth={1.75} aria-hidden />
                    </div>
                    <h3 className="mt-3 font-sans text-[0.8125rem] font-bold uppercase tracking-wider text-[var(--color-ink)]">
                      100% Flagship
                    </h3>
                    <p className="mt-1 text-[0.75rem] leading-relaxed text-[var(--color-slate)]">
                      Past-producing Candelaria mine with 126.6 Moz AgEq M+I resources.
                    </p>
                  </div>

                  <div className="group rounded-[3px] border border-[var(--color-stone)] bg-[var(--color-warm)] p-4 transition-all duration-300 hover:border-[var(--color-gold)]/40 hover:bg-white hover:shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--color-teal-900)] shadow-xs transition-colors group-hover:bg-[var(--color-teal-900)] group-hover:text-[var(--color-gold-soft)]">
                      <TrendingUp size={16} strokeWidth={1.75} aria-hidden />
                    </div>
                    <h3 className="mt-3 font-sans text-[0.8125rem] font-bold uppercase tracking-wider text-[var(--color-ink)]">
                      Discovery Upside
                    </h3>
                    <p className="mt-1 text-[0.75rem] leading-relaxed text-[var(--color-slate)]">
                      High-grade native silver in Arizona & 11 km vein strike at Cherokee.
                    </p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href="/corporate/about-silver-one/" className="btn btn-primary">
                    Learn About Silver One
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                  <Link
                    href="/corporate/management/"
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-[0.8125rem] font-semibold text-[var(--color-teal-900)] transition-colors hover:text-[var(--color-teal-700)]"
                  >
                    <span>Meet Our Leadership</span>
                    <ArrowRight size={13} aria-hidden />
                  </Link>
                </div>
              </RevealOnScroll>
            </div>

            {/* Right 5 cols: High-impact layered imagery & corporate proof badge */}
            <div className="lg:col-span-5">
              <RevealOnScroll delay={0.08} y={24}>
                <div className="relative">
                  {/* Decorative background border frame */}
                  <div
                    className="pointer-events-none absolute -bottom-3 -right-3 h-full w-full rounded-[4px] border border-[var(--color-gold)]/30"
                    aria-hidden
                  />

                  {/* Main field photo */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-[var(--color-stone)] shadow-[0_24px_60px_-15px_rgba(16,42,58,0.25)] sm:aspect-[16/11]">
                    {aboutImage && (
                      <Image
                        src={aboutImage}
                        alt="Silver One geologists conducting fieldwork and structural sampling on the Candelaria property in Nevada"
                        fill
                        sizes="(min-width: 1024px) 38vw, 100vw"
                        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04]"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-deep)]/40 via-transparent to-transparent" aria-hidden />
                  </div>

                  {/* Floating corporate badge */}
                  <div className="absolute -bottom-6 -left-4 max-w-[280px] rounded-[3px] border border-[var(--color-gold)]/40 bg-[var(--color-navy)]/95 p-4 text-white shadow-xl backdrop-blur-md sm:-left-6 sm:max-w-[300px]">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-gold)]/20 text-[var(--color-gold-soft)]">
                        <Sparkles size={13} aria-hidden />
                      </span>
                      <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[var(--color-gold-soft)]">
                        Flagship Operation
                      </span>
                    </div>
                    <p className="mt-1.5 font-serif text-[1.05rem] leading-tight text-white">
                      Candelaria Mine, Nevada
                    </p>
                    <p className="mt-1 text-[0.6875rem] leading-relaxed text-white/70">
                      Historically Nevada’s richest open-pit silver producer. 100% owned & permitted for exploration.
                    </p>
                  </div>
                </div>

                <p className="mt-9 text-right text-[0.6875rem] italic text-[var(--color-slate)]/80 sm:mt-8">
                  Active exploration and structural outcrop mapping at Candelaria, Nevada.
                </p>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Our Projects Band */}
      <section className="bg-[var(--color-warm)] py-16 lg:py-24 border-t border-[var(--color-stone)]">
        <div className="shell">
          <RevealOnScroll>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow>Our Portfolio</Eyebrow>
                <h2 className="mt-2 font-serif text-[clamp(1.75rem,2.8vw,2.4rem)] leading-[1.08] text-[var(--color-ink)]">
                  Key Silver Exploration & Development Projects
                </h2>
                <p className="mt-2 max-w-2xl text-[0.875rem] leading-relaxed text-[var(--color-slate)]">
                  Three high-caliber assets strategically located in mining-friendly American jurisdictions with proven infrastructure and substantial exploration upside.
                </p>
              </div>
              <Link
                href="/projects/usa-projects/"
                className="group inline-flex shrink-0 items-center gap-2 rounded-[3px] border border-[var(--color-teal-900)]/30 bg-white px-4 py-2 text-[0.75rem] font-semibold text-[var(--color-teal-900)] shadow-2xs transition-all hover:border-[var(--color-teal-900)] hover:bg-[var(--color-teal-900)] hover:text-white"
              >
                <span>View all projects</span>
                <ArrowRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </div>
          </RevealOnScroll>

          <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {projects.map((p) => (
              <RevealChild key={p.slug}>
                <ProjectCard project={p} />
              </RevealChild>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* --------------------------------------------- video + investor band */}
      {home.videoId && (
        <FeaturedVideoInvestors
          videoId={home.videoId}
          poster="/assets/files/2216/dji_0630.jpg"
          posterAlt="Aerial view of the Candelaria open pit and haul roads, central-west Nevada"
          videoTitle="Made In America | Silver One Resources (TSXV:SVE) — Visiting the Candelaria Project"
          videoMeta="Silver One Resources — Visiting the Candelaria Project"
        />
      )}

      {/* ------------------------------------------------------- latest news */}
      <section className="bg-[var(--color-warm)] py-14 lg:py-20 border-t border-[var(--color-stone)]">
        <div className="shell grid gap-8 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-14">
          <RevealOnScroll>
            <Eyebrow>Latest News</Eyebrow>
            <h2 className="mt-3 font-serif text-[clamp(1.6rem,2.2vw,2rem)] leading-[1.08] text-[var(--color-ink)]">
              Recent
              <br />
              News Releases
            </h2>
            <p className="mt-3 text-[0.8125rem] leading-[1.6] text-[var(--color-slate)]">
              Stay informed with the latest announcements, drill results, and corporate news from Silver One Resources.
            </p>
            <Link href="/news/" className="btn btn-outline mt-6">
              View All News
              <ArrowRight size={14} aria-hidden />
            </Link>
          </RevealOnScroll>

          <RevealGroup className="grid gap-4 sm:grid-cols-3" stagger={0.07}>
            {recent.map((n) => (
              <RevealChild key={`${n.year}-${n.slug}`}>
                <HomeNewsCard item={n} />
              </RevealChild>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* -------------------------------------------------- newsletter band */}
      <NewsletterBand />
    </>
  );
}
