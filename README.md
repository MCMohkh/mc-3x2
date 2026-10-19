# MC Joint — mcjoint.in

Static site (HTML/CSS/JS), deployed on Netlify. Primary domain: `https://mcjoint.in` (apex).

## Structure
- `/` home · `/about.html` · `/contact.html`
- `/services.html` — core services (production, music & sound, talent management, digital strategy), Branding & Design, Digital Footprint
  - `/services/branding-design.html`, `/services/digital-footprint.html`, `imdb-management`, `wikipedia-consulting`, `google-knowledge-panel`, `pr-notability`
- `/clients/` — hub · `businesses.html` (ongoing working relationships) · `associates.html` (friends we occasionally work with) · `talent.html` + `talent/<slug>.html` (individuals)
- `/works.html` — work for client businesses · `/works/projects.html` — individual projects, each at `/works/<slug>.html`
- `/get-represented.html` — intake form (music distribution / representation) · `/contact-talent.html` — enquiries for a specific artist (noindex; every talent profile links to it with `?talent=<slug>`)
- `/talent-management-hyderabad.html`, `/music-distribution-hyderabad.html`, `/film-marketing-hyderabad.html` — Hyderabad landing pages · `/faq.html` (FAQPage schema)
- `/case-studies/` — hub + `avanti-cinema`, `tapeloop-records`, `pickpocket`
- `/press-kit.html` — gated press-kit download (form, then PDF) · `/press-kits/<slug>-press-kit.pdf` — generated PDFs (noindex)
- `/blog.html` — journal index; posts live in `/blog/<slug>.html` (add new posts to `feed.xml` and `sitemap.xml`)
- `/thestylemill/` — event microsite · `/PR-DB/` — private, noindex

## Conventions
- Images: WebP in `/images/…`, lowercase kebab-case names, each under 2 MB. Social-card (`og:image`) images stay JPG/PNG.
- Header, mobile menu and footer are identical on every page — change them everywhere together.
- Talent page templates live in `clients/talent/template-*.html` and are blocked from serving by `_redirects`.
- Merged/removed pages are redirected in `_redirects`.

## Forms
`contact`, `representation`, `talent-enquiry` post (via `js/forms.js`) to a Google Apps Script web app that writes to a Google Sheet and sends email / WhatsApp / Telegram alerts. The endpoint URL is `MC_FORMS_ENDPOINT` in `js/forms.js`. Netlify Forms is not used (form detection can be switched off in Netlify).

## Press kits
Every talent profile has a one/two-page PDF in `/press-kits/`. After editing a profile, rebuild with `python3 tools/build_press_kits.py [slug]` (needs `reportlab fonttools brotli pillow beautifulsoup4 lxml pymupdf`) and commit the PDFs. MC Joint's contact details used in the PDFs are at the top of `tools/build_press_kits.py`. The `tools/` folder is blocked from the public site in `_redirects`.

## Redesign (Oct 2026): editorial direction
Ideas / Perspective / Proof. Field Notes lives at `/field-notes.html` (ideas data in the page; series: Field Notes, The Fine Print, Behind the Work, People Are the IP, Digital Shadow). The old `css/style.css` is now used only by `/thestylemill/` and `/PR-DB/`; every other page uses `css/mc.css` and `js/mc.js`. Fonts: `fonts/anton.woff2`, `instrument-serif*.woff2`, `hanken-grotesk.woff2`. Photos that are not yet in `/images/talent/` show a typographic tile automatically.

## Styles (legacy file)
All CSS lives in **`css/style.css`** — there are no other stylesheets and no `<style>` blocks in pages. It is organised in sections (fonts/icons, base, talent profiles, per-page styles, microsites) described in the comment at the top of the file.
- Every page's `<html>` has a page class (`pg-…`); microsites also have `ms` plus their own class (`ms-tsm`, `ms-prdb`, `ms-thanks`).
- Page-specific rules are written as `:where(.pg-<page>) <selector>` (zero extra specificity, so they can never leak onto another page).
- Site-wide changes go in section 2 (BASE). Logo tiles: give a logo `<img>` `data-tone="dark"` (dark logo, light tile) or `data-tone="light"` (light logo, dark tile).

## Adding images
Put new images under `/images/<section>/` (e.g. `images/branding/` for portfolio work). Use lowercase-kebab-case names (`brand-identity-acme.webp`), WebP where possible (JPG/PNG only for social-share images), under 2 MB each. Add `width`/`height` and `loading="lazy"` on `<img>`; logos get `data-tone="dark|light"`. Talent photos: `images/talent/`, referenced from the profile page's hero.
