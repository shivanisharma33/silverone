import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Activity, ArrowRight, Gem, MapPin, Mountain } from 'lucide-react';
import { PageHero, Section, SectionHeading, breadcrumbSchema } from '@/components/ui';
import { ProjectTabs } from '@/components/ProjectTabs';
import { NewsCard, ProjectCard } from '@/components/cards';
import { RevealChild, RevealGroup, RevealOnScroll } from '@/components/Reveal';
import { CtaBand, FactCard } from '@/components/sections';
import { PROJECT_FACTS } from '@/lib/project-facts';
import { findProject, newsForProject, projects } from '@/lib/content';
import { SITE } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return { title: 'Project not found' };
  return {
    title: `${project.name} Project, ${project.location}`,
    description: project.metaDesc || `${project.name} — ${project.tagline} ${project.location}.`,
    alternates: { canonical: project.href },
    openGraph: {
      title: `${project.name} Project — ${project.location}`,
      description: project.tagline,
      images: project.banner ? [{ url: project.banner }] : undefined,
    },
  };
}

/**
 * With `cacheComponents` enabled, reading `params` must happen inside a
 * Suspense boundary so the static shell can stream ahead of the URL data.
 */
export default function ProjectPage({ params }: Params) {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ProjectPageContent params={params} />
    </Suspense>
  );
}

function ProjectSkeleton() {
  return (
    <div className="bg-[var(--color-navy)] py-24" role="status" aria-label="Loading project">
      <div className="shell animate-pulse space-y-4">
        <div className="h-3 w-56 rounded bg-white/15" />
        <div className="h-14 w-2/3 rounded bg-white/15" />
        <div className="h-4 w-1/2 rounded bg-white/10" />
      </div>
    </div>
  );
}

async function ProjectPageContent({ params }: Params) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const crumbs = [
    { label: 'Projects', href: '/projects/overview/' },
    { label: 'USA Projects', href: '/projects/usa-projects/' },
    { label: project.name },
  ];
  const facts = PROJECT_FACTS[project.slug];
  const related = newsForProject(project, 3);
  const others = projects.filter((p) => p.slug !== project.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs, SITE.url)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Place',
            name: `${project.name} Project`,
            description: project.tagline,
            address: { '@type': 'PostalAddress', addressRegion: project.state, addressCountry: 'US' },
            url: `${SITE.url}${project.href}`,
          }),
        }}
      />

      <PageHero
        title={`${project.name}`}
        eyebrow={`${project.name} Project`}
        intro={project.tagline}
        image={project.banner}
        imageAlt={`The ${project.name} property, ${project.location}`}
        crumbs={crumbs}
      />

      {/* ----------------------------------------------------- overview --- */}
      {facts && (
        <Section tone="warm" className="py-12 lg:py-14">
          <div className="shell">
            <div className="grid items-start gap-9 lg:grid-cols-2 lg:gap-14">
              <RevealOnScroll>
                <h2 className="font-serif text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.1]">
                  Project Overview
                </h2>
                <p
                  className="mt-5 text-[0.9375rem] leading-[1.7] text-[var(--color-slate)]"
                  dangerouslySetInnerHTML={{ __html: facts.overview }}
                />
                <div className="mt-7">
                  <FactCard
                    title="At a glance"
                    facts={[
                      { label: 'Location', value: facts.location, icon: MapPin },
                      { label: 'Commodity', value: facts.commodity, icon: Gem },
                      { label: 'Project Type', value: facts.projectType, icon: Mountain },
                      { label: 'Status', value: facts.status, icon: Activity },
                    ]}
                  />
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.08} y={22}>
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-[var(--color-stone)]">
                    <Image
                      src={facts.overviewImage}
                      alt={facts.overviewImageAlt}
                      fill
                      priority
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  {facts.overviewCaption && (
                    <figcaption className="mt-2.5 text-[0.6875rem] leading-snug text-[var(--color-slate)]">
                      {facts.overviewCaption}
                    </figcaption>
                  )}
                </figure>
              </RevealOnScroll>
            </div>
          </div>
        </Section>
      )}

      {/* --------------------------------------------- detail (source tabs) */}
      <Section tone="white" className="pt-0 lg:pt-0">
        <div className="shell">
          <ProjectTabs tabs={project.tabs} projectName={project.name} />
        </div>
      </Section>

      {facts && (
        <CtaBand
          image={facts.bandImage}
          imageAlt={facts.bandImageAlt}
          eyebrow={project.name}
          title={facts.bandTitle}
          body={facts.bandBody}
          href={facts.bandHref}
          action={facts.bandAction}
        />
      )}

      {related.length > 0 && (
        <Section tone="white">
          <div className="shell">
            <SectionHeading
              eyebrow="Related News"
              title={`${project.name} in the News`}
              action={
                <Link href="/news/" className="btn btn-outline">
                  All news
                  <ArrowRight size={15} aria-hidden />
                </Link>
              }
            />
            <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((n) => (
                <RevealChild key={n.slug}>
                  <NewsCard item={n} />
                </RevealChild>
              ))}
            </RevealGroup>
          </div>
        </Section>
      )}

      <Section tone="warm">
        <div className="shell">
          <SectionHeading
            eyebrow="Portfolio"
            title="Other Projects"
            action={
              <Link href="/projects/usa-projects/" className="btn btn-outline h-10">
                All projects
                <ArrowRight size={15} aria-hidden />
              </Link>
            }
          />
          {/* Three columns even though two cards remain, so the cards keep the
              same proportions they have everywhere else on the site. */}
          <RevealGroup className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <RevealChild key={p.slug}>
                <ProjectCard project={p} />
              </RevealChild>
            ))}
          </RevealGroup>

          <p className="mt-10 flex items-center gap-2 text-xs text-[var(--color-slate)]">
            <MapPin size={13} className="text-[var(--color-gold)]" aria-hidden />
            All Silver One properties are located in Nevada and Arizona, United States.
          </p>
        </div>
      </Section>
    </>
  );
}
