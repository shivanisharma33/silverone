/**
 * Migration script: turns the archived silverone.com HTML into the structured
 * JSON content layer under src/content. Re-runnable; reads from the local crawl.
 */
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { assetUrl, cleanHtml, textOf, slugify, parseDate } from './lib-html.mjs';

const RAW = process.env.SVE_RAW
  || 'C:/Users/pc/AppData/Local/Temp/claude/c--Users-pc-Desktop-silver-one/81f576a4-0b7d-4d0f-bc1e-80aa93a4b3f5/scratchpad/raw';
const OUT = path.join(process.cwd(), 'src/content');
fs.mkdirSync(OUT, { recursive: true });

const load = (f) => cheerio.load(fs.readFileSync(path.join(RAW, f), 'utf8'));
const has = (f) => fs.existsSync(path.join(RAW, f));
const files = fs.readdirSync(RAW).filter((f) => f.endsWith('.html'));
const write = (name, data) => {
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 1));
  const n = Array.isArray(data) ? data.length : Object.keys(data).length;
  console.log(`  ${name.padEnd(20)} ${n} entries`);
};

const DASH = '[\\u2010-\\u2015\\u2212-]';

/**
 * Trim the standard news-release preamble so a card preview opens on the
 * substance rather than on the dateline and the ticker boilerplate. Truncates
 * on a word boundary and keeps sentences intact where it can.
 */
function makeExcerpt(plain, max = 220) {
  let t = plain.replace(/^\s*NOT FOR (?:DISTRIBUTION|RELEASE)[^.]*\.?\s*/i, '').trim();

  // Nearly every release introduces itself with a dateline followed by
  // `... (“Silver One” or the “Company”)`. Anything before that closing marker
  // is boilerplate, so start the preview after it when it appears up front.
  const marker = /(?:or the\s*[“"']?Company[”"']?\s*[)”"']*)/i;
  const hit = t.match(marker);
  if (hit && hit.index !== undefined && hit.index < 400) {
    t = t.slice(hit.index + hit[0].length);
  } else {
    // Fall back to stripping a plain leading dateline.
    t = t
      .replace(new RegExp(`^\\s*[A-Z][A-Za-z.\\s]{2,34},\\s*[A-Za-z.\\s]{2,34}\\s*${DASH}+\\s*`), '')
      .replace(new RegExp(`^\\s*[A-Za-z]+\\s+\\d{1,2},\\s*\\d{4}\\s*${DASH}+\\s*`), '');
  }

  t = t
    .replace(/^[\s,;:.–—-]+/, '')
    // Releases that skip the "or the Company" marker still open with the name
    // and ticker block.
    .replace(/^Silver One Resources Inc\.?\s*(\([^)]*\)\s*)*/i, '')
    .replace(/^[\s,;:.–—-]+/, '')
    .replace(/^(?:is |are |has |have )?(?:very |extremely |particularly )?(?:pleased|excited|delighted|proud)\s+to\s+/i, '')
    .replace(/^(?:hereby\s+)?(?:announces?|announced|reports?|reported|wishes to announce|advises)\s+(?:that\s+)?/i, '')
    .replace(/^(?:today\s+)/i, '')
    .replace(/^[\s,;:.–—-]+/, '')
    .trim();

  if (t.length < 60) t = plain.trim();
  t = t.charAt(0).toUpperCase() + t.slice(1);
  if (t.length <= max) return t;

  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).replace(/[,;:\s]+$/, '') + '…';
}

