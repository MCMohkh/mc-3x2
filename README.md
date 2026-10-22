# MC — mcjoint.in

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
Every talent profile has a one/two-page PDF in `/press-kits/`. After editing a profile, rebuild with `python3 tools/build_press_kits.py [slug]` (needs `reportlab fonttools brotli pillow beautifulsoup4 lxml pymupdf`) and commit the PDFs. MC's contact details used in the PDFs are at the top of `tools/build_press_kits.py`. The `tools/` folder is blocked from the public site in `_redirects`.

## Styles (one file)
All CSS lives in **`css/style.css`** — there are no other stylesheets and no `<style>` blocks in pages. It is organised in sections (fonts/icons, base, talent profiles, per-page styles, microsites) described in the comment at the top of the file.
- Every page's `<html>` has a page class (`pg-…`); microsites also have `ms` plus their own class (`ms-tsm`, `ms-prdb`, `ms-thanks`).
- Page-specific rules are written as `:where(.pg-<page>) <selector>` (zero extra specificity, so they can never leak onto another page).
- Site-wide changes go in section 2 (BASE). Logo tiles: give a logo `<img>` `data-tone="dark"` (dark logo, light tile) or `data-tone="light"` (light logo, dark tile).

## Adding images
Put new images under `/images/<section>/` (e.g. `images/branding/` for portfolio work). Use lowercase-kebab-case names (`brand-identity-acme.webp`), WebP where possible (JPG/PNG only for social-share images), under 2 MB each. Add `width`/`height` and `loading="lazy"` on `<img>`; logos get `data-tone="dark|light"`. Talent photos: `images/talent/`, referenced from the profile page's hero.

## MC editorial theme (Oct 2026)
The whole site follows the editorial look of the single-page prototype: dark, Anton headlines, Instrument Serif section titles, Hanken Grotesk body, red accents, tilted ticker, tilting idea posters.
- **Name & contact:** we are "MC" (Masters of Ceremonies). Contact email is `sonumohkh@gmail.com`; the @mcjoint.in mailboxes are offline. WhatsApp (+91 90144 14114) is the primary CTA.
- **Editorial pages** (`<html class="pg-… mc26">`): `index.html` (keeps the YouTube video hero background), `about.html`, `services.html`, `works.html`, `event/index.html`, `event/design-district.html`, `event/the-style-mill.html`, `works/double-engine.html`. Components are the `m-` prefixed classes in section 6b of `css/style.css`; behaviour (rotating "Masters of ___" line, scroll-speed ticker, poster tilt) is `js/editorial.js`.
- **All other pages** (talent profiles, project pages, case studies, services sub-pages, contact, FAQ, blog…) keep their structure but are skinned to the same dark editorial look: legacy light surfaces were converted to dark in sections 1–4 and section 7 sets typography. Microsites (`.ms`: Style Mill, PR-DB) keep their own design.
- **Header / mobile menu / footer** are identical on every non-microsite page (red block MC logo image). Fonts are self-hosted in `/fonts/` (Anton, Instrument Serif, Hanken Grotesk).
- **Cards:** `.m-card` = clean thumbnail on top (`.th`), coloured text panel below (`c1` red, `c2` white, `c3` grey, `c4` black). Logos use `.th.contain`.
- **Images to add** (WebP, kebab-case, under 2 MB): brand work in `images/branding/` — `machint-solutions`, `la-delicio`, `ohms`, `duncan-and-ross`, `india-intentions`, `nri-college`, `bookmycake`, `bison-panel`, `duradoor`, `spangle-media`, `v-rich`, `orizin`; optional `images/events/design-district-hero.webp`.
