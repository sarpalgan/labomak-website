# Labomak website — bilingual catalogue prototype

Static, dependency-free website. Node.js 20+ is required to build and preview. Generated pages need no application server in production.

## Preview locally

From this folder run:

```powershell
node tools/build.mjs
node --test tests/site.test.mjs
node tools/serve.mjs
```

Then visit `http://127.0.0.1:4174`. This development server serves only `dist/` and sends a noindex header; it is not a production server.

## Included now

- English homepage for Labomak with responsive navigation, product portfolio, Falcon story, reference-company placeholder and enquiry form
- Turkish language route at `/tr/`
- Six-part export-ready navigation: Products, Applications, Industries, Software & Services, Resources and Company
- Labomak logo integration and a charcoal, steel and amber design system derived from the approved logo
- Semantic, performance-conscious HTML/CSS/JavaScript with no framework dependency
- Visual placeholder illustrations that can be replaced by real Labomak product photos
- 226 static English/Turkish pages: full catalog, equipment groups, 54 product/software details per language, application/industry directories, 18 fixture collections, the document library, and the existing Labotens family pages
- 56 searchable product/software entries, including TetraCol and MultiTask linked to their existing family pages
- Eleven equipment groups, nine application groups and eleven industry groups, with working desktop and mobile navigation
- Local product photography, product-specific enquiry selections and original technical reference links
- Source-backed specification tables on 16 product pages per language, three version comparisons, and Charpy/Izod hammer options
- Complete fixture library with 332 distinct source images across 18 collections, original Turkish captions, collection/search filters, progressive display, full-size image viewer and fixture-specific enquiries
- Searchable library of 18 distinct PDFs, with document-type filters, product links and filter state preserved in the URL
- Original Labomak family photos, searchable catalogue, system-type filters and equipment comparison
- Email-draft enquiries with selected machine: nothing is sent automatically; customers review/send in their email application or copy the prepared text
- Unique catalogue metadata, reciprocal language links, breadcrumb structured data and generated sitemap

## Editing

Edit bilingual family content in `data/catalogue.mjs`, product names/descriptions and discovery groups in `data/portfolio.mjs`, and selected product features in `data/product-highlights.mjs`. Technical tables and comparisons are in `data/technical-content.mjs`; fixture groups and document names are in `data/fixtures.mjs` and `data/resources.mjs`. Templates are in `tools/build.mjs`, `tools/portfolio.mjs` and `tools/catalogue-sections.mjs`; styling is in `styles.css` / `catalogue.css`. Homepage sources are `index.html` and `tr/index.html`; preview their built versions. Navigation is replaced centrally during the build. `script.js` handles navigation; `catalogue.js` handles filters and email drafts. Rebuild after edits. Do not edit generated `dist/` files.

Content and photos are sourced from the existing Turkish universal-testing page: https://labomak.com.tr/index.php/imalatlarimiz/cekme-kopma-basma-uzama-test-cihazlari/. TetraCol capacity is deliberately configuration-dependent because the original page has conflicting units. Verify all summaries against approved technical sheets; family limits are not individual model ratings.

The expanded catalog uses the dated snapshot in `product-inventory/catalog.json`; no live scrape is required to build. Product pages have edited summaries, selected features, imagery, selection guidance and named source-document links. Sixteen products now have specification tables with source fragments retained in the data for verification; the remaining technical content and gallery-only offerings still need editorial migration. The two brake-chamber source pages share one new page with both references. TetraCol and MultiTask reuse existing family pages. Product-post and category IDs are kept separate to avoid WordPress ID collisions.

Resources now links to the real document library. Company and some service items retain homepage/enquiry destinations; their standalone content is a later phase. Customer names are supplied by the owner, with publication approval still required. The supplied logo file is unchanged. See `IMPLEMENTATION-PLAN.md` for the implemented scope and remaining work.

## Refresh selected external assets

`node tools/prepare-portfolio-assets.mjs` updates the selected photo manifest. `python tools/catalogue-assets.py` caches and validates the images. `node tools/prepare-documents.mjs` updates the PDF check manifest; `python tools/check-documents.py` verifies HTTP responses and PDF signatures and writes `data/document-status.json`. These Python tools require Requests; image validation also requires Pillow. The normal build and tests do not make external network requests. PDF links open the original documents; the complete PDF files are not bundled in `dist/`.

## Before production launch

1. Expand detailed specifications and fixture content, complete services/resources/company pages, and approve technical content and translations.
2. Replace placeholder visual art with original approved product photography and video.
3. Connect the enquiry form to the selected CRM/email workflow with spam protection and consent records.
4. Add professionally reviewed German, Italian, Arabic, French and Russian translations in the agreed market order.
5. Confirm domain/language routing, validate metadata/schema, implement analytics/privacy requirements and a 301 redirect map from the existing website. Submit the sitemap in Search Console. Search rankings cannot be guaranteed.
6. Confirm permission and exact wording before publishing customer logos, CE claims or standards compliance claims.

## Complete gallery migration

The fixture library uses `product-inventory/fixture-expansion/galleries.json`, freshly scraped from both gallery archive pages on 9 September 2026. See `product-inventory/fixture-expansion/COVERAGE.md` for all 21 galleries and the two empty sources. All 18 populated equipment galleries are included; nine certificate images remain in the inventory separately. Original descriptions remain in Turkish on both language routes; collection names and controls are bilingual. Thumbnails are hosted locally; the full-size viewer opens original image URLs on demand. `tools/fixture-pages.mjs` builds the master library and collection pages. All 391 catalogue thumbnail references are locally validated.
