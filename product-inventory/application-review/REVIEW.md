# Application content review

## Expansion on 13 September 2026

All twelve application topics were expanded in English and Turkish. `data/application-details.mjs` adds method variants, specimen-to-result workflows, calculation explanations, pitfalls and reporting requirements. `tools/application-detail-diagrams.mjs` adds twelve original diagrams with translated labels and accessible descriptions, complementing the twelve existing setup illustrations. Curves are explicitly qualitative, and arithmetic examples are not product ratings or measurements.

The seven supplied article URLs were checked again. Bending, shear, peel and puncture were readable through live retrieval. Tensile, crush and compression returned retrieval timeouts; their existing successful 9 September snapshots in `sources.json` were retained as the legacy basis. The new technical explanations were checked against independent primary sources rather than treating the legacy text as authoritative.

| Topic | Primary verification and expansion |
| --- | --- |
| Tensile | [ZwickRoell tensile methods](https://www.zwickroell.com/products/static-materials-testing-machines/universal-testing-machines-for-static-applications/tensile-tester/): material-dependent standards, specimen and strain measurement. Added engineering-stress/strain example and modulus/necking cautions. |
| Compression | [ASTM D695 scope](https://store.astm.org/standards/d695), [Instron compression principles](https://www.instron.com/en/resources/test-types/compression-test/): deformation without distinct fracture, platen contact and measurement. Added barrelling/buckling comparison. |
| Crush | [ASTM D642](https://store.astm.org/d0642-25.html), [ZwickRoell ECT](https://www.zwickroell.com/industries/paper-cardboard-tissues/corrugated-board-and-solid-board/edge-crush-test-ect/): complete-box versus board tests. Added ECT unit conversion and FCT/RCT distinctions. |
| Flexure | [Instron D790/D6272 guide](https://www.instron.com/en/testing-solutions/astm-standards/the-definitive-guide-to-astm-d790/): fixture differences, deflection measurement and geometry. Added small-deflection rectangular three-point beam equations with limitations and a four-point moment-region diagram. |
| Shear | [ASTM D1002](https://store.astm.org/d1002-10r19.html), [Instron lap-shear guidance](https://www.instron.com/wp-content/uploads/2024/07/astm-d1002-lap-shear.pdf): apparent joint strength and its design limitations. Added failure-path illustration and overlap-area example. |
| Peel | [ASTM D3330](https://store.astm.org/d3330_d3330m-04r25.html), [ASTM D1876](https://store.astm.org/d1876-08r23.html): pressure-sensitive tape and flexible-adherend T-peel are distinct. Added 180°/T-peel schematic, interval evaluation and force-per-width example. |
| Puncture | [ASTM F1306](https://store.astm.org/standards/f1306): probe, material and rate dependence. Added work integration with unit conversion, contact reference and post-puncture friction distinction. |
| Impact | [ASTM D1709](https://store.astm.org/d1709-24.html) and the existing E23 reference: statistical film failure mass differs from pendulum absorbed energy. Added Charpy/Izod support illustration and available-versus-absorbed energy explanation. |
| Abrasion | [Taber test selection](https://www.taberindustries.com/getting-started), [rotary abrasion](https://www.taberindustries.com/taber-rotary-abraser): contact conditions and assessment metrics. Added mass-loss example and coating-breakthrough distinction. |
| Permeability | [ASTM D737](https://store.astm.org/d0737-18.html), [ASTM E96 scope](https://store.astm.org/e0096_e0096m-24.html): separate air and vapour measurements. Added gravimetric cup diagram, steady-rate evaluation, leakage controls and WVTR example. |
| Temperature | [ASTM D618](https://store.astm.org/standards/d618), BINDER chamber guidance: conditioning versus drying, material history and equilibration. Added chamber/specimen warm-up comparison and reporting of actual exposure. |
| Fatigue | [ZwickRoell constant-amplitude tests](https://www.zwickroell.com/industries/materials-testing/fatigue-test/high-cycle-fatigue-test-s-n-test-din-50100/): planned series, load history and run-outs. Added amplitude/mean/R example and qualitative S–N diagram. |

These are original educational summaries based on public scope pages and manufacturer explanations, not reproductions of full standards. Exact test speeds, specimen tolerances, acceptance limits and current contractually applicable editions must come from the laboratory's selected procedure. No universal settings or equipment-compliance claims were inferred from a standard's title.

SEO now identifies each guide's main entity as an Article within its WebPage, with visible update date, organizational author, language, image and source citations. Equipment remains a separate linked ItemList. Existing canonical URLs and reciprocal language alternates are preserved. All explanations, formula text, captions and FAQ answers remain present in static HTML.

The eleven legacy destinations requested by the owner were retrieved on 9 September 2026. `sources.json` records the URL, HTTP status, text, images, links and retrieval date. Seven are explanatory articles; four are category archives. Their content is evidence, not HTML copied into the new site. Twelve guides are maintained in `data/application-guides.mjs`, including the existing fatigue topic.

## Editorial corrections

| Topic | Decision applied to the new content |
| --- | --- |
| Tensile | Use N/mm² (MPa) for stress; distinguish crosshead travel from specimen strain and explain when an extensometer is needed. |
| Flexure | Separate static flexure, guided bending and repeated-load fatigue. Repeated plastic bending is not the general definition of flexural testing. |
| Crush | Remove the corrupted generic strength formula. Distinguish whole-box compression force from edge-crush measurements. |
| Compression | Explain platen alignment, specimen geometry and buckling; do not equate every crushing result with compressive stress. |
| Shear | Separate static adhesive holding power from moving-crosshead lap shear. Describe lap-shear results as method-dependent apparent joint strength. |
| Peel and adhesion | Distinguish adhesive, cohesive and substrate failures. Peel results depend on geometry, angle and evaluation interval, not just a universal maximum force. |
| Puncture | Remove the asserted universal maximum-load/thickness formula. The selected method determines whether force, energy or displacement is reported. |
| Impact | Separate Charpy/Izod, drop-weight, dart and other impact methods. Do not imply that an ordinary universal test machine provides the same impact measurement. |
| Abrasion | The legacy surface-abrasion product describes making concrete/natural-stone specimen faces parallel. Rename it a specimen surface grinder and keep it out of abrasion-performance recommendations. The furniture-leg flooring tester remains clearly identified by its own method. |
| Permeability | Separate air transmission, water-vapour transmission and leakage in assembled products. Remove the unrelated universal tester from this application; do not conflate melt flow with permeability. |
| Temperature | Distinguish oven setpoint from specimen temperature, and conditioning from drying. Avoid unsupported predictions of service life. |

## Technical basis

Each guide links directly to its supporting method references. These include official ASTM scopes (D695, D642, D790, D1002, D3654, D3330, E23, D1709, F1306, D737, E96 and D618), Instron test-method explanations, ZwickRoell testing guidance, Taber abrasion guidance and BINDER chamber guidance. Links and per-guide associations are stored in the content module. Equipment compatibility remains configuration-dependent; referencing a standard does not certify a product against it.

## Search presentation

The pages provide useful, visible HTML explanations and native expandable FAQ answers, followed by equipment and fixture links. They have individual titles/descriptions, canonicals, reciprocal language alternates, breadcrumbs and structured WebPage data. No FAQ rich-result promise is made. Google’s [Search documentation updates](https://developers.google.com/search/updates) record the retirement of FAQ rich results in May 2026. All answers remain available without JavaScript.

The homepage redesign retains these guide routes and makes them accessible through both the Applications menu and the landing-page application links.
