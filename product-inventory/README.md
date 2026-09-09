# Labomak product inventory — 8 September 2026

This is a research snapshot of the existing public Labomak website, saved for the later website rebuild. No website implementation files were changed, and these files are not connected to the site's build.

## Start here

- **PRODUCTS.md**: readable inventory grouped by product type, with source-page and first-image links.
- **GALLERY-ITEMS.md**: separately listed fixture, grip and product-example captions with image and reference links.
- **catalog.json**: structured migration source, including original Turkish names, stable IDs, record kinds, product types, categories, full source text, tables, headings, images, document links, review notes, embedded offerings, gallery candidates and supporting pages.
- **images.json**: image library, deduplicated by selected URL, with source relationships, captions, alternative text and observed responsive image variants.
- **taxonomy.json**: original website category hierarchy and URLs.
- **coverage.json**: sitemap reconciliation and validation results.
- **crawl-log.json** and **raw/**: crawl status and original downloaded responses for traceability.

## How to use this in the rebuild

1. Use `products[].id` as an import key. WordPress post IDs and category IDs use different prefixes.
2. Use `record_kind` to distinguish products, software, families, collections and accessory categories. A collection/family is a landing-page candidate; it is not necessarily a separate saleable product.
3. Keep `source_url` as the original reference and a starting point for a redirect map. Review conflicting slugs and duplicate names before assigning new routes.
4. Use the original Turkish name as the source name. `product_type` is an editorial English classification, not a claim about the original navigation.
5. Review gallery candidates and embedded offerings against their parent content. A photo or test example does not establish a unique SKU. Different photos can show the same product.
6. Select final product imagery from `images`, captions and source context. The first image is only a suggested starting point; some pages include diagrams, comparison graphics, software screenshots or other illustrations. Image files have not been downloaded or individually availability-tested.
7. Verify source specification inconsistencies before publication. No capacities, prices, model numbers or missing specifications have been invented. Source claims are archival content, not independently verified specifications.
8. Sanitize and rewrite source content for the new website. Do not execute or directly render archived HTML or WordPress shortcodes.

## Scope and known source issues

The scrape covers the site's published post/page feed, category descriptions, navigation and sitemap-linked galleries. Non-product posts are accounted for in `excluded_pages`; homepage, certification, FAQ and service pages are preserved separately in `supporting_pages`. FAQ examples may include unfinished or placeholder content and require review.

The site has two pages titled **Fren Körüğü Test Cihazı** with different configuration descriptions. Both are retained. The **Labotens Kobi Duocol** URL contains `ceko-monocol`; the page title is used for identity. The universal-machine comparison page's TetraCol heading contains conflicting ton/kN values. The ECT-family title repeats ECT. These issues are flagged in the catalog.

The completed crawl visited 336 URLs. All catalog reference pages and all post, page, gallery and FAQ sitemap URLs were fetched successfully. Six other links returned 404: four malformed email links plus the old `/index.php/imalatlarimiz/yazilim/` and `/index.php/imalatlarimiz/donanim-ve-aksesuarlar/` links. The functioning FALCON page and accessory category descriptions are captured independently.

This inventory captures public website offerings, not an internal stock/SKU database. Counts should not be interpreted as a count of distinct models currently available for sale. Products mentioned only inside linked PDFs are not individually extracted; their document URLs are retained.

## Reproducibility

The scripts require Python, Requests, Beautiful Soup and lxml. `scrape.py` downloads public pages with four concurrent requests and caches responses under `raw/`. `build_inventory.py` generates the inventories from those cached responses. Cached responses are reused, so the folder represents this dated snapshot; create a separate dated folder for a fresh future scrape.
