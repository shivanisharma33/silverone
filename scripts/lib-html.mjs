import * as cheerio from 'cheerio';

/** Normalize any legacy asset URL to the new local /assets/... path. */
export function assetUrl(u) {
  if (!u) return u;
  let s = String(u).trim();
  if (/^(mailto:|tel:|#|data:)/i.test(s)) return s;
  s = s.replace(/^https?:\/?\/?(www\.)?silverone\.com/i, '');
  s = s.replace(/^\/\/(www\.)?silverone\.com/i, '');
  if (/^https?:\/\//i.test(s)) return s; // genuinely external
  s = '/' + s.replace(/^\/+/, '');
  s = s.replace(/([^:])\/{2,}/g, '$1/');
  if (s.startsWith('/site/assets/')) return s.replace('/site/assets/', '/assets/');
  if (s.startsWith('/site/templates/img/')) return s.replace('/site/templates/img/', '/brand/');
  return s;
}

/** Map a legacy page path to its new route. */
export function pageUrl(u) {
  if (!u) return u;
  let s = String(u).trim();
  if (/^(mailto:|tel:|#|data:)/i.test(s)) return s;
  s = s.replace(/^https?:\/?\/?(www\.)?silverone\.com/i, '');
  if (/^https?:\/\//i.test(s)) return s;
  if (/\.(pdf|jpe?g|png|gif|webp|svg|docx?|xlsx?|zip)$/i.test(s)) return assetUrl(s);
  if (!s.startsWith('/')) return s;
  s = s.replace(/\/{2,}/g, '/');
  const m = {
    '/corporate/': '/corporate/about-silver-one/',
    '/projects/': '/projects/overview/',
    '/corporate/financial-statements/': '/corporate/financials-statements/',
    '/contact/send-a-message-1/': '/contact/',
  };
  if (m[s]) return m[s];
  // collapse financial-statement detail pages
  if (/^\/corporate\/financials-statements\/[^/]+\/.+/.test(s)) return '/corporate/financials-statements/';
  if (/^\/investors\/estma_reports-2\/.+/.test(s)) return '/investors/estma_reports-2/';
  if (/^\/investors\/presentations\/.+/.test(s)) return '/investors/presentations/';
  if (/^\/investors\/factsheets\/.+/.test(s)) return '/investors/factsheets/';
  if (/^\/investors\/agm-material\/.+/.test(s)) return '/investors/agm-material/';
  if (/^\/investors\/life\/.+/.test(s)) return '/investors/life/';
  // project sub-pages become tabs on the project page
  const proj = s.match(/^\/projects\/usa-projects\/(candelaria|cherokee|silver_phoenix)\/(.+)$/);
  if (proj) return `/projects/usa-projects/${proj[1]}/`;
  // legacy alias the old CMS also served: /projects/<name>/
  const alias = s.match(/^\/projects\/(candelaria|cherokee|silver_phoenix|silver-phoenix)\/?$/);
  if (alias) {
    const slug = alias[1] === 'silver-phoenix' ? 'silver_phoenix' : alias[1];
    return `/projects/usa-projects/${slug}/`;
  }
  return s;
}

const DROP_ATTRS = [
  'uk-grid', 'uk-icon', 'uk-toggle', 'uk-tooltip', 'data-uk-tooltip', 'uk-lightbox',
  'uk-switcher', 'uk-scrollspy', 'uk-cover', 'uk-slideshow', 'uk-img', 'uk-responsive',
  'border', 'cellpadding', 'cellspacing', 'bgcolor', 'valign', 'align', 'frameborder',
  'allowtransparency', 'hspace', 'vspace',
];

/**
 * Clean legacy body HTML: strip CMS/UIkit chrome and hard-coded typography so the
 * new design system controls presentation, while preserving semantics and content.
 */
export function cleanHtml(raw, opts = {}) {
  if (!raw) return '';
  const $ = cheerio.load(raw, null, false);

  $('script, style, noscript').remove();
  $('span.uk-margin-small-right, span[uk-icon]').remove();

  $('*').each((_, el) => {
    if (el.type !== 'tag') return;
    const $el = $(el);
    for (const a of DROP_ATTRS) $el.removeAttr(a);
    // strip presentational inline styles, keep nothing (design system owns type)
    $el.removeAttr('style');
    $el.removeAttr('width');
    $el.removeAttr('height');
    const cls = $el.attr('class');
    if (cls) {
      const keep = cls.split(/\s+/).filter((c) => !/^(uk-|js-)/.test(c));
      if (keep.length) $el.attr('class', keep.join(' '));
      else $el.removeAttr('class');
    }
  });

  // unwrap empty presentational spans/fonts
  $('font').each((_, el) => $(el).replaceWith($(el).html() || ''));
  $('span').each((_, el) => {
    const $el = $(el);
    if (!$el.attr('class') && !$el.attr('id')) $el.replaceWith($el.html() || '');
  });

  $('img').each((_, el) => {
    const $el = $(el);
    const src = $el.attr('src');
    if (src) $el.attr('src', assetUrl(src));
    if (!$el.attr('alt')) $el.attr('alt', opts.defaultAlt || '');
    $el.removeAttr('srcset').removeAttr('sizes').removeAttr('loading');
  });

  $('a').each((_, el) => {
    const $el = $(el);
    const href = $el.attr('href');
    if (href) $el.attr('href', pageUrl(href));
    const h = $el.attr('href') || '';
    if (/^https?:\/\//i.test(h)) $el.attr('target', '_blank').attr('rel', 'noopener noreferrer');
    else $el.removeAttr('target');
    // drop empty anchors
    if (!$el.text().trim() && !$el.find('img').length) $el.replaceWith($el.html() || '');
  });

  $('table').each((_, el) => $(el).addClass('data-table'));

  // The legacy CMS dropped straight to <h3>/<h4> inside page bodies and often
  // skipped levels, leaving gaps under the page <h1>. Remap the distinct
  // levels used in this block onto consecutive ones starting at <h2>, which
  // keeps the author's hierarchy but yields a valid document outline.
  const used = new Set();
  $('h1, h2, h3, h4, h5, h6').each((_, el) => used.add(Number(el.tagName[1])));
  if (used.size) {
    const order = [...used].sort((a, b) => a - b);
    const map = new Map(order.map((lvl, i) => [lvl, Math.min(6, i + 2)]));
    const needsChange = order.some((lvl) => map.get(lvl) !== lvl);
    if (needsChange) {
      $('h1, h2, h3, h4, h5, h6').each((_, el) => {
        const to = map.get(Number(el.tagName[1]));
        if (!to || to === Number(el.tagName[1])) return;
        const $el = $(el);
        $el.replaceWith(`<h${to}>${$el.html() || ''}</h${to}>`);
      });
    }
  }

  // remove now-empty wrappers
  for (let i = 0; i < 3; i++) {
    $('div, p, span').each((_, el) => {
      const $el = $(el);
      if (!$el.text().trim() && !$el.find('img, iframe, table, hr, br, a').length) $el.remove();
    });
  }

  return $.html().replace(/\s*\n\s*\n+/g, '\n').trim();
}

export function textOf(html) {
  if (!html) return '';
  return cheerio.load(html, null, false).text().replace(/\s+/g, ' ').trim();
}

export function slugify(s) {
  return String(s).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

const MONTHS = { january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11,
  jan:0,feb:1,mar:2,apr:3,jun:5,jul:6,aug:7,sep:8,sept:8,oct:9,nov:10,dec:11 };

/** Parse dates like "October 1, 2026" or "Sep 10, 2026" into ISO yyyy-mm-dd. */
export function parseDate(s) {
  if (!s) return null;
  const t = String(s).replace(/\u00a0/g, ' ').trim();
  const m = t.match(/([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/);
  if (m) {
    const mo = MONTHS[m[1].toLowerCase()];
    if (mo !== undefined) {
      const d = new Date(Date.UTC(+m[3], mo, +m[2]));
      return d.toISOString().slice(0, 10);
    }
  }
  const m2 = t.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m2) return `${m2[1]}-${m2[2]}-${m2[3]}`;
  return null;
}
