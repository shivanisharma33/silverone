'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import type { Interview } from '@/lib/types';
import { formatDate } from '@/lib/format';

/**
 * Video library. Thumbnails are YouTube poster images; the player is only
 * mounted inside the modal, so no third-party iframe loads until asked for.
 */
export function InterviewGrid({ items }: { items: Interview[] }) {
  const [open, setOpen] = useState<Interview | null>(null);
  const reduce = useReducedMotion();

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <li key={`${it.videoId}-${i}`}>
            <article className="card card-hover group h-full overflow-hidden">
              <button
                type="button"
                onClick={() => it.videoId && setOpen(it)}
                disabled={!it.videoId}
                className="block w-full text-left"
                aria-label={`Play: ${it.title}`}
              >
                <span className="relative block aspect-video overflow-hidden bg-[var(--color-navy)]">
                  {it.videoId && (
                    <Image
                      src={`https://i.ytimg.com/vi/${it.videoId}/hqdefault.jpg`}
                      alt=""
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                  )}
                  <span className="absolute inset-0 bg-[var(--color-navy-deep)]/25 transition-colors duration-300 group-hover:bg-[var(--color-navy-deep)]/45" aria-hidden />
                  <span className="absolute inset-0 grid place-items-center" aria-hidden>
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-white/60 bg-white/15 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white">
                      <Play
                        size={15}
                        className="translate-x-px fill-white text-white transition-colors duration-300 group-hover:fill-[var(--color-navy)] group-hover:text-[var(--color-navy)]"
                      />
                    </span>
                  </span>
                </span>

                <span className="block p-5">
                  {it.date && (
                    <time
                      dateTime={it.date}
                      className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-text)]"
                    >
                      {formatDate(it.date)}
                    </time>
                  )}
                  <span className="mt-2 block font-serif text-[1.1rem] leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-teal-900)]">
                    {it.title}
                  </span>
                  {it.publisher && (
                    <span className="mt-1.5 block text-xs text-[var(--color-slate)]">
                      {it.publisher}
                    </span>
                  )}
                </span>
              </button>
            </article>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open?.videoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.1 : 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
            onClick={(e) => e.target === e.currentTarget && setOpen(null)}
            className="fixed inset-0 z-[80] grid place-items-center bg-[var(--color-navy-deep)]/94 p-4 backdrop-blur-sm"
          >
            <div className="w-full max-w-4xl">
              <div className="mb-3 flex items-start justify-between gap-5">
                <div>
                  <p className="font-serif text-lg text-white">{open.title}</p>
                  {open.publisher && <p className="mt-0.5 text-xs text-white/65">{open.publisher}</p>}
                </div>
                <button
                  type="button"
                  autoFocus
                  onClick={() => setOpen(null)}
                  aria-label="Close video"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={20} aria-hidden />
                </button>
              </div>
              <div className="aspect-video w-full overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${open.videoId}?autoplay=1&rel=0`}
                  title={open.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
              <a
                href={open.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-xs text-white/65 underline underline-offset-2 transition-colors hover:text-white"
              >
                Watch on YouTube
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
