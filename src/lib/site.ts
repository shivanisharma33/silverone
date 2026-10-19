/**
 * Single source of truth for company facts, navigation and verified market
 * identifiers. Every value here is carried over from silverone.com.
 */

export const SITE = {
  name: 'Silver One Resources Inc.',
  shortName: 'Silver One',
  tagline: 'Focused on the exploration and development of quality silver projects.',
  description:
    'Silver One Resources Inc. is focused on the exploration and development of quality silver projects in premier mining jurisdictions, with a portfolio of assets in Nevada and Arizona, USA.',
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://silverone.com',
  locale: 'en_CA',
  qualifiedPerson:
    'The technical content on this website has been reviewed and approved by Robert M. Cann, P. Geo, and a Qualified Person as defined by National Instrument 43-101.',
  exchangeDisclaimer:
    'The TSX Venture Exchange has not reviewed the information on this web site and does not accept responsibility for the adequacy or accuracy of its content.',
} as const;

/** Verified exchange listings. Prices are never hard-coded — see MarketPanel. */
export const LISTINGS = [
  {
    exchange: 'TSX-V',
    symbol: 'SVE',
    label: 'TSX-V: SVE',
    currency: 'CAD',
    prefix: '$',
    provider: 'morningstar',
    providerExchange: '7',
    providerSymbol: 'SVE',
    href: 'https://money.tmx.com/en/quote/SVE',
    hrefLabel: 'TMX Money',
  },
  {
    exchange: 'OTCQX',
    symbol: 'SLVRF',
    label: 'OTCQX: SLVRF',
    currency: 'USD',
    prefix: '$',
    provider: 'yahoo',
    providerExchange: 'OQX',
    providerSymbol: 'SLVRF',
    href: 'https://www.otcmarkets.com/stock/SLVRF/overview',
    hrefLabel: 'OTC Markets',
  },
  {
    exchange: 'FSE',
    symbol: 'BRK1',
    label: 'FSE: BRK1',
    currency: 'EUR',
    prefix: '€',
    provider: 'yahoo',
    providerExchange: 'FRA',
    providerSymbol: 'BRK1.F',
    // Börse Frankfurt addresses the security by ISIN (WKN A2AQ9Y).
    href: 'https://www.boerse-frankfurt.de/equity/CA8280621092',
    hrefLabel: 'Börse Frankfurt',
  },
] as const;

export const CONTACT = {
  office: {
    label: 'Head Office',
    org: 'Guinness Tower',
    lines: ['Suite 1000 - 1055 W Hastings St.', 'Vancouver, BC', 'Canada, V6E 2E9'],
    tel: '604-974-5274',
    telHref: 'tel:+16049745274',
    email: 'info@silverone.com',
  },
  ir: {
    label: 'Investor Relations',
    person: 'Gary Lindsay',
    lines: ['Suite 1000 - 1055 W Hastings St.', 'Vancouver, BC', 'Canada, V6E 2E9'],
    tel: '+1 (720) 273-6224',
    telHref: 'tel:+17202736224',
    email: 'gary@strata-star.com',
  },
  mapImage: '/assets/files/1057/hastings-street-location.png',
} as const;

export const SOCIAL = [
  { label: 'X', href: 'https://x.com/silveroneinc' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/10946111' },
  { label: 'Facebook', href: 'https://www.facebook.com/silveroneinc' },
  { label: 'Instagram', href: 'https://www.instagram.com/silveroneinc' },
] as const;

/** Mailchimp list the original site posted to — preserved verbatim. */
export const MAILCHIMP = {
  action:
    'https://silverone.us19.list-manage.com/subscribe/post?u=971e768aeaa285fb6d7f779a1&id=4b69c19b41&f_id=0014aae6f0',
  /** Mailchimp's bot-trap field; must stay empty on a genuine submission. */
  honeypot: 'b_971e768aeaa285fb6d7f779a1_4b69c19b41',
} as const;

export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { label: string; href: string; children?: NavLink[] };

export const NAV: NavGroup[] = [
  {
    label: 'Corporate',
    href: '/corporate/about-silver-one/',
    children: [
      { label: 'About Silver One', href: '/corporate/about-silver-one/', description: 'Who we are and what we own' },
      { label: 'Management', href: '/corporate/management/', description: 'Executive team and advisors' },
      { label: 'Directors', href: '/corporate/directors/', description: 'Board of directors' },
      { label: 'Financial Statements', href: '/corporate/financials-statements/', description: 'Quarterly and annual filings' },
    ],
  },
  {
    label: 'Projects',
    href: '/projects/overview/',
    children: [
      { label: 'Overview', href: '/projects/overview/', description: 'Portfolio summary' },
      { label: 'USA Projects', href: '/projects/usa-projects/', description: 'All three properties' },
      { label: 'Candelaria', href: '/projects/usa-projects/candelaria/', description: 'Nevada — flagship' },
      { label: 'Cherokee', href: '/projects/usa-projects/cherokee/', description: 'Nevada — exploration' },
      { label: 'Phoenix Silver', href: '/projects/usa-projects/silver_phoenix/', description: 'Arizona — high grade' },
    ],
  },
  {
    label: 'Investors',
    href: '/investors/',
    children: [
      { label: 'Investor Overview', href: '/investors/', description: 'Start here' },
      { label: 'Why Silver?', href: '/investors/why-silver/', description: 'The indispensable metal' },
      { label: 'Stock Information', href: '/investors/overview/', description: 'Charts and quotes' },
      { label: 'Share Structure', href: '/investors/share-structure/', description: 'Capital structure' },
      { label: 'Presentations', href: '/investors/presentations/', description: 'Corporate deck' },
      { label: 'Factsheet', href: '/investors/factsheets/', description: 'One-page summary' },
      { label: 'Interviews', href: '/investors/interviews/', description: 'Video library' },
      { label: 'AGM Material', href: '/investors/agm-material/', description: 'Meeting documents' },
      { label: 'ESTMA Reports', href: '/investors/estma_reports-2/', description: 'Payment transparency' },
      { label: 'LIFE', href: '/investors/life/', description: 'Listed issuer financing' },
      { label: 'Document Library', href: '/documents/', description: 'Everything in one place' },
    ],
  },
  {
    label: 'News',
    href: '/news/',
    children: [
      { label: 'All News Releases', href: '/news/', description: 'Complete archive since 2016' },
    ],
  },
  { label: 'Contact', href: '/contact/' },
];

/** Years present in the news archive; filled from content at render time. */
export const FOOTER_LEGAL: NavLink[] = [
  { label: 'Legal Notices', href: '/disclaimer/' },
  { label: 'Subscribe for Email Updates', href: '/contact/subscribe-for-email-updates/' },
  { label: 'RSS Feed', href: '/rss.xml' },
];
