# Silver One Resources Inc. — website

A rebuild of [silverone.com](https://silverone.com) on Next.js 16, carrying over
the full content of the previous ProcessWire site: every news release since
2016, all three project pages, the complete document archive, management and
director biographies, investor resources and legal disclosures.

## Stack

| | |
|---|---|
| Framework | Next.js 16.4.0 (App Router, Turbopack) |
| React | 19.3.0 |
| Language | TypeScript 5.9 (strict) |
| Styling | Tailwind CSS 4.3 (CSS-first `@theme`) |
| Animation | Framer Motion 14 |
| Icons | lucide-react |

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve the production build
npm run lint         # eslint
npx tsc --noEmit     # type check
```

Copy `.env.example` to `.env.local` if you want to wire up contact-form
delivery. Nothing in it is required to build or run the site.

> **Restarting the production server:** Next writes content-hashed chunks on
> every build. If `next start` is still running while you rebuild, it keeps
> serving the old chunk names and returns 500s for them. Use
> `powershell -File scripts/prod-restart.ps1`, which stops the old process
> first.

## How content works

There is no CMS. The previous site was crawled once and converted into a
static, typed content layer under `src/content/*.json`:

| File | Contents |
|---|---|
| `news.json` | 140 news releases (2016‑08‑05 → 2026‑10‑01) with full body HTML, attached PDFs and figures |
| `projects.json` | Candelaria, Cherokee and Phoenix Silver, each as a set of tabbed sections with galleries, documents and videos |
| `team.json` | 4 management profiles, 5 directors |
| `documents.json` | 89 document entries / 165 files across 7 categories |
| `interviews.json` | 23 video interviews |
| `pages.json` | About, Why Silver?, Share Structure, Projects Overview, Contact, Disclaimer |
| `home.json` | Homepage imagery, summary copy and the featured video |

Read it through `src/lib/content.ts` (server only). Client components import
shapes from `src/lib/types.ts` and helpers from `src/lib/format.ts` — importing
a *value* from `content.ts` in a client component pulls the whole JSON corpus
into the browser bundle.

### Regenerating the content layer

The scripts in `scripts/` reproduce the migration from an archived crawl. They
are kept so the import can be re-run or audited; day-to-day development does
not need them.

```bash
node scripts/build-content.mjs   # archived HTML -> src/content/*.json
node scripts/stage-assets.mjs    # copy + downscale media into public/
node scripts/sweep-assets.mjs    # fetch any asset referenced but not yet local
node scripts/derive-crops.mjs    # trim the dead gradient off two legacy banners
```

`build-content.mjs` expects the crawl at the path in `SVE_RAW` (one HTML file
per page). `scripts/lib-html.mjs` holds the cleaning rules: it rewrites
`/site/assets/…` to `/assets/…`, maps legacy page paths onto the new routes,
strips UIkit markup and inline typography, and normalises heading levels so
each page has a valid outline.

## Assets

`public/assets/` holds everything migrated from the old site — 568 images and
292 PDFs, about 400 MB. They are served from this repo rather than linked back
to silverone.com, because this site replaces it. Sixteen oversized originals
(4–11 MB camera files) were resampled to 2400 px wide during staging, saving
86 MB with no visible loss; everything else is byte-identical to the source.

Both original logo files are preserved in `public/brand/`:
`logo-footer.png` (full colour, for light backgrounds) and `logo.png` (white,
for the dark footer). They are the files from the previous site, unmodified.

## Integrations

- **Market data** — the `proactive-quotes` / `proactive-charts` web components
  from `cdn.proactivedigital.solutions`, the same provider the previous site
  used. No key required. No price, change or volume figure is ever produced by
  this codebase; if the CDN fails, the panels show verified exchange symbols
  and links to the official quote pages.
- **Newsletter** — `POST /api/subscribe` relays to the company's existing
  Mailchimp audience server-side (the browser cannot post to `list-manage.com`
  directly) and returns Mailchimp's actual verdict.
- **Contact form** — a Server Action. Configure `CONTACT_WEBHOOK_URL`, or
  `RESEND_API_KEY` + `CONTACT_FROM_EMAIL`. Without either it reports honestly
  that the message was not sent.
- **Video** — YouTube and Vimeo embeds are click-to-load facades, so no
  third-party player loads until the visitor asks for it.
- **Search** — the header search covers the migrated content (news, projects,
  people, documents, pages). The previous site had none, so this indexes only
  what exists here; every hit resolves. The index is served from
  `/api/search-index` on first open, so it costs nothing on first paint.

## QA

Scripts under `scripts/` run against a **running production server**:

```bash
node scripts/qa-sweep.mjs          # status, console errors, overflow, headings, alt text
QA_WIDTHS=375,768,1024 node scripts/qa-sweep.mjs
node scripts/qa-interactions.mjs   # navigation, search, filters, tabs, lightbox, forms, redirects
node scripts/qa-a11y.mjs           # axe-core, WCAG 2.1 A/AA, incl. open modal states
node scripts/qa-links.mjs          # every internal link, image and PDF
node scripts/qa-content.mjs        # migrated content vs. the archived original
node scripts/measure.mjs           # per-band page geometry, for layout comparison
node scripts/shoot.mjs / 1440 --full --out home   # screenshot to .qa/
```

## URLs

Original paths are preserved, including trailing slashes (`trailingSlash: true`).
Where the old structure collapsed — project sub-pages became tabs, document
detail pages became category listings — `next.config.ts` carries permanent
redirects. New routes: `/documents/` (searchable library) and `/rss.xml`
(replacing the old `/rss`).

## Structure

```
src/
  app/            routes, mirroring the original URL shapes
  components/     SiteHeader, SiteFooter, cards, sections (FeatureRow,
                  FactCard, IconPoints, CtaBand, StatementBand), ProjectTabs,
                  LocatorMap, TeamGrid, SearchOverlay, galleries, forms…
  content/        generated JSON (see above)
  lib/
    site.ts       company facts, navigation, exchange listings, contact details
    types.ts      content shapes — client-safe
    format.ts     date helpers — client-safe
    content.ts    typed accessors over the JSON — server only
    metrics.ts    homepage figures, each with its dated source
    project-facts.ts  per-project attribute cards, transcribed from the
                  original project pages
scripts/          migration and QA tooling
public/
  assets/files/   migrated images and PDFs
  brand/          original logos and favicon
```
