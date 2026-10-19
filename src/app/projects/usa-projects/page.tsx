import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Check, FileText, Images, MapPin } from 'lucide-react';
import { PageHero, Section, breadcrumbSchema } from '@/components/ui';
import { LocatorMap } from '@/components/LocatorMap';
import { RevealChild, RevealGroup, RevealOnScroll } from '@/components/Reveal';
import { documents, projects } from '@/lib/content';
import { SITE } from '@/lib/site';

const CRUMBS = [{ label: 'Projects', href: '/projects/overview/' }, { label: 'USA Projects' }];

export const metadata: Metadata = {
  title: 'USA Projects',
  description:
    'Silver One Resources holds three silver projects in the United States: the past-producing Candelaria Mine and the Cherokee project in Nevada, and the Phoenix Silver project in Arizona.',
  alternates: { canonical: '/projects/usa-projects/' },
};

/**
 * Each point is sourced from the Company's own project pages, which are
 * quoted in the `note` so the claim can be checked.
 */
const LOCATION_POINTS = [
  {
    text: 'Tier-1 mining jurisdictions',
    note: 'Nevada and Arizona, United States.',
  },
  {
    text: 'Established infrastructure',
    note: 'Candelaria is serviced by paved road, power and water, just off Highway 95 between Las Vegas and Reno.',
  },
  {
    text: 'Proven mining districts',
    note: 'Candelaria lies in the historically richest silver district in Nevada; Cherokee sits 75 km south of the Pioche camp.',
  },
  {
    text: 'Proximity to major producers',
    note: 'Phoenix Silver lies immediately adjacent to the copper-producing area of Globe, Arizona, where BHP, Rio Tinto and Freeport-McMoRan all operate.',
  },
];

export default function UsaProjectsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(CRUMBS, SITE.url)) }}
      />

      <PageHero
        title="High-Quality Silver Assets"
        eyebrow="Our Projects"
        intro="A portfolio of exploration and development projects in Nevada and Arizona, United States."
        image={projects[0]?.banner}
        imageAlt=""
        crumbs={CRUMBS}
      />

      {/* --------------------------------------------------- project cards */}
      <Section tone="warm" className="py-12 lg:py-14">
        <div className="shell">
          <RevealGroup className="grid gap-5 md:grid-cols-3" stagger={0.08}>
            {projects.map((p, i) => {
              const galleryCount = p.tabs.reduce((n, t) => n + t.gallery.length, 0);
              const docCount = documents.technical.filter((d) => d.projectSlug === p.slug).length;

              return (
                <RevealChild key={p.slug}>
                  <article className="card card-hover group flex h-full flex-col overflow-hidden">
                    <Link href={p.href} className="relative block aspect-[4/3] overflow-hidden bg-[var(--color-navy)]">
                      {p.banner && (
                        <Image
                          src={p.banner}
                          alt={`${p.name} project, ${p.location}`}
                          fill
                          priority={i === 0}
                          sizes="(min-width: 768px) 30vw, 100vw"
                          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                        />
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col p-5 lg:p-6">
                      <h2 className="font-serif text-[1.5rem] leading-tight">
                        <Link href={p.href} className="transition-colors hover:text-[var(--color-teal-900)]">
                          {p.name}
                        </Link>
                      </h2>
                      <p className="mt-1.5 flex items-center gap-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-[var(--color-gold-text)]">
                        <MapPin size={10} aria-hidden />
                        {p.location}
                      </p>
                      <p className="mt-3.5 flex-1 text-[0.875rem] leading-[1.62] text-[var(--color-slate)]">
                        {p.tagline}
                      </p>

                      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.6875rem] text-[var(--color-slate)]">
                        <li className="flex items-center gap-1.5">
                          <Images size={11} className="text-[var(--color-gold)]" aria-hidden />
                          {galleryCount} maps &amp; photos
                        </li>
                        {docCount > 0 && (
                          <li className="flex items-center gap-1.5">
                            <FileText size={11} className="text-[var(--color-gold)]" aria-hidden />
                            {docCount} technical report{docCount > 1 ? 's' : ''}
                          </li>
                        )}
                      </ul>

                      <Link
                        href={p.href}
                        className="group/link mt-5 inline-flex items-center gap-2 self-start text-[0.8125rem] font-semibold text-[var(--color-teal-900)]"
                      >
                        View Project
                        <ArrowRight
                          size={14}
                          className="transition-transform duration-300 group-hover/link:translate-x-1"
                          aria-hidden
                        />
                      </Link>
                    </div>
                  </article>
                </RevealChild>
              );
            })}
          </RevealGroup>
        </div>
      </Section>

      {/* ------------------------------------------------ strategic context */}
      <Section tone="white" className="py-12 lg:py-16">
        <div className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <RevealOnScroll>
            <LocatorMap projects={projects} />
          </RevealOnScroll>

          <RevealOnScroll delay={0.08}>
            <p className="eyebrow text-[0.625rem]">Where we work</p>
            <h2 className="mt-3 font-serif text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.1]">
              Strategic Locations
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-[1.65] text-[var(--color-slate)]">
              All three properties sit in established North American mining districts with
              year-round access and nearby infrastructure.
            </p>

            <ul className="mt-7 space-y-4">
              {LOCATION_POINTS.map((p) => (
                <li key={p.text} className="flex items-start gap-3.5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-teal-50)]">
                    <Check size={11} className="text-[var(--color-teal-900)]" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.9375rem] font-medium text-[var(--color-ink)]">
                      {p.text}
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] leading-[1.55] text-[var(--color-slate)]">
                      {p.note}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <Link href="/projects/overview/" className="btn btn-outline mt-8 h-10">
              Read the portfolio overview
              <ArrowRight size={14} aria-hidden />
            </Link>
          </RevealOnScroll>
        </div>
      </Section>
    </>
  );
}
