import type { ComponentType, HTMLAttributes, ReactNode } from 'react';

/**
 * Typed handles for Silver One's existing Proactive Digital market-data web
 * components, loaded from cdn.proactivedigital.solutions.
 *
 * They are custom elements, not React components, so they are cast rather
 * than declared — which keeps the typing local instead of augmenting the
 * global JSX namespace.
 */

type Base = HTMLAttributes<HTMLElement> & { children?: ReactNode };

export type ProactiveChartsProps = Base & {
  'chart-engine'?: string;
  provider?: string;
  exchange?: string;
  symbol?: string;
  currency?: string;
  height?: string;
  'default-range'?: string;
  'range-switcher-enable'?: string;
  'rangeselector-enable'?: string;
  'navigator-enable'?: string;
  showcredit?: string;
  linestroke?: string;
  linefill?: string;
  barfill?: string;
  bgcolor?: string;
  volumelabel?: string;
};

export const ProactiveQuotes = 'proactive-quotes' as unknown as ComponentType<Base>;
export const ProactiveCharts = 'proactive-charts' as unknown as ComponentType<ProactiveChartsProps>;

export const QUOTES_SCRIPT =
  'https://cdn.proactivedigital.solutions/lib/proactive-quotes/proactive-quotes.min.js';
export const CHARTS_SCRIPT =
  'https://cdn.proactivedigital.solutions/lib/proactive-charts/proactive-charts.min.js';
