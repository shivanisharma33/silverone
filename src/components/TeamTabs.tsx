'use client';

import Link from 'next/link';

/**
 * Management / Directors switch. These are two real routes rather than a
 * client-side tab set, so the URLs the original site used keep working and
 * each list stays linkable and indexable.
 */
export function TeamTabs({ active }: { active: 'management' | 'directors' }) {
  const tabs = [
    { key: 'management', label: 'Management', href: '/corporate/management/' },
    { key: 'directors', label: 'Directors', href: '/corporate/directors/' },
  ] as const;

  return (
    <nav aria-label="Team sections" className="border-b border-[var(--color-stone)]">
      <ul className="-mb-px flex gap-1">
        {tabs.map((t) => {
          const on = t.key === active;
          return (
            <li key={t.key}>
              <Link
                href={t.href}
                aria-current={on ? 'page' : undefined}
                className={`relative inline-block px-4 py-3.5 text-[0.8125rem] font-semibold transition-colors ${
                  on
                    ? 'text-[var(--color-teal-900)]'
                    : 'text-[var(--color-slate)] hover:text-[var(--color-ink)]'
                }`}
              >
                {t.label}
                {on && (
                  <span className="absolute inset-x-3 bottom-0 h-[2px] bg-[var(--color-teal-900)]" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
