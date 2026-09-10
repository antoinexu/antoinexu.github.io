# Bowei Xu - Personal Portfolio

A bilingual English / Chinese portfolio built with vanilla HTML, CSS, and
JavaScript. No build step, no dependencies, no third-party requests at runtime.
Hosted on GitHub Pages.

**Live site:** [antoinexu.github.io](https://antoinexu.github.io)

English lives in the HTML, Chinese lives in the JSON, and `?lang=zh` selects the
language and is written back to the address bar so any view can be linked to.

## Structure

| File | Purpose |
|------|---------|
| `*.html` | One file per page; each holds its own English markup and page-specific translation script |
| `translations*.json` | Per-page English and Chinese strings, fetched at runtime |
| `i18n.js` | Language persistence, `?lang=` URL syncing, canonical/`og:` switching, page chrome, nav and metadata translation, and the `setText` / `setPills` helpers |
| `animations.js` | Mobile menu toggle and scroll reveal |
| `architecture.js` | Inline SVG architecture diagrams and the stacked text fallback they use on narrow screens |
| `style.css` | All page styling |
| `fonts.css`, `fonts/` | Self-hosted IBM Plex Sans variable font |
| `icons.css` | Self-hosted icon subset (Boxicons glyphs as inline SVG CSS masks) |

## Two things to know before editing

**1. Four pages carry their English body twice.** The three `case-study-*.html`
pages and `architecture.html` ship static markup so crawlers and non-JS clients
can read it, and re-render the same body at runtime from a JSON file. For these
four the JSON is the source of truth. After editing it, regenerate the static
markup or the two will silently drift:

```
pip install playwright && playwright install chromium
python -m http.server 8765      # from the repo root, in another shell
python tools/render-case-studies.py
```

The script rewrites `#cs-back` through the close of `<div id="cs-body">`, and on
the architecture page `<h1 id="arch-title">` through the close of
`<div id="arch-body">`. Anything that must survive a regeneration, such as the
`#cs-related` cross-links, has to sit outside those blocks. Every other page
keeps its English only in the HTML, with the JSON supplying Chinese.

**2. A missing translation degrades to English, it never blanks.** A missing
key, a missing element, a 404, or malformed JSON falls back to the English the
page was served with and logs an `[i18n]` warning naming the field. So **a clean
console in both languages means the JSON and the HTML agree.** Check it after
editing either side. Page scripts iterate over what is in the DOM rather than
over what is in the JSON, so a card added to the HTML shows English until its
translation lands instead of disappearing.

Two non-obvious things the helpers rely on:

- `loadTranslations` stamps each fetch with `i18nRequestId` and drops responses
  that are no longer the newest, so switching language twice in a row cannot
  leave the page on whichever file happened to land last.
- `setText` and `setPills` restore the English a page was *served* with, from a
  snapshot taken the first time each element is translated. Anything that
  rewrites an element wholesale must take its own snapshot with
  `i18nOriginal(el, prop)` **before** the first rewrite, as `renderBody()` does,
  or the snapshot captures the previous render instead of the English.

## Contact

- Email: bowei_xu@outlook.com
- LinkedIn: https://www.linkedin.com/in/bowei-xu-132a3b1b9/
- GitHub: https://github.com/antoinexu/
