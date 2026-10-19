'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';

export type VideoModalSource = {
  provider: 'youtube' | 'vimeo';
  id: string;
  title: string;
  /** Shown under the title, e.g. the publisher. */
  meta?: string;
  /** Public watch page, offered as a fallback if the embed fails. */
  watchUrl: string;
};

/**
 * Accessible video dialog. The player is only mounted while the dialog is
 * open, so no third-party frame loads until the visitor asks for it.
 * Escape closes, focus is trapped, and focus returns to the trigger.
 */
export function VideoModal({
  source,
  onClose,
}: {
  source: VideoModalSource | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!source) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => closeRef.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, a[href], iframe'
      );
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
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [source, onClose]);

  const embed =
    source?.provider === 'vimeo'
      ? `https://player.vimeo.com/video/${source.id}?autoplay=1`
      : source
        ? `https://www.youtube-nocookie.com/embed/${source.id}?autoplay=1&rel=0`
        : '';

  return (
    <AnimatePresence>
      {source && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.1 : 0.22 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          className="fixed inset-0 z-[80] grid place-items-center bg-[var(--color-navy-deep)]/94 p-4 backdrop-blur-sm"
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={source.title}
            className="w-full max-w-4xl"
          >
            <div className="mb-3 flex items-start justify-between gap-5">
              <div className="min-w-0">
                <p className="font-serif text-lg leading-snug text-white">{source.title}</p>
                {source.meta && <p className="mt-0.5 text-xs text-white/65">{source.meta}</p>}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close video"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <div className="aspect-video w-full overflow-hidden bg-black">
              <iframe
                src={embed}
                title={source.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>

            <a
              href={source.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/65 underline underline-offset-2 transition-colors hover:text-white"
            >
              Watch on {source.provider === 'vimeo' ? 'Vimeo' : 'YouTube'}
              <ExternalLink size={11} aria-hidden />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
