'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ProjectGallery } from '@/components/ProjectGallery';
import { EmbeddedVideo } from '@/components/EmbeddedVideo';
import { DocumentRow } from '@/components/cards';
import { RichText } from '@/components/ui';
import type { ProjectTab } from '@/lib/types';

/**
 * Tabbed project sections, mirroring how the source site organised each
 * property. Implements the WAI-ARIA tabs pattern: arrow keys move between
 * tabs, Home/End jump to the ends, and the panel is focusable.
 */
export function ProjectTabs({ tabs, projectName }: { tabs: ProjectTab[]; projectName: string }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();

  // Deep links such as /projects/.../candelaria/#resources select that tab,
  // both on first load and when the hash changes while already on the page.
  useEffect(() => {
    const syncFromHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace('#', ''));
      if (!hash) return;
      const i = tabs.findIndex((t) => t.id === hash);
      if (i >= 0) setActive(i);
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [tabs]);

  function onKeyDown(e: React.KeyboardEvent) {
    const last = tabs.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    else if (e.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  const tab = tabs[active];
  const hasBody = tab.html.replace(/<[^>]*>/g, '').trim().length > 0;

  return (
    <>
      <div className="sticky top-16 z-30 -mx-[var(--gutter)] border-b border-[var(--color-stone)] bg-[var(--color-warm)]/95 px-[var(--gutter)] backdrop-blur-md lg:top-20">
        <div
          role="tablist"
          aria-label={`${projectName} project sections`}
          onKeyDown={onKeyDown}
          className="no-scrollbar -mb-px flex gap-1 overflow-x-auto"
        >
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active === i}
              aria-controls={`panel-${t.id}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative shrink-0 whitespace-nowrap px-4 py-4 text-[0.8125rem] font-semibold transition-colors ${
                active === i
                  ? 'text-[var(--color-teal-900)]'
                  : 'text-[var(--color-slate)] hover:text-[var(--color-ink)]'
              }`}
            >
              {t.label}
              {active === i && (
                <motion.span
                  layoutId={`tab-underline-${projectName}`}
                  transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-3 bottom-0 h-[2px] bg-[var(--color-teal-900)]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          tabIndex={0}
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : -6 }}
          transition={{ duration: reduce ? 0.12 : 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="pt-10 outline-none lg:pt-14"
        >
          {hasBody && <RichText html={tab.html} />}

          {tab.videos?.length > 0 && (
            <div
              className={[
                hasBody ? 'mt-10' : '',
                'grid gap-6',
                tab.videos.length > 1 ? 'lg:grid-cols-2' : 'max-w-3xl',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {tab.videos.map((v) => (
                <EmbeddedVideo key={v.src} video={v} label={`${projectName} — ${tab.label}`} />
              ))}
            </div>
          )}

          {tab.docs.length > 0 && (
            <div className={hasBody || tab.videos?.length ? 'mt-10' : ''}>
              {tab.docs.map((d, i) => (
                <DocumentRow key={`${d.title}-${i}`} row={d} />
              ))}
            </div>
          )}

          {tab.gallery.length > 0 && (
            <div className={hasBody || tab.docs.length || tab.videos?.length ? 'mt-10' : ''}>
              <ProjectGallery items={tab.gallery} label={`${projectName} — ${tab.label}`} />
            </div>
          )}

          {!hasBody && !tab.docs.length && !tab.gallery.length && !tab.videos?.length && (
            <p className="text-sm text-[var(--color-slate)]">
              No material is currently published in this section.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
