# Product catalogue implementation

## Plan applied — 9 September 2026

1. **Organize by equipment and customer task.** Keep the six top-level menu headings. Replace the Products menu with equipment groups from the inventory; connect Applications and Industries to dedicated browsing pages. Connect Falcon links to its product page and Eko/Pro sections.
2. **Build the catalog foundation.** Add a full product index with search and category filters. Reuse the existing five Labotens family pages; add named-model links within MonoCol and DuoCol. Add group landing pages for packaging, impact, fatigue/springs, flow/permeability, thermal, construction, components, fixtures, accessories and software.
3. **Create the first product pages.** Publish locally generated English and Turkish pages for 54 identified product/software entries. Include edited names and descriptions, local source photos, selected source-backed features/specifications, related equipment, technical references and an enquiry preselected to that product. Include existing TetraCol and MultiTask pages in the 56-entry searchable index.
4. **Check before handoff.** Validate all 188 generated pages for local links/assets/fragments, unique titles, language counterparts, source provenance, enquiry selections and preview HTTP responses. Check search, empty results, enquiry drafts and responsive navigation in the browser.

## Decisions

- The scrape is a research source, not executable HTML. Product pages render only edited content and escaped text.
- The 345 gallery candidates are not promoted into individual model pages. The fixture landing page starts with 12 illustrated grip examples; original gallery references are retained.
- Four accessory categories have selection cards. Sparse source descriptions are not expanded into invented specifications.
- The two brake-chamber descriptions are linked from one product page; no separate model identity is invented.
- The Kobi DuoCol page uses its title, not the erroneous old slug.
- Conflicting TetraCol capacities remain out of the new specifications.
- WordPress posts and categories use separate ID namespaces. The MFI post and display-accessory category both have numeric ID 228 and must never be confused.
- Source-based industry tags support browsing; inclusion does not assert that every configuration is suitable for every material or test standard.
- The original live website is not deployed or modified by this work.

## Remaining editorial phase

- Continue technical-table migration for the remaining product pages, especially named Labotens model configurations. Avoid assigning family maxima to individual models.
- Edit and translate the retained original gallery captions; all populated fixture galleries have now been migrated.
- Review the 12 embedded offerings before assigning them independent product identities.
- Complete service and company pages; broaden the resource library as approved documents become available.
- Prepare the full old-to-new redirect map and production deployment configuration after final content/route review.

## Main implementation files

- `data/portfolio.mjs`: curated catalog and discovery taxonomy
- `data/product-highlights.mjs`: bilingual feature summaries
- `tools/portfolio.mjs`: expanded navigation, listings and detail templates
- `data/portfolio-assets.json`: original image URL to local asset mapping
- `tools/build.mjs`: shared layout and static output integration
- `tests/site.test.mjs`: catalog, provenance, language and route checks

## Validation completed

- Six automated suites passed across all 188 pages, including local links, image files, fragments, canonical/hreflang relationships, enquiry selection, source IDs and HTTP routing.
- Desktop Products dropdown and the Turkish mobile menu were visually checked; product layouts were inspected at 390 px width.
- Browser checks covered BoxMax search, category filtering, zero results, reset, Turkish MFI search and family-filter isolation from model cards.
- A BoxMax enquiry produced the correct mail draft and product name; no email was sent.
- All 73 selected image references downloaded or validated successfully. Existing family photos are reused where appropriate.

## Phase 2 completed — technical content, fixtures and documents

- Added bilingual specification tables for 16 products, covering SCT, MFI, BoxMax, bending stiffness, burst testing, ovens, static indentation, manual hydraulics, pipe impact, Marshall stability, ductility, concrete compression, cold bending, brake chambers, masonry shear and fatigue testing. Source fragments accompany the curated values for automated provenance checks.
- Added Kobi/Kompetan comparisons for MFI and BoxMax, and an EVO/EVO5 comparison. Added the ten listed Charpy/Izod hammer configurations and in-page product navigation.
- Added six fixture-group pages in each language with 19 selected, named illustrations. These are configuration examples, not newly invented models or SKUs.
- Added a document library with 18 unique original PDFs, meaningful bilingual names, related-product links, text/type filters and URL-persisted filter state. Resources now links to this library. Encoded and unencoded versions of the example-report URL are deduplicated.
- Verified all 18 documents returned HTTP 200 with PDF signatures. The check validates availability and file type, not the entire PDF contents.
- Selected photo manifest now contains 89 validated image references.
- Nine automated suites pass across 202 generated pages. Browser checks passed for resource search, type selection, no results, reset, reload restoration, Turkish preset links, mobile technical-table layout and Turkish fixture pages. Wider comparison tables scroll within their container without horizontal page overflow.

