/**
 * Headline figures shown in the homepage metrics strip.
 *
 * Every number below is transcribed from a dated Silver One disclosure and
 * carries its source so the claim can be checked. Nothing here is estimated,
 * rounded up, or projected — if a figure cannot be cited it does not belong
 * in this file.
 *
 * Source: "Silver One Resources Announces Upgrade Of Leach Pad Resources To
 * Measured & Indicated At Candelaria", 27 August 2026 — Candelaria project
 * resources from open pit, underground, stockpiles and heap-leach pads.
 */

export const RESOURCE_SOURCE = {
  label: 'News release, August 27, 2026',
  href: '/news/2026/silver-one-resources-announces-upgrade-of-leach-pad-resources-to-measured-indicated-at-candelaria/',
} as const;

export type Metric = {
  /** Numeric part, for the count-up animation. */
  value: number;
  decimals: number;
  suffix: string;
  prefix?: string;
  label: string;
  /** Composition and reporting basis — exposed as the link's accessible
   *  description and title rather than a third line, which the approved
   *  strip does not have. The same facts appear in RESOURCE_NOTE below. */
  detail: string;
  icon: 'resource' | 'inferred' | 'pin' | 'globe';
  href?: string;
};

export const METRICS: Metric[] = [
  {
    value: 126.6,
    decimals: 1,
    suffix: 'M',
    label: 'AgEq — Measured & Indicated',
    detail: '120.7 Moz Ag + 242.0 koz Au · Candelaria, Aug 2026',
    icon: 'resource',
    href: RESOURCE_SOURCE.href,
  },
  {
    value: 13.4,
    decimals: 1,
    suffix: 'M',
    label: 'AgEq — Inferred',
    detail: '12.6 Moz Ag + 33.8 koz Au · Candelaria, Aug 2026',
    icon: 'inferred',
    href: RESOURCE_SOURCE.href,
  },
  {
    value: 3,
    decimals: 0,
    suffix: '',
    label: 'Key Projects',
    detail: 'Candelaria · Cherokee · Phoenix Silver',
    icon: 'pin',
    href: '/projects/usa-projects/',
  },
  {
    value: 0,
    decimals: 0,
    suffix: 'USA',
    label: 'Tier-1 Mining Jurisdictions',
    detail: 'Nevada and Arizona, United States',
    icon: 'globe',
    href: '/projects/overview/',
  },
];

/**
 * Mandatory qualifier shown beneath the strip, kept to one line so the strip
 * matches the approved proportions. Each metric's grade composition is
 * carried in `detail` (exposed as the tile's accessible description and
 * title) and stated in full in the cited news release.
 */
export const RESOURCE_NOTE =
  'Mineral resources are not mineral reserves and do not have demonstrated economic viability. Candelaria project totals — open pit, underground, stockpiles and heap-leach pads.';
