'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import type { GalleryItem } from '@/lib/types';

/**
 * Thumbnail grid with an accessible lightbox: focus is trapped while open,
 * Escape closes, arrow keys move between items, and focus returns to the
 * thumbnail that opened it.
 */
export function ProjectGallery({ items, label }: { items: GalleryItem[]; label: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const close = useCallback(() => {
    const i = index;
    setIndex(null);
    if (i !== null) requestAnimationFrame(() => triggers.current[i]?.focus());
  }, [index]);

  const step = useCallback(
    (dir: number) => setIndex((i) => (i === null ? null : (i + dir + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (index === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Tab') {
        // Keep focus inside the dialog.
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button');
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [index, close, step]);

  if (!items.length) return null;
  const active = index === null ? null : items[index];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((it, i) => (
          <li key={`${it.src}-${i}`}>
            <button
              ref={(el) => {
                triggers.current[i] = el;
              }}
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-[var(--color-stone)] bg-white"
              aria-label={it.caption ? `Enlarge: ${it.caption}` : `Enlarge image ${i + 1} of ${items.length}`}
            >
              <Image
                src={it.thumb || it.src}
                alt={it.caption || ''}
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
              />
              <span className="absolute inset-0 bg-[var(--color-navy-deep)]/0 transition-colors duration-300 group-hover:bg-[var(--color-navy-deep)]/35" aria-hidden />
              <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden>
                <ZoomIn size={13} className="text-[var(--color-navy)]" />
              </span>
            </button>
            {it.caption && (
              <p className="mt-2 line-clamp-2 text-[0.6875rem] leading-snug text-[var(--color-slate)]">
                {it.caption}
              </p>
            )}
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.1 : 0.25 }}
            className="fixed inset-0 z-[80] flex flex-col bg-[var(--color-navy-deep)]/96 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <div
              ref={dialogRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label={`${label} — image ${(index ?? 0) + 1} of ${items.length}`}
              className="flex h-full flex-col outline-none"
            >
              <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
                <p className="text-xs text-white/65">
                  {label} · {(index ?? 0) + 1} / {items.length}
                </p>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close image viewer"
                  className="grid h-10 w-10 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={20} aria-hidden />
                </button>
              </div>

              <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-16">
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous image"
                    className="absolute left-1 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4"
                  >
                    <ChevronLeft size={21} aria-hidden />
                  </button>
                )}

                <motion.div
                  key={active.src}
                  initial={{ opacity: 0, scale: reduce ? 1 : 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reduce ? 0.1 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full max-h-full w-full"
                >
                  <Image
                    src={active.src}
                    alt={active.caption || ''}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </motion.div>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next image"
                    className="absolute right-1 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4"
                  >
                    <ChevronRight size={21} aria-hidden />
                  </button>
                )}
              </div>

              {active.caption && (
                <p className="mx-auto max-w-3xl px-5 py-5 text-center text-xs leading-relaxed text-white/65 sm:text-sm">
                  {active.caption}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
