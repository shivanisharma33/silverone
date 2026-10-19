import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // silverone.com served every page with a trailing slash. Keeping that shape
  // means the migrated routes are byte-identical to the URLs already indexed.
  trailingSlash: true,

  cacheComponents: true,
  partialPrefetching: true,

  // Tailwind v4 is compiled by its Turbopack loader rather than PostCSS.
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 828, 1080, 1200, 1600, 1920, 2048],
    imageSizes: [96, 128, 160, 256, 384],
    remotePatterns: [
      // YouTube poster frames for the video facades.
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
    ],
  },

  async redirects() {
    return [
      /* --- section landing pages that no longer have their own content --- */
      { source: '/corporate', destination: '/corporate/about-silver-one/', permanent: true },
      { source: '/projects', destination: '/projects/overview/', permanent: true },
      { source: '/contact/send-a-message-1', destination: '/contact/', permanent: true },

      /* --- misspelled legacy path kept alive --- */
      {
        source: '/corporate/financial-statements',
        destination: '/corporate/financials-statements/',
        permanent: true,
      },

      /* --- project sub-pages are now tabs on the project page --- */
      {
        source: '/projects/usa-projects/candelaria/:sub((?!$).*)',
        destination: '/projects/usa-projects/candelaria/',
        permanent: true,
      },
      {
        source: '/projects/usa-projects/cherokee/:sub((?!$).*)',
        destination: '/projects/usa-projects/cherokee/',
        permanent: true,
      },
      {
        source: '/projects/usa-projects/silver_phoenix/:sub((?!$).*)',
        destination: '/projects/usa-projects/silver_phoenix/',
        permanent: true,
      },

      /* --- legacy project aliases the old CMS also answered on --- */
      {
        source: '/projects/:slug(candelaria|cherokee|silver_phoenix)',
        destination: '/projects/usa-projects/:slug/',
        permanent: true,
      },
      { source: '/projects/silver-phoenix', destination: '/projects/usa-projects/silver_phoenix/', permanent: true },

      /* --- document detail pages collapse into their category index --- */
      {
        source: '/corporate/financials-statements/:year/:doc+',
        destination: '/corporate/financials-statements/',
        permanent: true,
      },
      {
        source: '/investors/estma_reports-2/:doc+',
        destination: '/investors/estma_reports-2/',
        permanent: true,
      },
      { source: '/investors/presentations/:doc+', destination: '/investors/presentations/', permanent: true },
      { source: '/investors/factsheets/:doc+', destination: '/investors/factsheets/', permanent: true },
      { source: '/investors/agm-material/:doc+', destination: '/investors/agm-material/', permanent: true },
      { source: '/investors/life/:doc+', destination: '/investors/life/', permanent: true },

      /* --- individual bios: keep the legacy flat paths working --- */
      { source: '/corporate/directors/claudia-tornquist-1', destination: '/corporate/directors/', permanent: true },

      /* --- feeds --- */
      { source: '/rss', destination: '/rss.xml', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        // Migrated PDFs and imagery are immutable once published.
        source: '/assets/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

export default nextConfig;
