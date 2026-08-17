# Bowei Xu - Personal Portfolio

A bilingual English / Chinese personal portfolio website built with vanilla HTML, CSS, and JavaScript. No build step, no dependencies. Hosted on GitHub Pages.

## Live Site

[https://antoinexu.github.io](https://antoinexu.github.io)

## Pages

| Page | Description |
|------|-------------|
| Home | Short professional introduction, headline metrics, and resume downloads |
| Experience | Work history at Fuel Cell Store and DigiFinex |
| Projects | AI ERP assistant, internal operations platform (ERP/WMS/MES), warehouse subsystem, and OpenCart upgrade |
| Skills | Technical stack and cloud tools |
| About | Background, education, what I'm looking for, and Go credentials |
| Contact | Email, GitHub, and LinkedIn |
| Case studies | Sanitized write-ups for the two halves of the internal operations platform (order-to-shipment and warehouse) and the OpenCart upgrade |
| 404 | Served by GitHub Pages for unknown paths; uses root-absolute links so it works at any depth |

## Features

- Bilingual support with localStorage language persistence; the tab title and meta description switch with the content
- Every view has its own URL: `?lang=zh` selects Chinese, and the language a visitor is reading is written back to the address bar, so any view can be linked to
- Typing animation on the home page
- Scroll fade-in animations across pages
- Downloadable English and Chinese resumes
- Responsive layout for desktop and mobile
- A `<main>` landmark, a skip-to-content link that works without JavaScript, keyboard focus rings, and `prefers-reduced-motion` support
- Per-page canonical URLs that follow the language, Open Graph / Twitter tags, and JSON-LD structured data; the sitemap lists English URLs only, since `?lang=zh` renders client-side and has no crawlable HTML of its own

## Structure

| File | Purpose |
|------|---------|
| `*.html` | One file per page; each holds its own English markup and page-specific translation script |
| `translations*.json` | Per-page English and Chinese strings, fetched at runtime |
| `i18n.js` | Language persistence and `?lang=` URL syncing, canonical/`og:` language switching, page chrome (skip link, header labels, footer), nav and metadata translation, and the translation helpers below |
| `animations.js` | Mobile menu toggle and scroll reveal |
| `architecture.js` | Inline SVG architecture diagrams for the platform and warehouse case studies |
| `style.css` | All page styling |
| `fonts.css`, `fonts/` | Self-hosted Poppins subsets |
| `icons.css` | Self-hosted icon subset (Boxicons glyphs as inline SVG CSS masks) |

### Adding or renaming a translated string

English lives in the HTML, Chinese lives in the JSON, and the two are kept in
sync by hand — so nothing on a page may depend on that sync being perfect. Every
page applies its strings through the helpers in `i18n.js`:

| Helper | Use |
|--------|-----|
| `loadTranslations(file, lang, apply, onError)` | Fetches the file, translates nav and page metadata, then calls `apply(strings, lang)` for the body; ignores responses superseded by a later language switch |
| `setText(target, value, label)` | Sets one element's text; `target` is an id, a CSS selector, or an element |
| `setPills(target, values, label)` | Refills a pill/tag container from an array |
| `applyTranslations(strings, lang, apply)` | Same sequence as `loadTranslations` for pages whose strings are inline (`404.html`) |

A missing key, a missing element, a missing language block, a 404, or malformed
JSON degrades that one field to the English the page was served with and logs a
`[i18n]` warning naming it. The page never blanks, never prints `undefined`, and
never stops part way through. **A clean console on both languages means the JSON
and the HTML agree** — so check it after editing either side.

Page scripts should therefore iterate over what is in the DOM rather than over
what is in the JSON, so a card added to the HTML shows English until its
translation lands instead of disappearing.

Two things the helpers rely on, neither of them visible at the call site:

- `loadTranslations` stamps each fetch with `i18nRequestId` and drops any
  response that is no longer the newest. Switching language twice before the
  first file arrives would otherwise leave the page on whichever response
  happened to land last.
- `setText` and `setPills` restore the English a page was *served* with, taken
  from a snapshot captured the first time each element is translated. Anything
  that rewrites an element wholesale must therefore take its own snapshot with
  `i18nOriginal(el, prop)` **before** the first rewrite — as `renderBody()` in
  the case-study pages does — or the snapshot captures the previous render
  instead of the English.

### Editing a case study

The three `case-study-*.html` pages carry their English body **twice**: as static
markup inside `<div id="cs-body">` (so crawlers and non-JS clients see it) and in
`translations_case_study_*.json` (which the page script re-renders from on load
and on language switch). The JSON is the source of truth — after editing it,
regenerate the static markup with `tools/render-case-studies.py` so the two
cannot drift. Every other page keeps its English text only in the HTML, with the
JSON supplying Chinese.

The script rewrites everything from `#cs-back` through the close of
`<div id="cs-body">`. Anything that must survive a regeneration — such as the
`#cs-related` cross-links between the two platform case studies — has to sit
outside that block.

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- Self-hosted Poppins font subsets and icon glyphs (no third-party requests at runtime)
- GitHub Pages for hosting

## Contact

- Email: bowei_xu@outlook.com
- LinkedIn: https://www.linkedin.com/in/bowei-xu-132a3b1b9/
- GitHub: https://github.com/antoinexu/
