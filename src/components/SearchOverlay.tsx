'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Loader2, Search, X } from 'lucide-react';

type Entry = { t: string; h: string; k: string; d?: string };

/**
 * Site search over the migrated content. The index is fetched the first time
 * the overlay opens, so it costs nothing on first paint, and every result
 * points at a page or document that exists.
 */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();

  // A ref, not state, guards the one-shot fetch; "loading" is derived rather
  // than stored, so the effect body never sets state synchronously.
  const fetched = useRef(false);
  const loading = open && index === null;

  useEffect(() => {
    if (!open || fetched.current) return;
    fetched.current = true;
    let cancelled = false;
    fetch('/api/search-index')
      .then((r) => r.json())
      .then((d: Entry[]) => !cancelled && setIndex(d))
      .catch(() => !cancelled && setIndex([]));
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !index) return [];
    const terms = q.split(/\s+/);
    return index
      .map((e) => {
        const hay = e.t.toLowerCase();
        if (!terms.every((t) => hay.includes(t))) return null;
        // Prefer earlier matches and shorter titles.
        return { e, score: hay.indexOf(terms[0]) + e.t.length / 200 };
      })
      .filter((x): x is { e: Entry; score: number } => x !== null)
      .sort((a, b) => a.score - b.score)
      .slice(0, 24)
      .map((x) => x.e);
  }, [query, index]);

  // Reset the highlighted row when the query changes, during render rather
  // than in an effect.
  const [lastQuery, setLastQuery] = useState(query);
  if (query !== lastQuery) {
    setLastQuery(query);
    if (active !== 0) setActive(0);
  }

  const close = useCallback(() => {
    setQuery('');
    onClose();
  }, [onClose]);

  /**
   * Results are plain links, so arrow keys move real DOM focus rather than a
   * roving `aria-selected`. A listbox option may not contain a link, and the
   * browser already handles Enter on a focused anchor.
   */
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Enter') return;

    const links = Array.from(listRef.current?.querySelectorAll('a') ?? []);
    if (!links.length) return;
    const current = links.findIndex((l) => l === document.activeElement);

    if (e.key === 'Enter') {
      // Enter from the input opens the first result; on a focused link the
      // browser handles it.
      if (current === -1) {
        e.preventDefault();
        links[0].click();
      }
      return;
    }

    e.preventDefault();
    const next =
      e.key === 'ArrowDown'
        ? Math.min(current + 1, links.length - 1)
        : current <= 0
          ? -1
          : current - 1;

    if (next === -1) {
      inputRef.current?.focus();
      setActive(0);
    } else {
      links[next].focus();
      setActive(next);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.1 : 0.2 }}
          className="fixed inset-0 z-[70] bg-[var(--color-navy-deep)]/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }}
            transition={{ duration: reduce ? 0.12 : 0.26, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Search this site"
            className="mx-auto mt-[8vh] w-[min(42rem,92vw)] overflow-hidden rounded-[3px] bg-white shadow-[0_40px_90px_-40px_rgba(10,27,38,0.7)]"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-[var(--color-stone)] px-5">
              <Search size={17} className="shrink-0 text-[var(--color-slate)]" aria-hidden />
              <label htmlFor="site-search" className="sr-only">
                Search news, projects, documents and pages
              </label>
              <input
                id="site-search"
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search news, projects and documents…"
                autoComplete="off"
                className="flex-1 bg-transparent py-4 text-[0.9375rem] text-[var(--color-ink)] placeholder:text-[var(--color-slate)]/70 focus:outline-none"
              />
              {loading && <Loader2 size={15} className="animate-spin text-[var(--color-slate)]" aria-hidden />}
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="-mr-2 grid h-9 w-9 shrink-0 place-items-center text-[var(--color-slate)] transition-colors hover:text-[var(--color-ink)]"
              >
                <X size={17} aria-hidden />
              </button>
            </div>

            <div className="max-h-[56vh] overflow-y-auto overscroll-contain">
              {query.trim() === '' ? (
                <p className="px-5 py-6 text-sm text-[var(--color-slate)]">
                  Search {index ? index.length : ''} news releases, projects, documents and pages.
                </p>
              ) : results.length === 0 ? (
                <p className="px-5 py-6 text-sm text-[var(--color-slate)]">
                  No matches for “{query.trim()}”.
                </p>
              ) : (
                <ul ref={listRef} aria-label="Search results">
                  {results.map((r, i) => {
                    const external = /\.pdf$/i.test(r.h);
                    const inner = (
                      <>
                        <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-text)]">
                          {r.k}
                          {r.d && <span className="ml-2 font-normal text-[var(--color-slate)]">{r.d}</span>}
                        </span>
                        <span className="mt-0.5 block text-[0.9375rem] leading-snug text-[var(--color-ink)]">
                          {r.t}
                        </span>
                      </>
                    );
                    const cls = `block border-l-2 px-5 py-3 transition-colors focus:bg-[var(--color-warm)] focus:outline-none focus-visible:border-[var(--color-teal-900)] ${
                      i === active
                        ? 'border-[var(--color-teal-900)] bg-[var(--color-warm)]'
                        : 'border-transparent hover:bg-[var(--color-warm)]'
                    }`;
                    return (
                      <li key={`${r.h}-${i}`}>
                        {external ? (
                          <a href={r.h} target="_blank" rel="noopener noreferrer" className={cls} onClick={close}>
                            {inner}
                          </a>
                        ) : (
                          <Link href={r.h} className={cls} onClick={close}>
                            {inner}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
