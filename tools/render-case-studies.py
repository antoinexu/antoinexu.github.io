#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Regenerate the static English bodies of the case-study pages.

The case-study pages ship their English body as static markup so crawlers and
non-JS clients can read it, while translations_case_study_*.json remains the
source of truth that the page script renders from at runtime. Run this after
editing any of those JSON files so the two cannot drift apart.

This mirrors renderBody() in each page. The architecture diagram is captured
from a real browser render so it matches architecture.js exactly.

    pip install playwright && playwright install chromium
    python -m http.server 8765          # from the repo root, in another shell
    python tools/render-case-studies.py

The site itself has no build step and no dependencies; this is a dev-only tool.
"""
import io
import json
import os
import re
import sys
from xml.sax.saxutils import escape

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit("playwright is required: pip install playwright && playwright install chromium")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVER = os.environ.get("SITE_URL", "http://localhost:8765")

PAGES = {
    "case-study-erp.html": "translations_case_study_erp.json",
    "case-study-inventory.html": "translations_case_study_inventory.json",
    "case-study-opencart.html": "translations_case_study_opencart.json",
}

# Ends on the 8-space close of #cs-body; the 12-space closes of the inner
# .cs-section divs cannot match that indentation, so the lazy .*? stops here.
BLOCK = re.compile(
    r'        <a href="project\.html" class="case-study-back" id="cs-back">.*?'
    r'<div id="cs-body">.*?\n        </div>',
    re.S)


def render_body(sections, page_svgs, indent="            "):
    i1, i2, i3 = indent, indent + "    ", indent + "        "
    out, svg_index = [], 0

    for section in sections:
        out.append('%s<div class="cs-section">' % i1)
        out.append("%s<h2>%s</h2>" % (i2, escape(section["heading"])))

        for para in section.get("paragraphs", []):
            out.append("%s<p>%s</p>" % (i2, escape(para)))

        if section.get("architecture"):
            out.append('%s<div class="arch-figure">%s</div>'
                       % (i2, page_svgs[svg_index]))
            svg_index += 1
        elif section.get("code"):
            out.append("%s<pre><code>%s</code></pre>" % (i2, escape(section["code"])))

        for para in section.get("paragraphs_after", []):
            out.append("%s<p>%s</p>" % (i2, escape(para)))

        if section.get("list"):
            out.append("%s<ul>" % i2)
            for item in section["list"]:
                out.append("%s<li>%s</li>" % (i3, escape(item)))
            out.append("%s</ul>" % i2)

        for sub in section.get("subsections", []):
            out.append("%s<h3>%s</h3>" % (i2, escape(sub["title"])))
            out.append("%s<p>%s</p>" % (i2, escape(sub["body"])))

        out.append("%s</div>" % i1)

    if svg_index != len(page_svgs):
        raise SystemExit("architecture diagram count does not match the JSON")
    return "\n".join(out)


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        page = browser.new_page()
        svgs = {}
        for name in PAGES:
            page.goto("%s/%s" % (SERVER, name))
            page.wait_for_timeout(700)
            svgs[name] = page.eval_on_selector_all(
                ".arch-figure svg", "els => els.map(e => e.outerHTML)")
        browser.close()

    for name, json_name in PAGES.items():
        path = os.path.join(ROOT, name)
        html = io.open(path, encoding="utf-8").read()
        data = json.load(io.open(os.path.join(ROOT, json_name), encoding="utf-8"))["en"]

        block = (
            '        <a href="project.html" class="case-study-back" id="cs-back">%s</a>\n'
            '        <h1 id="cs-title">%s</h1>\n'
            '        <p class="case-study-disclaimer" id="cs-disclaimer">%s</p>\n'
            '        <!-- English body is rendered statically so crawlers and non-JS clients\n'
            '             see it. translations_case_study_*.json stays the source of truth and\n'
            '             the page script re-renders this on load / language switch.\n'
            '             Regenerate with tools/render-case-studies.py after editing the JSON. -->\n'
            '        <div id="cs-body">\n%s\n        </div>'
            % (escape(data["back"]), escape(data["title"]), escape(data["disclaimer"]),
               render_body(data["sections"], svgs[name]))
        )

        if not BLOCK.search(html):
            raise SystemExit("could not locate the case-study block in " + name)

        io.open(path, "w", encoding="utf-8", newline="\n").write(
            BLOCK.sub(lambda m: block, html, count=1))
        print("rendered", name)


if __name__ == "__main__":
    main()
