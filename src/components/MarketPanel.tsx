'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { LISTINGS } from '@/lib/site';

import { ProactiveQuotes, QUOTES_SCRIPT } from '@/components/proactive';

/**
 * Live market panel.
 *
 * Values are rendered by Silver One's existing `proactive-quotes` web component
 * (the same provider the current site uses). We never hard-code or synthesise a
 * price: until the widget populates a figure, the panel shows the verified
 * exchange symbol and a link to the official quote page, and nothing more.
 */
export function MarketPanel({ variant = 'hero' }: { variant?: 'hero' | 'panel' }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // If the third-party widget has not defined itself shortly after load, fall
  // back permanently to the symbols-only presentation.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!customElements.get('proactive-quotes')) setFailed(true);
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  const hero = variant === 'hero';

  return (
    <>
      <Script
        src={QUOTES_SCRIPT}
        type="module"
        strategy="lazyOnload"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />

      <div
        className={
          hero
            ? 'w-full border border-white/12 bg-[var(--color-navy-deep)]/82 backdrop-blur-md'
            : 'card w-full'
        }
      >
        <ProactiveQuotes>
          <ul className={hero ? 'divide-y divide-white/10' : 'divide-y divide-[var(--color-stone)]'}>
            {LISTINGS.map((l) => (
              <li
                key={l.symbol}
                className={`flex items-center justify-between gap-4 px-4 sm:px-5 ${hero ? 'py-[9px]' : 'py-3'}`}
              >
                <div className="flex min-w-0 items-baseline gap-2.5">
                  <span
                    className={`text-[0.625rem] font-semibold uppercase tracking-[0.14em] ${
                      hero ? 'text-white/65' : 'text-[var(--color-slate)]'
                    }`}
                  >
                    {l.exchange}
                  </span>
                  <span
                    className={`text-sm font-bold tracking-wide ${hero ? 'text-white' : 'text-[var(--color-ink)]'}`}
                  >
                    {l.symbol}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Populated in place by the quotes widget. */}
                  <span
                    className="stock-quotes flex items-baseline gap-2 font-sans text-sm tabular-nums"
                    data-provider={l.provider}
                    data-exchange={l.providerExchange}
                    data-symbol={l.providerSymbol}
                  >
                    <span
                      data-kind="current"
                      data-prefix={l.prefix}
                      className={`font-semibold ${hero ? 'text-white' : 'text-[var(--color-ink)]'}`}
                    />
                    <span
                      data-kind="percent_change"
                      data-postfix="%"
                      className={`text-xs ${hero ? 'text-[var(--color-gold-soft)]' : 'text-[var(--color-teal-700)]'}`}
                    />
                  </span>

                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${l.label} quote on ${l.hrefLabel} (opens in a new tab)`}
                    className={`shrink-0 transition-colors ${
                      hero ? 'text-white/60 hover:text-white' : 'text-[var(--color-slate)] hover:text-[var(--color-teal-900)]'
                    }`}
                  >
                    <ArrowUpRight size={14} aria-hidden />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </ProactiveQuotes>

        {hero ? (
          <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-2 sm:px-5">
            <p className="text-[0.5625rem] leading-tight text-white/60">
              {failed
                ? 'Live quotes unavailable'
                : loaded
                  ? 'Delayed, third-party data'
                  : 'Loading delayed quotes…'}
            </p>
            <Link
              href="/investors/overview/"
              className="group inline-flex shrink-0 items-center gap-1.5 text-[0.6875rem] font-semibold text-white transition-colors hover:text-[var(--color-gold-soft)]"
            >
              View Stock Information
              <ArrowRight
                size={12}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
        ) : (
          <p className="px-4 pb-3 pt-2.5 text-[0.625rem] leading-relaxed text-[var(--color-slate)] sm:px-5">
            {failed
              ? 'Live quotes are unavailable. Follow a symbol for the official exchange quote.'
              : loaded
                ? 'Quotes are delayed and supplied by third parties. Follow a symbol for the official quote.'
                : 'Loading delayed quotes…'}
          </p>
        )}
      </div>
    </>
  );
}
