'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown, Menu, Search, X } from 'lucide-react';
import { NAV, type NavGroup } from '@/lib/site';
import { SearchOverlay } from '@/components/SearchOverlay';

/* --------------------------------------------------------------- desktop -- */

function Dropdown({ group, active }: { group: NavGroup; active: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLLIElement>(null);
  /** Suppresses the re-open that focus/hover would otherwise cause right
   *  after the user dismissed the menu with Escape. */
  const dismissed = useRef(false);
  const menuId = useId();
  const reduce = useReducedMotion();

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => () => cancelClose(), []);

  // Close when focus leaves the whole group, and on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      dismissed.current = true;
      setOpen(false);
      // Returning focus to the trigger fires onFocus on the wrapper, so the
      // dismissed flag keeps that from immediately reopening the menu.
      wrapRef.current?.querySelector('a')?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!group.children?.length) {
    return (
      <li>
        <Link
          href={group.href}
          className={`relative inline-flex h-[60px] items-center px-3 lg:h-[72px] lg:px-4 text-[0.8125rem] font-medium tracking-wide transition-colors ${active ? 'text-[var(--color-teal-900)]' : 'text-[var(--color-ink)] hover:text-[var(--color-teal-900)]'
            }`}
        >
          {group.label}
          {active && <span className="absolute inset-x-3 bottom-[18px] h-[2px] lg:inset-x-4 bg-[var(--color-gold)] rounded-full" />}
        </Link>
      </li>
    );
  }

  return (
    <li
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        dismissed.current = false;
        setOpen(true);
      }}
      onMouseLeave={() => {
        dismissed.current = false;
        scheduleClose();
      }}
      onFocus={() => {
        if (dismissed.current) return;
        cancelClose();
        setOpen(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          dismissed.current = false;
          setOpen(false);
        }
      }}
    >
      <Link
        href={group.href}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => setOpen(false)}
        className={`relative inline-flex h-[60px] items-center gap-1.5 px-3 lg:h-[72px] lg:px-4 text-[0.8125rem] font-medium tracking-wide transition-colors ${active ? 'text-[var(--color-teal-900)]' : 'text-[var(--color-ink)] hover:text-[var(--color-teal-900)]'
          }`}
      >
        {group.label}
        <ChevronDown
          size={13}
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
        {active && <span className="absolute inset-x-3 bottom-[18px] h-[2px] lg:inset-x-4 bg-[var(--color-gold)] rounded-full" />}
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            initial={{ opacity: 0, y: reduce ? 0 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -6 }}
            transition={{ duration: reduce ? 0.12 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-full z-50 w-[20rem] rounded-[3px] border border-[var(--color-stone)] bg-white p-2 shadow-[0_26px_60px_-30px_rgba(16,42,58,0.5)]"
          >
            <ul>
              {group.children.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    onClick={() => setOpen(false)}
                    className="group/item block rounded-[2px] px-3.5 py-2.5 transition-colors hover:bg-[var(--color-warm)]"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-[0.8125rem] font-semibold text-[var(--color-ink)] group-hover/item:text-[var(--color-teal-900)]">
                        {c.label}
                      </span>
                      <ArrowRight
                        size={13}
                        className="shrink-0 -translate-x-1 text-[var(--color-gold-text)] opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100"
                        aria-hidden
                      />
                    </span>
                    {c.description && (
                      <span className="mt-0.5 block text-xs leading-snug text-[var(--color-slate)]">
                        {c.description}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/* ---------------------------------------------------------------- mobile -- */

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-[var(--color-navy-deep)]/55 lg:hidden"
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ x: reduce ? 0 : '100%', opacity: reduce ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduce ? 0 : '100%', opacity: reduce ? 0 : 1 }}
            transition={{ duration: reduce ? 0.15 : 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[61] flex w-[min(24rem,88vw)] flex-col bg-white shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-stone)] px-5 py-4">
              <Image src="/brand/logo-footer.png" alt="Silver One Resources Inc." width={219} height={58} className="h-8 w-auto" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="-mr-2 grid h-10 w-10 place-items-center rounded-full text-[var(--color-ink)] transition-colors hover:bg-[var(--color-stone-soft)] hover:text-[var(--color-teal-900)]"
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto overscroll-contain px-2 py-3">
              <ul>
                {NAV.map((g) => {
                  const isOpen = expanded === g.label;
                  return (
                    <li key={g.label} className="border-b border-[var(--color-stone)]/70 last:border-0">
                      <div className="flex items-stretch">
                        <Link
                          href={g.href}
                          onClick={onClose}
                          className="flex-1 px-3 py-4 font-serif text-lg text-[var(--color-ink)]"
                        >
                          {g.label}
                        </Link>
                        {g.children && (
                          <button
                            type="button"
                            onClick={() => setExpanded(isOpen ? null : g.label)}
                            aria-expanded={isOpen}
                            aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${g.label} section`}
                            className="grid w-12 place-items-center text-[var(--color-slate)]"
                          >
                            <ChevronDown
                              size={17}
                              className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                              aria-hidden
                            />
                          </button>
                        )}
                      </div>
                      <AnimatePresence initial={false}>
                        {isOpen && g.children && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: reduce ? 0.1 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pb-3 pl-3">
                              {g.children.map((c) => (
                                <li key={c.href}>
                                  <Link
                                    href={c.href}
                                    onClick={onClose}
                                    className="block border-l border-[var(--color-stone)] py-2.5 pl-4 text-sm text-[var(--color-slate)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-teal-900)]"
                                  >
                                    {c.label}
                                  </Link>
                                </li>
                              ))}
                            </div>
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-t border-[var(--color-stone)] p-4">
              <Link href="/investors/" onClick={onClose} className="btn btn-primary w-full">
                Investor Information
                <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ----------------------------------------------------------------- shell -- */

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer whenever the route changes, including on back/forward.
  // Adjusting state during render is React's recommended alternative to an
  // effect here: it avoids the extra render pass an effect would cause.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (mobileOpen) setMobileOpen(false);
    if (searchOpen) setSearchOpen(false);
  }

  const isActive = (g: NavGroup) =>
    pathname === g.href ||
    (g.children?.some((c) => pathname.startsWith(c.href) && c.href !== '/') ?? false) ||
    (g.href !== '/' && pathname.startsWith(g.href));

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-[var(--color-teal-900)] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${scrolled
            ? 'border-b border-[var(--color-stone)] bg-[var(--color-warm)]/[0.97] shadow-[0_1px_24px_-12px_rgba(16,42,58,0.2)] backdrop-blur-lg'
            : 'border-b border-transparent bg-[var(--color-warm)]'
          }`}
      >
        <div className="shell flex h-[60px] items-center gap-6 lg:h-[72px]">
          <Link href="/" className="shrink-0" aria-label="Silver One Resources Inc. — home">
            <Image
              src="/brand/logo-footer.png"
              alt="Silver One Resources Inc."
              width={219}
              height={58}
              priority
              className="h-8 w-auto lg:h-[40px]"
            />
          </Link>

          <nav aria-label="Primary" className="hidden flex-1 justify-center lg:flex">
            <ul className="flex items-center">
              {NAV.map((g) => (
                <Dropdown key={g.label} group={g} active={isActive(g)} />
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0 lg:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search this site"
              className="grid h-10 w-10 place-items-center rounded-full text-[var(--color-ink)] transition-colors hover:bg-[var(--color-stone-soft)] hover:text-[var(--color-teal-900)]"
            >
              <Search size={18} aria-hidden />
            </button>
            <Link href="/investors/" className="btn btn-primary hidden h-10 xl:inline-flex">
              Investor Information
              <ArrowRight size={15} aria-hidden />
            </Link>
            <Link href="/investors/" className="btn btn-primary hidden h-10 lg:inline-flex xl:hidden">
              Investors
              <ArrowRight size={15} aria-hidden />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-[var(--color-ink)] transition-colors hover:bg-[var(--color-stone-soft)] hover:text-[var(--color-teal-900)] lg:hidden"
            >
              <Menu size={22} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
