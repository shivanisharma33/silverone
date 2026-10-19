import Image from 'next/image';
import type { Metadata } from 'next';
import { PageHero, RichText, Section, breadcrumbSchema } from '@/components/ui';
import { RevealChild, RevealGroup, RevealOnScroll } from '@/components/Reveal';
import { pages } from '@/lib/content';
import { SITE } from '@/lib/site';

const CRUMBS = [{ label: 'Investors', href: '/investors/' }, { label: 'Why Silver?' }];

export const metadata: Metadata = {
  title: 'Why Silver?',
  description:
    'Silver — "The Indispensable Metal". Why silver matters as both a precious metal and an industrial commodity, and why Silver One is focused on it.',
  alternates: { canonical: '/investors/why-silver/' },
};

export default function WhySilverPage() {
  const page = pages.whySilver;
  // The source page ends with a set of full-width infographic slides; pull them
  // out of the body so they can be presented as a proper figure list.
  const slides = page.images.filter((i) => /slide\d/i.test(i.src));
  const htmlWithoutSlides = slides.length
    ? page.html.replace(/<p>\s*(<img[^>]*slide\d[^>]*>\s*)+<\/p>/gi, '').replace(/<img[^>]*slide\d[^>]*>/gi, '')
    : page.html;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(CRUMBS, SITE.url)) }}
      />

      <PageHero
        title="Why Silver?"
        eyebrow="Investors"
        intro="The indispensable metal — a store of value and an industrial input with no easy substitute."
        image={page.banner}
        crumbs={CRUMBS}
      />

      <Section tone="warm">
        <div className="shell-narrow lg:max-w-4xl">
          <RevealOnScroll>
            <RichText html={htmlWithoutSlides} />
          </RevealOnScroll>
        </div>
      </Section>

      {slides.length > 0 && (
        <Section tone="white">
          <div className="shell-narrow lg:max-w-5xl">
            <RevealGroup className="space-y-8">
              {slides.map((s, i) => (
                <RevealChild key={s.src}>
                  <figure className="overflow-hidden rounded-[3px] border border-[var(--color-stone)] bg-white">
                    <Image
                      src={s.src}
                      alt={s.alt || `Silver market infographic, slide ${i + 1}`}
                      width={949}
                      height={534}
                      sizes="(min-width: 1024px) 60rem, 100vw"
                      className="h-auto w-full"
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  </figure>
                </RevealChild>
              ))}
            </RevealGroup>
          </div>
        </Section>
      )}
    </>
  );
}