/* ----------------------------------------------------------------- NEWS -- */
const news = [];
for (const f of files.filter((n) => /^news__\d{4}__/.test(n))) {
  const $ = load(f);
  const art = $('#page-body article.uk-article');
  if (!art.length) continue;
  const meta = art.find('.uk-article-meta');
  const headline = meta.find('h1').first().text().replace(/\s+/g, ' ').trim();
  const subhead = meta.find('h2').first().text().replace(/\s+/g, ' ').trim();
  const dateLabel = meta.find('h4').first().text().trim();
  const docs = art
    .find('.uk-card a')
    .map((_, e) => ({
      label: $(e).text().replace(/\s+/g, ' ').trim() || 'View PDF',
      href: assetUrl($(e).attr('href')),
    }))
    .get()
    .filter((d) => d.href);
  const html = cleanHtml(art.find('.uk-text-justify').html() || '', { defaultAlt: headline });
  const [, year, slug] = f.replace(/\.html$/, '').split('__');
  const $c = cheerio.load(html, null, false);
  const images = $c('img')
    .map((_, e) => ({ src: $c(e).attr('src'), alt: ($c(e).attr('alt') || '').trim() }))
    .get();
  news.push({
    slug,
    year,
    date: parseDate(dateLabel) || `${year}-01-01`,
    dateLabel,
    headline,
    subhead,
    html,
    docs,
    images,
    excerpt: makeExcerpt(textOf(html)),
    sourceUrl: `https://silverone.com/news/${year}/${slug}/`,
  });
}
news.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
write('news.json', news);

/* ------------------------------------------------------------- PROJECTS -- */
/** The project landing pages are UIkit tab switchers: labels in the first
 *  <ul>, one panel per tab in <ul class="uk-switcher">. */
function extractTabs(file) {
  const $ = load(file);
  const body = $('#page-body');
  const labels = body
    .children('ul')
    .first()
    .find('> li')
    .map((_, e) => $(e).text().trim())
    .get();
  const tabs = [];
  body.find('ul.uk-switcher > li').each((i, el) => {
    const $el = $(el);
    const label = labels[i] || `Section ${i + 1}`;

    const docs = [];
    $el.find('div[uk-grid]').each((_, g) => {
      const $g = $(g);
      const date = $g.find('p.article').first().text().trim();
      const title = $g.children('div').eq(1).text().replace(/\s+/g, ' ').trim();
      const links = $g
        .find('a')
        .map((_, a) => ({
          label:
            $(a).find('.uk-text-small').text().trim() ||
            $(a).text().replace(/\s+/g, ' ').trim() ||
            'PDF',
          href: assetUrl($(a).attr('href')),
          size: (($(a).attr('title') || '').match(/\(([^)]*)\)\s*$/) || [])[1] || '',
        }))
        .get()
        .filter((l) => l.href);
      if (title && links.length) {
        docs.push({ date, dateIso: parseDate(date), title, links });
        $g.remove();
      }
    });

    // Pull video embeds out of the body. Rendering them as eager iframes
    // loads third-party players on every visit, and at least one of the
    // source embeds is a private Vimeo video that 401s — so these become
    // click-to-load facades instead.
    const videos = [];
    $el.find('iframe').each((_, f) => {
      const src = $(f).attr('src') || '';
      if (!src) return;
      const yt = src.match(/(?:youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]+)/);
      const vm = src.match(/player\.vimeo\.com\/video\/(\d+)/);
      videos.push({
        provider: yt ? 'youtube' : vm ? 'vimeo' : 'other',
        id: yt ? yt[1] : vm ? vm[1] : null,
        src,
        watchUrl: yt
          ? `https://www.youtube.com/watch?v=${yt[1]}`
          : vm
            ? `https://vimeo.com/${vm[1]}`
            : src,
        title: $(f).attr('title') || '',
      });
      $(f).remove();
    });

    const gallery = [];
    $el.find('a[href]').each((_, a) => {
      const $a = $(a);
      const href = $a.attr('href') || '';
      const img = $a.find('img').first();
      if (img.length && /\.(jpe?g|png|gif|webp)$/i.test(href)) {
        gallery.push({
          src: assetUrl(href),
          thumb: assetUrl(img.attr('src')),
          caption: (img.attr('alt') || $a.attr('title') || '').replace(/\s+/g, ' ').trim(),
        });
        $a.remove();
      }
    });

    tabs.push({
      id: slugify(label),
      label,
      html: cleanHtml($el.html() || ''),
      docs,
      gallery,
      videos,
    });
  });
  return { $, tabs };
}

