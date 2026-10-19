'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { NewsRow } from '@/components/cards';
import { EmptyState } from '@/components/ui';
import type { NewsSummary } from '@/lib/types';

const PAGE_SIZE = 20;

/**
 * Client-side archive browser. The whole index is small enough to filter in
 * the browser, which keeps search and year switching instant with no network
 * round-trip.
 */
export function NewsArchive({
  items,
  years,
  activeYear,
}: {
  items: NewsSummary[];
  years: string[];
  activeYear?: string;
}) {
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(PAGE_SIZE);
  const deferred = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = deferred.trim().toLowerCase();
    if (!q) return items;
    return items.filter((n) =>
      `${n.headline} ${n.excerpt} ${n.dateLabel}`.toLowerCase().includes(q)
    );
  }, [items, deferred]);

  const visible = filtered.slice(0, shown);

  return (
    <>
      <div className="flex flex-col gap-5 border-b border-[var(--color-stone)] pb-6 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filter news by year" className="min-w-0">
          <ul className="no-scrollbar flex gap-1.5 overflow-x-auto">
            <li>
              <Link
                href="/news/"
                aria-current={!activeYear ? 'page' : undefined}
                className={`inline-block whitespace-nowrap border px-3.5 py-2 text-xs font-semibold transition-colors ${
                  !activeYear
                    ? 'border-[var(--color-teal-900)] bg-[var(--color-teal-900)] text-white'
                    : 'border-[var(--color-stone)] bg-white text-[var(--color-ink)] hover:border-[var(--color-teal-900)]'
                }`}
              >
                All
              </Link>
            </li>
            {years.map((y) => (
              <li key={y}>
                <Link
                  href={`/news/${y}/`}
                  aria-current={activeYear === y ? 'page' : undefined}
                  className={`inline-block whitespace-nowrap border px-3.5 py-2 text-xs font-semibold transition-colors ${
                    activeYear === y
                      ? 'border-[var(--color-teal-900)] bg-[var(--color-teal-900)] text-white'
                      : 'border-[var(--color-stone)] bg-white text-[var(--color-ink)] hover:border-[var(--color-teal-900)]'
                  }`}
                >
                  {y}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative lg:w-80">
          <label htmlFor="news-search" className="sr-only">
            Search news releases
          </label>
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-slate)]"
            aria-hidden
          />
          <input
            id="news-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShown(PAGE_SIZE);
            }}
            placeholder={activeYear ? `Search ${activeYear} releases…` : 'Search all releases…'}
            className="w-full border border-[var(--color-stone)] bg-white py-2.5 pl-10 pr-9 text-sm transition-colors focus:border-[var(--color-teal-900)] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-[var(--color-slate)] transition-colors hover:text-[var(--color-ink)]"
            >
              <X size={14} aria-hidden />
            </button>
          )}
        </div>
      </div>

      <p role="status" aria-live="polite" className="mt-6 text-xs uppercase tracking-[0.14em] text-[var(--color-slate)]">
        {filtered.length} release{filtered.length === 1 ? '' : 's'}
        {deferred.trim() && ` matching “${deferred.trim()}”`}
      </p>

      <h2 className="sr-only">{activeYear ? `News releases from ${activeYear}` : 'All news releases'}</h2>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No releases found"
            body="Try a different search term, or browse another year from the filters above."
          />
        </div>
      ) : (
        <>
          <div className="mt-4">
            {visible.map((n) => (
              <NewsRow key={`${n.year}-${n.slug}`} item={n} />
            ))}
          </div>

          {shown < filtered.length && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setShown((s) => s + PAGE_SIZE)}
                className="btn btn-outline"
              >
                Load {Math.min(PAGE_SIZE, filtered.length - shown)} more
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
