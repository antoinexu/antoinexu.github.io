# Bowei Xu - Personal Portfolio

A bilingual English / Chinese portfolio built with vanilla HTML, CSS, and
JavaScript. No build step, no dependencies, no third-party requests at runtime.
Hosted on GitHub Pages.

**Live site:** [antoinexu.github.io](https://antoinexu.github.io)

English lives in the HTML, Chinese lives in the JSON, and `?lang=zh` selects the
language and is written back to the address bar so any view can be linked to.

## Structure

One `.html` file per page, each holding its own English markup and page-specific
translation script, with the Chinese strings in a matching `translations*.json`
fetched at runtime. `i18n.js` handles language persistence, `?lang=` URL syncing,
metadata and nav translation, and the `setText` / `setPills` helpers. `style.css`
carries all styling, `animations.js` the mobile menu and scroll reveal, and
`architecture.js` the inline SVG architecture diagrams. Fonts and icons are
self-hosted in `fonts.css` and `icons.css` (IBM Plex Sans and a Boxicons subset).

## Contact

- Email: bowei_xu@outlook.com
- LinkedIn: https://www.linkedin.com/in/bowei-xu-132a3b1b9/
- GitHub: https://github.com/antoinexu/