const PROJECT_META = {
  candelaria: {
    file: 'projects__usa-projects__candelaria.html',
    name: 'Candelaria',
    location: 'Nevada, USA',
    state: 'Nevada',
    tagline: 'Flagship project with significant silver resources and exploration upside.',
  },
  cherokee: {
    file: 'projects__usa-projects__cherokee.html',
    name: 'Cherokee',
    location: 'Nevada, USA',
    state: 'Nevada',
    tagline: 'Silver-copper-gold exploration project with significant potential.',
  },
  silver_phoenix: {
    file: 'projects__usa-projects__silver_phoenix.html',
    name: 'Phoenix Silver',
    location: 'Arizona, USA',
    state: 'Arizona',
    tagline: 'High-grade native silver project in the Arizona Silver Belt.',
  },
};

/**
 * Two original banners were authored with a large empty gradient beneath the
 * photograph, which leaves grey in landscape crops. scripts/derive-crops.mjs
 * trims that dead area; the pixels are otherwise untouched.
 */
const DERIVED_BANNERS = {
  silver_phoenix: '/assets/derived/phoenix-silver-specimens.jpg',
};

const projects = [];
for (const [slug, m] of Object.entries(PROJECT_META)) {
  const { $, tabs } = extractTabs(m.file);
  const bm = ($('#page-banner').attr('style') || '').match(/url\(["']?([^"')]+)["']?\)/);
  projects.push({
    slug,
    name: m.name,
    location: m.location,
    state: m.state,
    tagline: m.tagline,
    href: `/projects/usa-projects/${slug}/`,
    pageTitle: $('#page-title h1.header').first().text().trim(),
    banner: DERIVED_BANNERS[slug] ?? (bm ? assetUrl(bm[1]) : null),
    metaDesc: $('meta[name="description"]').attr('content') || '',
    tabs,
    sourceUrl: `https://silverone.com/projects/usa-projects/${slug}/`,
  });
}
write('projects.json', projects);

/* ----------------------------------------------------------------- TEAM -- */
function bios(file) {
  const $ = load(file);
  return $('#page-body .bio')
    .map((_, el) => {
      const $el = $(el);
      const name = $el.find('h2').first().text().trim();
      const role = $el.find('h3').first().text().replace(/\s+/g, ' ').trim();
      $el.find('h2, h3').remove();
      const html = cleanHtml($el.html() || '');
      return {
        name,
        slug: slugify(name),
        role,
        html,
        excerpt: textOf(html).slice(0, 170).trim() + '\u2026',
      };
    })
    .get()
    .filter((b) => b.name);
}
write('team.json', {
  management: bios('corporate__management.html'),
  directors: bios('corporate__directors.html'),
});

/* ------------------------------------------------------------ DOCUMENTS -- */
/** Shared "document row" markup: date | title | one or more download links. */
function docRows(file) {
  if (!has(file)) return [];
  const $ = load(file);
  const rows = [];
  $('#page-body div[uk-grid]').each((_, g) => {
    const $g = $(g);
    const date = $g.find('p.article').first().text().trim();
    const title = $g.children('div').eq(1).text().replace(/\s+/g, ' ').trim();
    const links = $g
      .find('a')
      .map((_, a) => ({
        label:
          $(a).find('.uk-text-small').text().trim() ||
          $(a).text().replace(/\s+/g, ' ').trim() ||
          'PDF',
        href: assetUrl($(a).attr('href')),
        size: (($(a).attr('title') || '').match(/\(([^)]*)\)\s*$/) || [])[1] || '',
      }))
      .get()
      .filter((l) => l.href);
    const group = $g.closest('.uk-accordion-content').prev('.uk-accordion-title').text().trim();
    if (title && links.length) rows.push({ date, dateIso: parseDate(date), title, links, group });
  });
  return rows;
}

const documents = {
  presentations: docRows('investors__presentations.html'),
  factsheets: docRows('investors__factsheets.html'),
  financials: docRows('corporate__financials-statements.html'),
  agm: docRows('investors__agm-material.html'),
  estma: docRows('investors__estma_reports-2.html'),
  life: docRows('investors__life.html'),
  technical: [],
};
for (const p of projects) {
  for (const t of p.tabs) {
    for (const d of t.docs) {
      documents.technical.push({ ...d, project: p.name, projectSlug: p.slug });
    }
  }
}
{
  const $ = load('investors__presentations.html');
  const img = $('#page-body img').first().attr('src');
  if (img && documents.presentations[0]) documents.presentations[0].cover = assetUrl(img);
}
write('documents.json', documents);

