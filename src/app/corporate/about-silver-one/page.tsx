import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Compass, Layers } from 'lucide-react';
import { PageHero, RichText, Section, SectionHeading, breadcrumbSchema } from '@/components/ui';
import { CtaBand, FeatureRow, IconPoints, StatementBand } from '@/components/sections';
import { ProjectCard } from '@/components/cards';
import { RevealChild, RevealGroup, RevealOnScroll } from '@/components/Reveal';
import { pages, projects, team } from '@/lib/content';
import { SITE } from '@/lib/site';

const CRUMBS = [
  { label: 'Corporate', href: '/corporate/about-silver-one/' },
  { label: 'About Silver One' },
];

export const metadata: Metadata = {
  title: 'About Silver One',
  description:
    'Silver One Resources Inc. is focused on the exploration and development of quality silver projects, with a 100% interest in the past-producing Candelaria Mine in Nevada, the Cherokee project in Nevada and the Phoenix Silver project in Arizona.',
  alternates: { canonical: '/corporate/about-silver-one/' },
};

/**
 * Both points below are drawn from the Company's own About copy and project
 * pages — nothing here is a composed mission statement.
 */
const POINTS = [
  {
    title: 'Our Focus',
    body: 'Silver One is focused on the exploration and development of quality silver projects — advancing a past-producing mine toward development while testing district-scale exploration ground.',
    icon: Compass,
  },
  {
    title: 'Our Portfolio',
    body: 'Three properties across two American mining states: the past-producing Candelaria Mine and the Cherokee silver-copper-gold system in Nevada, and the high-grade Phoenix Silver prospect in Arizona.',
    icon: Layers,
  },
];

export default function AboutPage() {
  const page = pages.about;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(CRUMBS, SITE.url)) }}
      />

      <PageHero
        title="A Focused Silver Explorer"
        eyebrow="About Silver One"
        intro="Advancing high-potential silver projects in the United States through disciplined exploration, technical expertise and long-term value creation."
        image="/assets/derived/corporate-banner.jpg"
        imageAlt=""
        crumbs={CRUMBS}
      />

      {/* ------------------------------------------------- focus + portfolio */}
      <Section tone="warm" className="py-12 lg:py-16">
        <div className="shell">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <IconPoints points={POINTS} />

            <RevealOnScroll delay={0.08} y={22}>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-[var(--color-stone)]">
                  <Image
                    src="/assets/files/1091/dsc00124-edited.jpg"
                    alt="A Silver One geologist examining outcrop on the Candelaria property in Nevada"
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-2.5 text-[0.6875rem] text-[var(--color-slate)]">
                  Fieldwork on the Candelaria property, Nevada.
                </figcaption>
              </figure>
            </RevealOnScroll>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ company copy */}
      <Section tone="white" className="py-12 lg:py-16">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <RevealOnScroll>
              <p className="eyebrow text-[0.625rem]">The Company</p>
              <h2 className="mt-3 font-serif text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.1]">
                Quality silver assets in premier jurisdictions
              </h2>
              <RichText html={page.html} className="mt-6 text-[0.9375rem]" />
            </RevealOnScroll>
          </div>

          <aside className="lg:col-span-5">
            <RevealOnScroll delay={0.08} className="lg:sticky lg:top-24">
              <div className="card p-6">
                <h3 className="font-serif text-xl">Leadership</h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-[var(--color-slate)]">
                  Silver One is led by {team.management.length} executives and advisors and
                  overseen by a board of {team.directors.length} directors.
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link href="/corporate/management/" className="btn btn-outline h-10">
                    Management
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                  <Link href="/corporate/directors/" className="btn btn-outline h-10">
                    Directors
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                </div>
              </div>

              <div className="card mt-5 bg-[var(--color-teal-50)] p-6">
                <h3 className="font-serif text-xl">Listed on three exchanges</h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-[var(--color-slate)]">
                  TSX-V: SVE · OTCQX: SLVRF · FSE: BRK1
                </p>
                <Link href="/investors/" className="btn btn-primary mt-5 h-10">
                  Investor Information
                  <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
            </RevealOnScroll>
          </aside>
        </div>
      </Section>

      {/* ----------------------------------------------------- why silver -- */}
      <Section tone="warm" className="py-12 lg:py-16">
        <div className="shell">
          <FeatureRow
            eyebrow="Why Silver?"
            title="The indispensable metal"
            image="/assets/files/2478/2023-03-02-sve-nrp2.jpg"
            imageAlt="Vein fragment containing abundant visible native silver from the Phoenix Silver Project, Arizona"
            caption="459,000 g/t (14,688 oz/ton) vein fragment containing abundant visible native silver. Selected sample, not necessarily representative of mineralisation hosted on the property."
            action={
              <Link href="/investors/why-silver/" className="btn btn-outline h-10">
                Learn More About Silver
                <ArrowRight size={14} aria-hidden />
              </Link>
            }
          >
            <p className="mt-5 text-[0.9375rem] leading-[1.68] text-[var(--color-slate)]">
              Silver is a precious metal, and like gold, it has intrinsic value. It is widely
              perceived to be both a commodity and a form of money, and has been used as a medium
              of exchange for thousands of years.
            </p>
            <p className="mt-4 text-[0.9375rem] leading-[1.68] text-[var(--color-slate)]">
              Today silver&rsquo;s primary use is industrial — from cell phones to solar panels —
              and new innovations continue to emerge that take advantage of its unique properties:
              the best thermal and electrical conductivity of all metals, resistance to corrosion,
              and antimicrobial, non-toxic qualities.
            </p>
          </FeatureRow>
        </div>
      </Section>

      {/* -------------------------------------------------------- portfolio */}
      <Section tone="white" className="py-12 lg:py-16">
        <div className="shell">
          <SectionHeading
            eyebrow="Portfolio"
            title="Our Projects"
            intro="Three properties across Nevada and Arizona, United States."
            action={
              <Link href="/projects/usa-projects/" className="btn btn-outline h-10">
                All Projects
                <ArrowRight size={15} aria-hidden />
              </Link>
            }
          />
          <RevealGroup className="mt-9 grid gap-4 sm:grid-cols-3">
            {projects.map((p) => (
              <RevealChild key={p.slug}>
                <ProjectCard project={p} />
              </RevealChild>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ---------------------------------------------- reclamation record -- */}
      <StatementBand eyebrow="Our Record" title="Reclamation and stewardship">
        <p>
          Reclamation of the Candelaria Mine has been ongoing since 1998. The mine dumps were
          re-contoured and seeded, and the heap leach piles were rinsed with fresh water and
          seeded. Other infrastructure has been removed, and the substantial reclamation work
          meets all state and federal guidelines.
        </p>
        <p>
          <small>{SITE.qualifiedPerson}</small>
        </p>
      </StatementBand>

      <CtaBand
        image="/assets/files/2213/drone_shot.png"
        imageAlt="Aerial view of the Candelaria Project, Nevada"
        eyebrow="Flagship Asset"
        title="Candelaria, Nevada"
        body="A past-producing silver mine with a current mineral resource estimate, advancing toward a Pre-Feasibility Study."
        href="/projects/usa-projects/candelaria/"
        action="Explore Candelaria"
      />
    </>
  );
}

