import Image from 'next/image';
import type { ReactNode } from 'react';
import { PageHero, EmptyState, Section, breadcrumbSchema } from '@/components/ui';
import { DocumentRow } from '@/components/cards';
import { RevealOnScroll } from '@/components/Reveal';
import type { DocRow } from '@/lib/types';
import { SITE } from '@/lib/site';

/**
 * Shared layout for the investor document pages (presentations, factsheets,
 * AGM, ESTMA, LIFE, financial statements). Rows are grouped when the source
 * page grouped them (financial statements are grouped by year).
 */
export function DocumentListPage({
  title,
  eyebrow = 'Investors',
  intro,
  crumbs,
  rows,
  banner,
  cover,
  coverAlt,
  emptyBody,
  children,
}: {
  title: string;
  eyebrow?: string;
  intro?: string;
  crumbs: { label: string; href?: string }[];
  rows: DocRow[];
  banner?: string | null;
  cover?: string;
  coverAlt?: string;
  emptyBody?: string;
  children?: ReactNode;
}) {
  const groups = rows.reduce<Record<string, DocRow[]>>((acc, r) => {
    const key = r.group || '';
    (acc[key] ||= []).push(r);
    return acc;
  }, {});
  const groupKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));
  const grouped = groupKeys.length > 1 || (groupKeys.length === 1 && groupKeys[0] !== '');

  const total = rows.reduce((n, r) => n + r.links.length, 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs, SITE.url)) }}
      />

      <PageHero title={title} eyebrow={eyebrow} intro={intro} image={banner} crumbs={crumbs} compact />

      <Section tone="warm">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-14">
          {cover && (
            <aside className="lg:col-span-4">
              <RevealOnScroll className="lg:sticky lg:top-28">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] border border-[var(--color-stone)] bg-white">
                  <Image
                    src={cover}
                    alt={coverAlt || ''}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-contain"
                  />
                </div>
              </RevealOnScroll>
            </aside>
          )}

          <div className={cover ? 'lg:col-span-8' : 'lg:col-span-12'}>
            {children && <RevealOnScroll className="mb-10">{children}</RevealOnScroll>}

            {rows.length === 0 ? (
              <EmptyState
                title="No documents published"
                body={emptyBody || 'There are currently no documents in this category.'}
              />
            ) : (
              <RevealOnScroll>
                <p className="mb-6 text-xs uppercase tracking-[0.14em] text-[var(--color-slate)]">
                  {total} document{total === 1 ? '' : 's'}
                </p>

                {grouped
                  ? groupKeys.map((g) => (
                      <section key={g} className="mb-10 last:mb-0">
                        {g && (
                          <h2 className="mb-1 border-b-2 border-[var(--color-gold)]/40 pb-2 font-serif text-2xl">
                            {g}
                          </h2>
                        )}
                        {groups[g].map((r, i) => (
                          <DocumentRow key={`${r.title}-${i}`} row={r} />
                        ))}
                      </section>
                    ))
                  : rows.map((r, i) => <DocumentRow key={`${r.title}-${i}`} row={r} />)}
              </RevealOnScroll>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