/* ----------------------------------------------------------- INTERVIEWS -- */
const interviews = [];
{
  const $ = load('investors__interviews.html');
  const seen = new Set();
  $('#page-body a[href*="youtu"]').each((_, a) => {
    const $a = $(a);
    const href = $a.attr('href');
    const text = $a.text().replace(/\s+/g, ' ').trim();
    if (!text || parseDate(text)) return; // the date cell links to the same video
    if (seen.has(text)) return;
    seen.add(text);
    const row = $a.closest('div[uk-grid], tr, li, p');
    const dateTxt = row.find('a').first().text().trim();
    const by = text.match(/^(.*?)\s+by\s+([^,]+)$/i);
    interviews.push({
      title: by ? by[1].trim() : text,
      publisher: by ? by[2].trim() : '',
      dateLabel: dateTxt,
      date: parseDate(dateTxt),
      url: href,
      videoId: (href.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/) || [])[1] || null,
    });
  });
}
interviews.sort((a, b) => ((a.date || '') < (b.date || '') ? 1 : -1));
write('interviews.json', interviews);

/* --------------------------------------------------------- SIMPLE PAGES -- */
function simplePage(file) {
  const $ = load(file);
  const bm = ($('#page-banner').attr('style') || '').match(/url\(["']?([^"')]+)["']?\)/);
  const body = $('#page-body');
  return {
    title: $('#page-title h1.header').first().text().trim(),
    metaTitle: $('head title').text().replace(/\s*\|\s*Silver One Resources Inc\.?$/, '').trim(),
    metaDesc: $('meta[name="description"]').attr('content') || '',
    banner: bm ? assetUrl(bm[1]) : null,
    html: cleanHtml(body.html() || ''),
    images: body
      .find('img')
      .map((_, e) => ({ src: assetUrl($(e).attr('src')), alt: ($(e).attr('alt') || '').trim() }))
      .get(),
  };
}
write('pages.json', {
  about: simplePage('corporate__about-silver-one.html'),
  whySilver: simplePage('investors__why-silver.html'),
  shareStructure: simplePage('investors__share-structure.html'),
  disclaimer: simplePage('disclaimer.html'),
  projectsOverview: simplePage('projects__overview.html'),
  contact: simplePage('contact.html'),
});

/* ----------------------------------------------------------------- HOME -- */
{
  const $ = load('index.html');
  const videoSrc = $('#page-body iframe').first().attr('src') || '';
  const features = [];
  $('.feature').each((_, el) => {
    const $el = $(el);
    const m = ($el.attr('style') || '').match(/url\(([^)\s]+)/);
    features.push({
      id: $el.attr('id'),
      bg: m ? assetUrl(m[1].replace(/['"]/g, '')) : null,
      heading: $el.find('h2').first().text().trim(),
    });
  });
  write('home.json', {
    metaDesc: $('meta[name="description"]').attr('content') || '',
    metaKeywords: $('meta[name="keywords"]').attr('content') || '',
    slides: $('#page-banner .uk-slideshow-items img')
      .map((_, e) => assetUrl($(e).attr('src')))
      .get(),
    summaryHtml: cleanHtml($('#summary .uk-padding-large').html() || ''),
    features,
    videoUrl: videoSrc,
    videoId: (videoSrc.match(/embed\/([A-Za-z0-9_-]+)/) || [])[1] || null,
    videoTitle: $('#feature-1 h2').first().text().trim(),
    aboutHtml: cleanHtml($('#feature-0 .uk-padding-large > div').html() || ''),
  });
}

console.log(
  `\nnews ${news.length} | projects ${projects.length} | interviews ${interviews.length}`
);
for (const [k, v] of Object.entries(documents)) console.log(`  documents.${k}: ${v.length}`);
