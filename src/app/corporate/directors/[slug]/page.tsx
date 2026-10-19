import Link from 'next/link';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs, RichText, Section, breadcrumbSchema } from '@/components/ui';
import { Monogram } from '@/components/PersonProfile';
import { RevealOnScroll } from '@/components/Reveal';
import { findPerson, team } from '@/lib/content';
import { SITE } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return team.directors.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const person = findPerson('directors', slug);
  if (!person) return { title: 'Profile not found' };
  return {
    title: `${person.name} — ${person.role}`,
    description: person.excerpt,
    alternates: { canonical: `/corporate/directors/${person.slug}/` },
  };
}

/**
 * With `cacheComponents` enabled, reading `params` must happen inside a
 * Suspense boundary so the static shell can stream ahead of the URL data.
 */
export default function DirectorProfilePage({ params }: Params) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <DirectorProfileContent params={params} />
    </Suspense>
  );
}

function ProfileSkeleton() {
  return (
    <div className="bg-[var(--color-warm)] py-20" role="status" aria-label="Loading profile">
      <div className="shell-narrow animate-pulse space-y-4 lg:max-w-4xl">
        <div className="h-3 w-48 rounded bg-[var(--color-stone)]" />
        <div className="h-12 w-2/3 rounded bg-[var(--color-stone)]" />
        <div className="mt-8 h-4 w-full rounded bg-[var(--color-stone)]" />
        <div className="h-4 w-11/12 rounded bg-[var(--color-stone)]" />
      </div>
    </div>
  );
}

async function DirectorProfileContent({ params }: Params) {
  const { slug } = await params;
  const person = findPerson('directors', slug);
  if (!person) notFound();

  const crumbs = [
    { label: 'Corporate', href: '/corporate/about-silver-one/' },
    { label: 'Directors', href: '/corporate/directors/' },
    { label: person.name },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: person.name,
            jobTitle: person.role,
            worksFor: { '@type': 'Corporation', name: SITE.name },
            url: `${SITE.url}/corporate/directors/${person.slug}/`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs, SITE.url)) }}
      />

      <Section tone="warm" className="pt-10 lg:pt-14">
        <div className="shell-narrow lg:max-w-4xl">
          <Breadcrumbs items={crumbs} />

          <RevealOnScroll className="mt-9">
            <div className="flex items-start gap-5">
              <Monogram name={person.name} />
              <div>
                <h1 className="font-serif text-[clamp(2rem,4.5vw,3rem)] leading-tight">{person.name}</h1>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-gold-text)]">
                  {person.role}
                </p>
              </div>
            </div>

            <div className="rule-gold mt-9" />
            <RichText html={person.html} className="mt-8" />

            <Link href="/corporate/directors/" className="btn btn-outline mt-12">
              <ArrowLeft size={15} aria-hidden />
              All directors
            </Link>
          </RevealOnScroll>
        </div>
      </Section>
    </>
  );
}
