# Bowei Xu - Personal Portfolio

A bilingual English / Chinese personal portfolio website built with vanilla HTML, CSS, and JavaScript. No build step, no dependencies. Hosted on GitHub Pages.

## Live Site

[https://antoinexu.github.io](https://antoinexu.github.io)

## Pages

| Page | Description |
|------|-------------|
| Home | Short professional introduction, headline metrics, and resume downloads |
| Experience | Work history at Fuel Cell Store and DigiFinex |
| Projects | AI ERP assistant, inventory system, OpenCart upgrade, and internal ERP |
| Skills | Technical stack, cloud tools, and Go background |
| About | Background, education, what I'm looking for, and a note on Go |
| Contact | Email, GitHub, and LinkedIn |
| Case studies | Sanitized write-ups for the internal ERP, inventory system, and OpenCart upgrade |
| 404 | Served by GitHub Pages for unknown paths; uses root-absolute links so it works at any depth |

## Features

- Bilingual support with localStorage language persistence; the tab title and meta description switch with the content
- Typing animation on the home page
- Scroll fade-in animations across pages
- Downloadable English and Chinese resumes
- Responsive layout for desktop and mobile
- Skip-to-content link, keyboard focus rings, and `prefers-reduced-motion` support
- Per-page canonical URLs, Open Graph / Twitter tags, JSON-LD structured data, and a sitemap

## Structure

| File | Purpose |
|------|---------|
| `*.html` | One file per page; each holds its own English markup and page-specific translation script |
| `translations*.json` | Per-page English and Chinese strings, fetched at runtime |

### Editing a case study

The three `case-study-*.html` pages carry their English body **twice**: as static
markup inside `<div id="cs-body">` (so crawlers and non-JS clients see it) and in
`translations_case_study_*.json` (which the page script re-renders from on load
and on language switch). The JSON is the source of truth — after editing it,
regenerate the static markup so the two cannot drift. Every other page keeps its
English text only in the HTML, with the JSON supplying Chinese.
| `i18n.js` | Language persistence, shared footer, skip link, nav and metadata translation |
| `animations.js` | Mobile menu toggle and scroll reveal |
| `architecture.js` | Inline SVG architecture diagrams for the ERP and inventory case studies |
| `style.css` | All page styling |
| `fonts.css`, `fonts/` | Self-hosted Poppins subsets |
| `icons.css` | Self-hosted icon subset (Boxicons glyphs as inline SVG CSS masks) |

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- Self-hosted Poppins font subsets and icon glyphs (no third-party requests at runtime)
- GitHub Pages for hosting

## Contact

- Email: bowei_xu@outlook.com
- LinkedIn: https://www.linkedin.com/in/bowei-xu-132a3b1b9/
- GitHub: https://github.com/antoinexu/
