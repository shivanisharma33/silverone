'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { DocumentCard } from '@/components/cards';
import { EmptyState } from '@/components/ui';
import { DOC_CATEGORIES, type LibraryEntry } from '@/lib/types';

const PAGE_SIZE = 24;

/** Searchable, filterable index of every published document. */
export function DocumentLibrary({ entries }: { entries: LibraryEntry[] }) {
  const [category, setCategory] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(PAGE_SIZE);
  const deferred = useDeferredValue(query);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: entries.length };
    for (const e of entries) c[e.category] = (c[e.category] || 0) + 1;
    return c;
  }, [entries]);

  const filtered = useMemo(() => {
    const q = deferred.trim().toLowerCase();
    return entries.filter((e) => {
      if (category !== 'all' && e.category !== category) return false;
      if (!q) return true;
      return `${e.title} ${e.categoryLabel} ${e.date} ${e.group ?? ''} ${e.project ?? ''}`
        .toLowerCase()
        .includes(q);
    });
  }, [entries, category, deferred]);

  const visible = filtered.slice(0, shown);
  const chips = [{ key: 'all', label: 'All Documents' }, ...DOC_CATEGORIES];

  return (
    <>
      <div className="flex flex-col gap-5 border-b border-[var(--color-stone)] pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div role="group" aria-label="Filter by document type" className="min-w-0 flex-1">
          <ul className="flex flex-wrap gap-1.5">
            {chips.map((c) => {
              const n = counts[c.key] || 0;
              if (c.key !== 'all' && n === 0) return null;
              const on = category === c.key;
              return (
                <li key={c.key}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setCategory(c.key);
                      setShown(PAGE_SIZE);
                    }}
                    className={`inline-flex items-center gap-2 border px-3.5 py-2 text-xs font-semibold transition-colors ${
                      on
                        ? 'border-[var(--color-teal-900)] bg-[var(--color-teal-900)] text-white'
                        : 'border-[var(--color-stone)] bg-white text-[var(--color-ink)] hover:border-[var(--color-teal-900)]'
                    }`}
                  >
                    {c.label}
                    <span className={on ? 'text-white/80' : 'text-[var(--color-slate)]'}>{n}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative lg:w-72">
          <label htmlFor="doc-search" className="sr-only">
            Search documents
          </label>
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-slate)]"
            aria-hidden
          />
          <input
            id="doc-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShown(PAGE_SIZE);
            }}
            placeholder="Search documents…"
            className="w-full border border-[var(--color-stone)] bg-white py-2.5 pl-10 pr-9 text-sm transition-colors focus:border-[var(--color-teal-900)] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-[var(--color-slate)] hover:text-[var(--color-ink)]"
            >
              <X size={14} aria-hidden />
            </button>
          )}
        </div>
      </div>

      <p role="status" aria-live="polite" className="mt-6 text-xs uppercase tracking-[0.14em] text-[var(--color-slate)]">
        {filtered.length} entr{filtered.length === 1 ? 'y' : 'ies'}
      </p>

      <h2 className="sr-only">Published documents</h2>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No documents found"
            body="Try a different search term or choose another category."
          />
        </div>
      ) : (
        <>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((e, i) => (
              <li key={`${e.category}-${e.title}-${i}`}>
                <DocumentCard row={e} categoryLabel={e.categoryLabel} />
              </li>
            ))}
          </ul>

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
