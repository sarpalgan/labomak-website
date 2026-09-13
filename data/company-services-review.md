# Company and services migration

Reviewed 13 September 2026. Content is maintained in `company-services.mjs`; pages use the shared static portfolio template. Fourteen detail topics and two section directories add 32 English/Turkish pages. The existing Falcon overview remains its canonical destination; Eko and Pro have distinct feature-focused pages.

## Sources and editorial decisions

- [Company](https://labomak.com.tr/index.php/hakkimizda/hakkimizda/): manufacturing, sample demonstrations and continuing Kalitest support. Its older Küçükyalı showroom mention is not presented as the current venue; visitors are asked to confirm the appointment and venue.
- [Contact](https://labomak.com.tr/index.php/hakkimizda/iletisim/): legal company name, Başakşehir address, telephone, email and map link. Banking and accounting information is outside this migration's scope.
- [Quality](https://labomak.com.tr/index.php/kalite-belgelerimiz/): links to published documentation, without asserting current certificate scope or blanket machine compliance.
- [References](https://labomak.com.tr/index.php/hakkimizda/referanslar/) and its customer-list PDF: direct reference links, without inventing testimonials or reproducing customer logos.
- Existing `data/portfolio.mjs`, `data/catalogue.mjs` and the archived product inventory: Falcon features and equipment compatibility. The edition pages retain the existing 10-test Eko and 100-test Pro comparison limits.
- [Legacy archive](https://labomak.com.tr/index.php/author/admin/): the documented 20 kN Kalitest modernisation example.
- Export, training and method-development pages explain what to include in an enquiry. They do not promise particular territories, partners, delivery times, training packages or universal upgrade compatibility.

## SEO and launch

Every new page has distinct title and description text, a single H1, static crawlable content, descriptive internal links, a self-referencing canonical, reciprocal English/Turkish/x-default alternates, Open Graph metadata and breadcrumb structured data. Detail pages also include WebPage, AboutPage or ContactPage structured data. All routes are generated into the XML sitemap. Existing responsive layouts and deferred scripts are reused.

Guidance: [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites).

Deployment must preserve the intended HTTPS domain, serve the generated sitemap/robots files and retain legacy source URLs until the wider migration redirect map is deployed. Search Console submission, live indexing checks and production performance measurements remain launch activities. The local preview deliberately sends a noindex response header.