### Phase 2 files

- `data/technical-content.mjs`: source-backed specifications and version comparisons
- `data/fixtures.mjs`: fixture groups and named source images
- `data/resources.mjs`: deduplicated document library and product associations
- `tools/catalogue-sections.mjs`: technical, fixture and library page sections
- `tools/prepare-documents.mjs` / `tools/check-documents.py`: reproducible document availability checks

## Phase 3 completed — full fixture library

- Freshly scraped both gallery archives and all 21 linked galleries. Included all 18 populated equipment collections, preserving 356 image/collection relationships and 332 distinct source image URLs. The two empty source galleries and the nine certificate images are documented separately in `product-inventory/fixture-expansion/COVERAGE.md`.
- Expanded the six existing fixture routes and added 12 further collection routes in each language. The Grips & fixtures menu destination now opens the complete searchable library.
- Added collection counts, source captions, source-page links, full-size image links/viewer, search and collection filters, URL restoration, incremental display, and enquiries preselected to individual illustrated fixtures.
- Retained original Turkish image descriptions in both languages; navigation and collection titles are bilingual. Thumbnail assets are local and verified; full-size originals load on demand.
- Ten automated suites pass across 226 pages, including complete source-image coverage, all local assets, route integrity, language counterparts and source provenance. Browser checks cover filtering, pagination, reload restoration, zero results, reset, image enlargement and selected enquiries.

## Phase 4 completed — application guides

- Reviewed and archived all eleven requested legacy destinations, including seven articles and four category archives. Added twelve bilingual application guides, retaining fatigue alongside the requested methods; the site now builds 232 pages.
- Each guide includes method explanation, outcomes, setup considerations, three crawlable FAQ answers, related products, applicable fixture collections and primary technical references. Added accessible explanatory diagrams, distinct metadata, reciprocal language links and structured page/breadcrumb data.
- Corrected misleading definitions and units, separated different methods, and curated product associations. The surface grinder is now described as specimen preparation; permeability pages distinguish transmission from leakage. See `product-inventory/application-review/REVIEW.md`.

## Phase 5 completed — landing page and motion

- Replaced the former homepage machine silhouettes and fabricated live readout with a detailed, layered tensile scene. Scrolling lifts the crosshead and deforms the specimen through four illustrative stages. Range input supports touch and keyboard exploration; pause holds a selected state; reduced-motion mode is static until deliberate input.
- Applied the logo palette to shared page tokens, buttons, navigation and footers. Redesigned both homepages with graphite and gold hero sections, steel neutrals, original product photographs, application links and a dedicated 18-collection / 332-example fixture feature.
- Homepage content is rendered in HTML independently of motion. Added bilingual search and social metadata plus Organization, WebSite and WebPage structured data. Product images are locally hosted, sized and lazy-loaded below the hero. No animation dependency or video download is required.
- Removed old homepage art from the source templates. Both languages share `tools/homepage.mjs`; the mechanical scene and motion are maintained separately.
- Validation: fifteen automated tests cover all 232 routes, assets, language/metadata relationships, content provenance and animation behavior. Desktop and mobile visual review includes the hero, keyboard fracture control, Turkish content and real product photography.

### Shared header refinement

- Replaced the recreated header lettering and emblem with the owner's supplied wordmark image at `assets/labomak-wordmark.png`, preserving its proportions. Every route receives it from the shared header renderer.
- Redesigned the masthead and dropdown panels with a white background, steel neutrals, larger labels and gold active accents. Desktop menus open on mouse entry; an exit delay supports movement into the panel. Touch retains tap-to-expand behavior; Arrow Down enters a panel and Escape closes it.
- Added route-wide header assertions and interaction tests for all six hover menus, exit/re-entry, touch exclusion and keyboard focus handling. The full suite now contains nineteen tests.
