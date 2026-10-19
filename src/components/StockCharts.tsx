'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { LISTINGS } from '@/lib/site';

import {
  CHARTS_SCRIPT,
  ProactiveCharts,
  ProactiveQuotes,
  QUOTES_SCRIPT,
} from '@/components/proactive';

const FIELDS = [
  ['Current', 'current'],
  ['Open', 'open'],
  ['Previous Close', 'previous_close'],
  ['Change', 'change'],
  ['Percent Change', 'percent_change'],
  ['Day High', 'high'],
  ['Day Low', 'low'],
  ['52-Week High', 'year_high'],
  ['52-Week Low', 'year_low'],
  ['Bid', 'bid'],
  ['Ask', 'ask'],
  ['Market Cap', 'market_cap'],
  ['Volume', 'volume'],
  ['Updated', 'updated_at'],
] as const;

/**
 * Stock charts and quote tables for all three listings.
 *
 * Rendering is delegated to the company's existing Proactive Digital widgets,
 * which fetch from Morningstar / Yahoo. No price, change or volume figure is
 * ever produced by this codebase — if the widget cannot load, the tables stay
 * empty and the notice below says so.
 */
export function StockCharts() {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!customElements.get('proactive-charts')) setFailed(true);
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Script src={QUOTES_SCRIPT} type="module" strategy="lazyOnload" onError={() => setFailed(true)} />
      <Script src={CHARTS_SCRIPT} type="module" strategy="lazyOnload" onError={() => setFailed(true)} />

      <h2 className="sr-only">Share price by exchange</h2>

      <div role="tablist" aria-label="Exchange listings" className="flex flex-wrap gap-2">
        {LISTINGS.map((l, i) => (
          <button
            key={l.symbol}
            role="tab"
            id={`tab-${l.symbol}`}
            aria-selected={active === i}
            aria-controls={`panel-${l.symbol}`}
            onClick={() => setActive(i)}
            className={`border px-4 py-2.5 text-sm font-semibold transition-colors ${
              active === i
                ? 'border-[var(--color-teal-900)] bg-[var(--color-teal-900)] text-white'
                : 'border-[var(--color-stone)] bg-white text-[var(--color-ink)] hover:border-[var(--color-teal-900)]'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {LISTINGS.map((l, i) => (
        <div
          key={l.symbol}
          role="tabpanel"
          id={`panel-${l.symbol}`}
          aria-labelledby={`tab-${l.symbol}`}
          hidden={active !== i}
          className="mt-8"
        >
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="card p-4 lg:col-span-8 lg:p-6">
              {failed ? (
                <div className="grid h-[400px] place-items-center text-center">
                  <div>
                    <p className="text-sm text-[var(--color-slate)]">
                      The price chart could not be loaded.
                    </p>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline mt-4"
                    >
                      View on {l.hrefLabel}
                      <ArrowUpRight size={14} aria-hidden />
                    </a>
                  </div>
                </div>
              ) : (
                <ProactiveCharts
                  chart-engine="highcharts"
                  provider={l.provider}
                  exchange={l.providerExchange}
                  symbol={l.providerSymbol}
                  height="400"
                  default-range="1y"
                  range-switcher-enable="true"
                  rangeselector-enable="false"
                  navigator-enable="false"
                  showcredit="false"
                  linestroke="#0B7890"
                  linefill="#0B7890"
                  barfill="#5F6B73"
                  bgcolor="#ffffff"
                  volumelabel="Volume"
                />
              )}
            </div>

            <div className="lg:col-span-4">
              <div className="card p-5 lg:p-6">
                <h3 className="font-serif text-xl">{l.label}</h3>
                <p className="mt-1 text-xs text-[var(--color-slate)]">Quoted in {l.currency}</p>

                <ProactiveQuotes>
                  <dl
                    className="stock-quotes mt-5 divide-y divide-[var(--color-stone)] text-sm"
                    data-provider={l.provider}
                    data-exchange={l.providerExchange}
                    data-symbol={l.providerSymbol}
                  >
                    {FIELDS.map(([label, kind]) => (
                      <div key={kind} className="flex items-baseline justify-between gap-4 py-2">
                        <dt className="text-[var(--color-slate)]">{label}</dt>
                        <dd
                          data-kind={kind}
                          {...(kind === 'percent_change' ? { 'data-postfix': '%' } : {})}
                          className="font-medium tabular-nums text-[var(--color-ink)]"
                        />
                      </div>
                    ))}
                  </dl>
                </ProactiveQuotes>

                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline mt-6 w-full"
                >
                  Official quote — {l.hrefLabel}
                  <ArrowUpRight size={14} aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      <p className="mt-8 text-xs leading-relaxed text-[var(--color-slate)]">
        Market data is supplied by third parties (Morningstar and Yahoo Finance) and is delayed. It
        is provided for information only and is not a solicitation or an official record. For the
        definitive quote, follow the exchange link for each listing. Blank fields indicate that the
        data provider has not returned a value.
      </p>
    </>
  );
}
