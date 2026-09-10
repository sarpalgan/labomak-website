# Application content review

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
