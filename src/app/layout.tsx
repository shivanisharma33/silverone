import type { Metadata, Viewport } from 'next';
import { DM_Serif_Display, Inter } from 'next/font/google';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { SITE, SOCIAL } from '@/lib/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Silver Exploration & Development`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: ['Silver One', 'Silver', 'TSX-V: SVE', 'Candelaria', 'Cherokee', 'Phoenix Silver', 'Nevada silver', 'Arizona silver'],
  applicationName: SITE.shortName,
  authors: [{ name: SITE.name }],
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': `${SITE.url}/rss.xml` },
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} | Silver Exploration & Development`,
    description: SITE.description,
    url: SITE.url,
    locale: SITE.locale,
    images: [
      {
        url: '/assets/files/1/home-banner-3-no-gradient_1_2-edited.jpg',
        width: 1200,
        height: 630,
        alt: 'Silver One Resources — Candelaria Project, Nevada',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@silveroneinc',
    title: `${SITE.name} | Silver Exploration & Development`,
    description: SITE.description,
    images: ['/assets/files/1/home-banner-3-no-gradient_1_2-edited.jpg'],
  },
  icons: {
    icon: [{ url: '/brand/favicon.png', type: 'image/png' }],
    apple: [{ url: '/brand/favicon.png' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  verification: { google: '_sX9lnSxn2yNh23KfViinlSvYuLfBfQHzdsnHrfysbc' },
};

export const viewport: Viewport = {
  themeColor: '#07566B',
  width: 'device-width',
  initialScale: 1,
};

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Corporation',
  name: SITE.name,
  alternateName: SITE.shortName,
  url: SITE.url,
  logo: `${SITE.url}/brand/logo-footer.png`,
  description: SITE.description,
  tickerSymbol: ['TSXV:SVE', 'OTCQX:SLVRF', 'FRA:BRK1'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Suite 1000 - 1055 W Hastings St.',
    addressLocality: 'Vancouver',
    addressRegion: 'BC',
    postalCode: 'V6E 2E9',
    addressCountry: 'CA',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'investor relations',
      telephone: '+1-720-273-6224',
      email: 'gary@strata-star.com',
    },
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: '+1-604-974-5274',
      email: 'info@silverone.com',
    },
  ],
  sameAs: SOCIAL.map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // Static, build-time constant — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
