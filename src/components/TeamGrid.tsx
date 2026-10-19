import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Person } from '@/lib/types';
import { RevealChild, RevealGroup } from '@/components/Reveal';
import { Monogram } from '@/components/PersonProfile';

/**
 * Card grid for the management and board pages.
 *
 * The reference layout shows a portrait on each card. silverone.com publishes
 * no photographs of its people, so rather than source stand-ins each card
 * carries a monogram in the same position — the layout is preserved without
 * putting a stranger's face next to a real person's name.
 */
export function TeamGrid({
  people,
  basePath,
  label,
}: {
  people: Person[];
  basePath: string;
  /** Names the group for assistive tech and keeps the outline gap-free. */
  label: string;
}) {
  return (
    <>
    <h2 className="sr-only">{label}</h2>
    <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
      {people.map((p) => (
        <RevealChild key={p.slug}>
          <article className="card card-hover group flex h-full flex-col p-6">
            <Monogram name={p.name} />

            <h3 className="mt-4 font-serif text-[1.3rem] leading-tight text-[var(--color-ink)]">
              <Link
                href={`${basePath}${p.slug}/`}
                className="transition-colors hover:text-[var(--color-teal-900)]"
              >
                {p.name}
              </Link>
            </h3>
            <p className="mt-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-gold-text)]">
              {p.role}
            </p>

            <p className="mt-4 line-clamp-4 flex-1 text-[0.8125rem] leading-[1.62] text-[var(--color-slate)]">
              {p.excerpt}
            </p>

            <Link
              href={`${basePath}${p.slug}/`}
              className="group/link mt-5 inline-flex items-center gap-2 self-start text-[0.8125rem] font-semibold text-[var(--color-teal-900)]"
            >
              Read biography
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover/link:translate-x-1"
                aria-hidden
              />
            </Link>
          </article>
        </RevealChild>
      ))}
    </RevealGroup>
    </>
  );
}
