import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Person } from '@/lib/types';
import { RichText } from '@/components/ui';

/** Monogram stands in for a portrait — the source site publishes no photographs. */
function Monogram({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <span
      aria-hidden
      className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[var(--color-gold)]/35 bg-[var(--color-teal-50)] font-serif text-lg text-[var(--color-teal-900)]"
    >
      {initials}
    </span>
  );
}

/** Full biography block used on the management and directors index pages. */
export function PersonProfile({ person, href }: { person: Person; href: string }) {
  return (
    <article id={person.slug} className="scroll-mt-32 border-t border-[var(--color-stone)] py-10 first:border-t-0 first:pt-0">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <header className="lg:col-span-4">
          <div className="flex items-start gap-4 lg:sticky lg:top-28">
            <Monogram name={person.name} />
            <div className="min-w-0">
              <h2 className="font-serif text-[1.45rem] leading-tight text-[var(--color-ink)]">
                {person.name}
              </h2>
              <p className="mt-1.5 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-gold-text)]">
                {person.role}
              </p>
              <Link
                href={href}
                className="group mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-teal-900)]"
              >
                Full profile
                <ArrowRight
                  size={12}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </header>

        <div className="lg:col-span-8">
          <RichText html={person.html} className="text-[1rem]" />
        </div>
      </div>
    </article>
  );
}

export { Monogram };
