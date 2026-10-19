import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { PageHero, RichText, Section, SectionHeading, breadcrumbSchema } from '@/components/ui';
import { ProjectCard } from '@/components/cards';
import { RevealChild, RevealGroup, RevealOnScroll } from '@/components/Reveal';
import { pages, projects } from '@/lib/content';
import { SITE } from '@/lib/site';

const CRUMBS = [{ label: 'Projects', href: '/projects/overview/' }, { label: 'Overview' }];

export const metadata: Metadata = {
  title: 'Projects Overview',
  description:
    'An overview of the Silver One Resources project portfolio: the flagship Candelaria past-producing silver mine in Nevada, the Cherokee silver-copper-gold project in Nevada, and the high-grade Phoenix Silver project in Arizona.',
  alternates: { canonical: '/projects/overview/' },
};

export default function ProjectsOverviewPage() {
  const page = pages.projectsOverview;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(CRUMBS, SITE.url)) }}
      />

      <PageHero
        title="Projects Overview"
        eyebrow="Projects"
        intro="How the portfolio fits together — and where each property stands today."
        image={page.banner}
        crumbs={CRUMBS}
      />

      <Section tone="warm">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            <RevealOnScroll>
              <RichText html={page.html} />
            </RevealOnScroll>
          </div>

          <aside className="lg:col-span-4">
            <RevealOnScroll delay={0.08} className="lg:sticky lg:top-28">
              <nav aria-label="Projects" className="card p-6">
                <h2 className="font-serif text-xl">The Properties</h2>
                <ul className="mt-4 divide-y divide-[var(--color-stone)]">
                  {projects.map((p) => (
                    <li key={p.slug}>
                      <Link href={p.href} className="group flex items-start justify-between gap-3 py-3.5">
                        <span>
                          <span className="block text-sm font-semibold text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-teal-900)]">
                            {p.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-[var(--color-slate)]">
                            {p.location}
                          </span>
                        </span>
                        <ArrowRight
                          size={14}
                          className="mt-1 shrink-0 text-[var(--color-gold-text)] transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/projects/usa-projects/" className="btn btn-outline mt-5 w-full">
                  Compare all projects
                  <ArrowRight size={14} aria-hidden />
                </Link>
              </nav>
            </RevealOnScroll>
          </aside>
        </div>
      </Section>

      <Section tone="white">
        <div className="shell">
          <SectionHeading eyebrow="Portfolio" title="Explore Each Property" align="center" />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <RevealChild key={p.slug}>
                <ProjectCard project={p} />
              </RevealChild>
            ))}
          </RevealGroup>
        </div>
      </Section>
    </>
  );
}
