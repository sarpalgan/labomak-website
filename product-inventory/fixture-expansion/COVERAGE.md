# Fixture gallery migration — 9 September 2026

Both archive pages and all 21 linked galleries were fetched successfully. The new website includes 18 populated equipment collections: 356 collection/image relationships and 332 distinct original image URLs. Each original description, thumbnail URL and full-size image URL is retained. Identical URLs shared by collections appear once in the master library and in every applicable collection. Visually similar images with different original URLs are retained.

The nine certificate images are preserved in galleries.json but excluded from the fixture product library. Two archive entries returned no gallery images; their fetched HTML is retained for review. Original Turkish captions are shown in both languages; collection titles and interface controls are bilingual. No new model identities or technical claims were inferred from photographs.

| Original collection | Images | Migration |
|---|---:|---|
| [Labomak Kalite Belgeleri](https://labomak.com.tr/index.php/rl_gallery/labomak-kalite-belgeleri/) | 9 | Certificates retained separately in inventory |
| [plastik](https://labomak.com.tr/index.php/rl_gallery/plastik-ve-kaucuk-icin-ozel-test-fiskturleri/) | 32 | Included |
| [Bağlantı elemanları](https://labomak.com.tr/index.php/rl_gallery/baglanti-elemanlari/) | 14 | Included |
| [Kağıt karton mukavva sektörü](https://labomak.com.tr/index.php/rl_gallery/kagit-karton-mukavva-sektoru/) | 31 | Included |
| [Seramik Fayans Yer Karosu](https://labomak.com.tr/index.php/rl_gallery/seramik-fayans-yer-karosu/) | 8 | Included |
| [Ayakkabı Sektörü](https://labomak.com.tr/index.php/rl_gallery/ayakkabi-sektoru/) | 16 | Included |
| [Ahşap, Mobilya, test çeneleri](https://labomak.com.tr/index.php/rl_gallery/ahsap-mobilya-test-ceneleri/) | 16 | Included |
| [Sıkıştırma Plakaları ve Aparatları](https://labomak.com.tr/index.php/rl_gallery/sikistirma-plakalari-ve-aparatlari/) | 21 | Included |
| [Pnömatik Kavramalar ve çeneler](https://labomak.com.tr/index.php/rl_gallery/pnomatik-kavramalar-ve-ceneler/) | 11 | Included |
| [Eğilme ve bükülme aparatları ve fikstürleri](https://labomak.com.tr/index.php/rl_gallery/egilme-ve-bukulme-aparatlari-ve-fiksturleri/) | 27 | Included |
| [Penetrasyon, Delme, Saplama probları fikstürleri](https://labomak.com.tr/index.php/rl_gallery/penetrasyon-delme-saplama-problari-fiksturleri/) | 4 | Included |
| [Sıkıştırma çeneleri,  Bükme, eğme sıkıştırma, delme…](https://labomak.com.tr/index.php/rl_gallery/sikistirma-ceneleri-bukme-egme-sikistirma-delme/) | 0 | Empty source gallery — no images available |
| [Mengene tipi çeneler](https://labomak.com.tr/index.php/rl_gallery/mengene-tipi-ceneler/) | 19 | Included |
| [Shear, kesme- kayma – soyma aparatları](https://labomak.com.tr/index.php/rl_gallery/shear-kesme-soyma-aparatlari/) | 42 | Included |
| [Tel, İp,Halat, Şerit vb numune çekme çeneleri](https://labomak.com.tr/index.php/rl_gallery/tel-iphalat-serit-vb-numune-cekme-ceneleri/) | 7 | Included |
| [Kerpeten tip çeneler](https://labomak.com.tr/index.php/rl_gallery/kerpeten-tip-ceneler/) | 13 | Included |
| [Çekme çeneleri](https://labomak.com.tr/index.php/rl_gallery/cekme-ceneleri/) | 0 | Empty source gallery — no images available |
| [Soyulma, sıyrılma, yapışma dayanımı fikstürleri](https://labomak.com.tr/index.php/rl_gallery/soyulma-siyrilma-yapisma-dayanimi-fiksturleri/) | 23 | Included |
| [Tekstil Düğme çıtçıt](https://labomak.com.tr/index.php/rl_gallery/tekstil-dugme-citcit/) | 53 | Included |
| [Tutucu fikstürler ve çeneler](https://labomak.com.tr/index.php/rl_gallery/tutucu-fiksturler-ve-ceneler/) | 11 | Included |
| [Labomak dayanım cihazlarına ait bazı örnekler](https://labomak.com.tr/index.php/rl_gallery/labomak-dayanim-cihazlarina-ait-bazi-ornekler/) | 8 | Included |

## Reproduce

Run `python tools/scrape-fixtures.py` to refresh the archived HTML and galleries.json; review changes, then run `node tools/prepare-portfolio-assets.mjs`, `python tools/catalogue-assets.py`, and `node --test tests/site.test.mjs`. The normal build uses the saved snapshot without public network access.
