import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { families, base, brochure } from '../data/catalogue.mjs';
import { buildPortfolio, portfolioNavigation, portfolioPairs, familyModels } from './portfolio.mjs';
import { catalogRoot } from '../data/portfolio.mjs';
import { homepage, homepageSeo } from './homepage.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const domain = 'https://labomak.com.tr';
const siteBasePath = (process.env.SITE_BASE_PATH || '').replace(/\/$/, '');
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const home = lang => lang === 'tr' ? '/tr/' : '/';
const url = (lang, family) => base[lang] + (family ? family.id + '/' : '');
const t = (lang, en, tr) => lang === 'tr' ? tr : en;
const write = (route, content) => {
  const target = path.join(out, route, 'index.html');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
};
function applySiteBasePath() {
  if (!siteBasePath) return;
  const pending = [out];
  while (pending.length) {
    const current = pending.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) pending.push(target);
      else if (entry.name.endsWith('.html')) {
        const html = fs.readFileSync(target, 'utf8').replace(/(href|src)="\/(?!\/)/g, `$1="${siteBasePath}/`);
        fs.writeFileSync(target, html);
      }
    }
  }
}
const inputs = Object.fromEntries(['en', 'tr'].map(lang => [lang, fs.readFileSync(path.join(root, lang === 'en' ? 'index.html' : 'tr/index.html'), 'utf8')]));

function localiseNavigation(html, lang) {
  // All layouts use the same static navigation. Resolve the shipped catalogue destinations.
  return html.replace(/<a\b([^>]*?)href="([^"]*)"([^>]*)>([\s\S]*?)<\/a>/g, (whole, before, href, after, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    let target = href;
    if (/^(Universal testing machines|Üniversal test cihazları|Explore machines|Cihazları inceleyin)/i.test(text)) target = base[lang];
    for (const family of families) {
      if (text.includes(family.name) && family.id !== 'custom') target = url(lang, family);
    }
    if (/^(Custom test systems|Özel test sistemleri)$/.test(text)) target = url(lang, families.at(-1));
    return `<a${before}href="${target}"${after}>${inner}</a>`;
  });
}

function header(lang, family, forHome = false) {
  let fragment = inputs[lang].match(/<header[\s\S]*?<main/)[0].replace(/<main$/, '');
  fragment = portfolioNavigation(fragment, lang);
  fragment = fragment.replace(/<a class="brand"[\s\S]*?<\/a>/, `<a class="brand" href="${home(lang)}" aria-label="${t(lang,'Labomak home','Labomak ana sayfa')}"><img class="brand-wordmark-image" src="/assets/labomak-wordmark.png" alt="Labomak" width="986" height="108"></a>`);
  fragment = localiseNavigation(fragment, lang)
    .replace(/src="(?:\.\.\/)?logo.png"/g, 'src="/logo.png"')
    .replace(/href="(?:\.\.\/)?index.html" lang="en"/g, `href="${forHome ? home('en') : url('en', family)}" lang="en"`)
    .replace(/href="(?:tr\/)?index.html" lang="tr"/g, `href="${forHome ? home('tr') : url('tr', family)}" lang="tr"`)
    .replace(/<a href="(?:\.\.\/)?(?:tr\/)?index.html">(?:English site|Türkçe site)<\/a>/g, '');
  if (!forHome) fragment = fragment.replace(/href="#(top|solutions|machines|falcon|why-labomak|quote)"/g, (_, id) => `href="${id === 'quote' ? '#enquire' : home(lang) + '#' + id}"`);
  // Build the mobile accordion from the full desktop menu so destinations never disappear on mobile.
  const nav = fragment.match(/<nav class="desktop-nav"[\s\S]*?<\/nav>/)[0];
  const mobile = nav.replace(/<nav[^>]*>/, '<div class="mobile-menu" id="mobile-navigation" data-mobile-menu hidden>')
    .replace(/<\/nav>$/, '</div>').replace(/class="nav-mega"/g, 'class="mobile-group"');
  fragment = fragment.replace(/<div class="mobile-menu"[\s\S]*$/, mobile);
  fragment = fragment.replace('class="menu-toggle"', 'class="menu-toggle" aria-controls="mobile-navigation"');
  return fragment;
}

function footer(lang) {
  return `<footer class="site-footer"><div class="section-shell footer-main">
    <a href="${home(lang)}" aria-label="Labomak"><img class="footer-logo" src="/logo.png" alt="Labomak Makine Sanayi" width="986" height="669" loading="lazy"></a>
    <p>${t(lang, 'Materials testing technology,<br>designed for certainty.', 'Güven için tasarlanan<br>malzeme test teknolojisi.')}</p>
    <div class="footer-contact"><a href="mailto:info@labomak.com.tr">info@labomak.com.tr</a><a href="tel:+902124381826">+90 212 438 18 26</a><a href="${catalogRoot(lang)}">${t(lang, 'Full product catalogue', 'Tüm ürün kataloğu')}</a></div></div>
    <div class="section-shell footer-bottom"><span>© ${new Date().getFullYear()} Labomak Makine</span><span>İstanbul, Türkiye</span><a href="#top">${t(lang, 'Back to top', 'Yukarı çık')} ↑</a></div></footer>`;
}

function metadata(lang, family, title, description) {
  const route = url(lang, family);
  const crumbs = [{ '@type': 'ListItem', position: 1, name: 'Labomak', item: domain + home(lang) },
    { '@type': 'ListItem', position: 2, name: t(lang, 'Universal testing machines', 'Üniversal test cihazları'), item: domain + base[lang] }];
  if (family) crumbs.push({ '@type': 'ListItem', position: 3, name: family.name, item: domain + route });
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(title)} | Labomak</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#0d141b">
    <link rel="canonical" href="${domain + route}">
    ${['en', 'tr'].map(l => `<link rel="alternate" hreflang="${l}" href="${domain + url(l, family)}">`).join('')}
    <link rel="alternate" hreflang="x-default" href="${domain + url('en', family)}">
    <meta property="og:title" content="${esc(title)} | Labomak"><meta property="og:description" content="${esc(description)}">
    <meta property="og:type" content="website"><meta property="og:url" content="${domain + route}">
    <meta property="og:image" content="${domain}/assets/products/${family?.id ?? 'duocol'}.png">
    <link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/catalogue.css">
    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs })}</script>`;
}

function photo(family, lang, eager = false) {
  return `<img src="/assets/products/${family.id}.png" alt="Labomak ${family.name} — ${esc(family[lang].label)}" width="500" height="500" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
}

function quote(lang, family) {
  return `<section class="enquiry section-shell" id="enquire"><div><p class="eyebrow">${t(lang, 'TALK TO OUR ENGINEERS', 'MÜHENDİSLERİMİZLE GÖRÜŞÜN')}</p><h2>${t(lang, 'Your sample.<br>Your system.', 'Sizin numuneniz.<br>Sizin sisteminiz.')}</h2>
    <p>${t(lang, 'Tell us about your sample and test method. We’ll help specify the equipment and options for your work.', 'Numunenizi ve test metodunu paylaşın. İşinize uygun ekipman ve seçenekleri belirlemenize yardımcı olalım.')}</p>
    <a class="text-link" href="mailto:info@labomak.com.tr">info@labomak.com.tr ↗</a></div>
    <form data-enquiry data-lang="${lang}"><div class="form-row"><label>${t(lang, 'Name', 'Ad soyad')}<input name="name" autocomplete="name" required></label><label>${t(lang, 'Company', 'Firma')}<input name="company" autocomplete="organization" required></label></div>
    <div class="form-row"><label>${t(lang, 'Work email', 'İş e-postası')}<input name="email" type="email" autocomplete="email" required></label><label>${t(lang, 'Country', 'Ülke')}<input name="country" autocomplete="country-name" required></label></div>
    <label>${t(lang, 'System of interest', 'İlgilendiğiniz sistem')}<select name="system"><option value="">${t(lang, 'Help me choose', 'Seçim için yardım istiyorum')}</option>${family && !families.some(f=>f.id===family.id)?`<option selected>${esc(family.name)}</option>`:''}${families.map(f => `<option${f.id === family?.id ? ' selected' : ''}>${f.name}</option>`).join('')}</select></label>
    <label>${t(lang, 'Your test requirements', 'Test ihtiyaçlarınız')}<textarea name="requirements" rows="4" required placeholder="${t(lang, 'Material, specimen dimensions, standard, expected load…', 'Malzeme, numune ölçüleri, standart, beklenen yük…')}"></textarea></label>
    <p class="email-explanation">${t(lang, 'This prepares an email in your email application. Review it and send it to Labomak there.', 'Bu form e-posta uygulamanızda bir taslak hazırlar. E-postayı orada kontrol edip Labomak’a gönderebilirsiniz.')}</p>
    <noscript><p>${t(lang, 'Please enable JavaScript to prepare a draft, or email info@labomak.com.tr directly.', 'Taslak hazırlamak için JavaScript’i etkinleştirin veya doğrudan info@labomak.com.tr adresine yazın.')}</p></noscript>
    <button class="button button-filled" type="submit" disabled>${t(lang, 'Prepare enquiry email', 'Talep e-postası hazırla')} <b>↗</b></button>
    <div data-enquiry-result hidden role="status"><p>${t(lang, 'Your enquiry is ready. Nothing has been sent yet.', 'Talebiniz hazır. Henüz hiçbir şey gönderilmedi.')}</p><a class="button button-filled" data-email-link>${t(lang, 'Open email application', 'E-posta uygulamasını aç')} ↗</a><label>${t(lang, 'Or copy this message', 'Veya bu mesajı kopyalayın')}<textarea data-email-body readonly rows="8"></textarea></label></div></form></section>`;
}

function comparison(lang) {
  const rows = [
    [t(lang, 'Drive', 'Tahrik'), t(lang, 'Stepper motor', 'Step motor'), t(lang, 'Servo motor', 'Servo motor'), t(lang, 'Servo motor', 'Servo motor')],
    [t(lang, 'Standard software', 'Standart yazılım'), 'Falcon Eko', 'Falcon Eko', 'Falcon Pro'],
    [t(lang, 'Falcon Pro upgrade', 'Falcon Pro yükseltme'), t(lang, 'Not available', 'Yok'), t(lang, 'Optional', 'Opsiyonel'), t(lang, 'Included', 'Dahil')],
    [t(lang, 'Typical workflow', 'Tipik kullanım'), t(lang, 'Routine tests and PDF reports', 'Rutin testler ve PDF raporları'), t(lang, 'Quality control with upgrade options', 'Yükseltme seçenekleriyle kalite kontrol'), t(lang, 'Analysis and archived test records', 'Analiz ve arşivli test kayıtları')]
  ];
  return `<section class="section-shell compare-section" id="compare"><p class="eyebrow">${t(lang, 'CONTROL & SOFTWARE', 'KONTROL VE YAZILIM')}</p><h2>${t(lang, 'Choose how you work.', 'Çalışma şeklinizi seçin.')}</h2><p>${t(lang, 'Choose the machine frame first. Then select the available equipment level for your testing workflow.', 'Önce cihaz gövdesini seçin. Ardından test iş akışınıza uygun donanım seviyesini belirleyin.')}</p>
    <div class="table-scroll" tabindex="0" role="region" aria-label="${t(lang, 'Equipment level comparison', 'Donanım seviyeleri karşılaştırması')}"><table><caption>${t(lang, 'Çeko, Kobi and Kompetan equipment levels', 'Çeko, Kobi ve Kompetan donanım seviyeleri')}</caption><thead><tr><th scope="col">${t(lang, 'Feature', 'Özellik')}</th><th scope="col">Çeko</th><th scope="col">Kobi</th><th scope="col">Kompetan</th></tr></thead><tbody>${rows.map(row => `<tr><th scope="row">${row[0]}</th>${row.slice(1).map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="small-note">${t(lang, 'Availability depends on the selected family and configuration. MultiTask and custom systems are specified separately.', 'Seçenekler ürün ailesine ve konfigürasyona bağlıdır. MultiTask ve özel sistemler ayrıca yapılandırılır.')}</p></section>`;
}

function overview(lang) {
  const title = t(lang, 'Universal & tensile testing machines', 'Üniversal ve çekme test cihazları');
  const intro = t(lang, 'From low-force specimens to demanding components. Explore the Labotens family and find the frame that fits your testing work.', 'Düşük kuvvetli numunelerden zorlu bileşen testlerine. Labotens ailesini keşfedin ve test işinize uygun gövdeyi bulun.');
  const body = `<section class="catalogue-hero section-shell"><div><p class="eyebrow">LABOTENS / ${t(lang, 'MATERIALS TESTING', 'MALZEME TESTLERİ')}</p><h1>${title}</h1><p>${intro}</p><div class="hero-actions"><a class="button button-filled" href="#families">${t(lang, 'Find your machine', 'Cihazınızı bulun')} ↓</a><a class="text-link" href="#compare">${t(lang, 'Compare equipment levels', 'Donanım seviyelerini karşılaştırın')} ↗</a></div></div><figure class="catalogue-hero-photo">${photo(families[1], lang, true)}<figcaption>DuoCol / ${t(lang, 'Dual-column systems', 'Çift kolonlu sistemler')}</figcaption></figure></section>
  <section id="families" class="section-shell family-section"><div class="section-title"><div><p class="eyebrow">${t(lang, 'THE MACHINE FAMILIES', 'CİHAZ AİLELERİ')}</p><h2>${t(lang, 'A frame for your application.', 'Uygulamanıza uygun bir gövde.')}</h2></div><p data-result-count aria-live="polite">${t(lang, '5 families', '5 ürün ailesi')}</p></div>
  <form class="catalogue-filters" data-catalogue-filter data-lang="${lang}" role="search"><label>${t(lang, 'Search the range', 'Ürün ailesi arayın')}<input type="search" name="search" placeholder="${t(lang, 'Name, material or configuration', 'İsim, malzeme veya konfigürasyon')}" autocomplete="off"></label><label>${t(lang, 'System type', 'Sistem tipi')}<select name="type"><option value="all">${t(lang, 'All systems', 'Tüm sistemler')}</option><option value="electromechanical">${t(lang, 'Electromechanical', 'Elektromekanik')}</option><option value="hydraulic">${t(lang, 'Hydraulic', 'Hidrolik')}</option><option value="custom">${t(lang, 'Custom engineered', 'Özel tasarım')}</option></select></label><button class="filter-reset" type="reset">${t(lang, 'Clear filters', 'Filtreleri temizle')} ↺</button></form>
  <div class="family-grid">${families.map((f, i) => `<article class="family-card" data-family data-type="${f.type}" data-search="${esc([f.name, f[lang].label, ...f[lang].materials].join(' '))}"><a class="family-photo" href="${url(lang, f)}">${photo(f, lang)}<span class="family-index">0${i + 1}</span></a><div class="family-content"><p class="family-capacity">${esc(f[lang].capacity)}</p><h3><a href="${url(lang, f)}">${f.id === 'custom' ? t(lang, 'Custom systems', 'Özel sistemler') : f.name} <span>↗</span></a></h3><p>${esc(f[lang].label)}</p><div class="material-tags">${f[lang].materials.map(m => `<span>${esc(m)}</span>`).join('')}</div><a class="family-detail-link" href="${url(lang, f)}">${t(lang, 'Discover the family', 'Ürün ailesini inceleyin')} →</a></div></article>`).join('')}</div>
  <div class="empty-results" data-no-results hidden><h3>${t(lang, 'No matching families.', 'Eşleşen ürün ailesi bulunamadı.')}</h3><p>${t(lang, 'Try a different material or clear the filters. Our engineers can also help with your sample.', 'Farklı bir malzeme deneyin veya filtreleri temizleyin. Mühendislerimiz numuneniz için yardımcı olabilir.')}</p><a href="#enquire" class="text-link">${t(lang, 'Discuss your test', 'Testinizi konuşalım')} ↗</a></div>
  <p class="small-note">${t(lang, 'Shown capacities are family limits. The rated force, travel and measurement specifications depend on the selected configuration.', 'Gösterilen kapasiteler ürün ailesinin sınırlarıdır. Nominal kuvvet, hareket mesafesi ve ölçüm özellikleri seçilen konfigürasyona bağlıdır.')}</p></section>
  ${familyModels(lang,'monocol')}${familyModels(lang,'duocol').replace('id="models"','id="duocol-models"')}${comparison(lang)}${quote(lang)}`;
  return document(lang, null, title, intro, body);
}

function detail(lang, f) {
  const d = f[lang];
  const body = `<section class="catalogue-hero detail-hero section-shell"><div><p class="eyebrow">LABOTENS / ${esc(d.layout)}</p><h1>${f.id === 'custom' ? t(lang, 'Your test.<br>Our engineering.', 'Sizin testiniz.<br>Bizim mühendisliğimiz.') : f.name}</h1><h2>${esc(d.label)}</h2><p>${esc(d.intro)}</p><div class="hero-actions"><a href="#enquire" class="button button-filled">${t(lang, 'Configure your system', 'Sisteminizi yapılandırın')} ↗</a><a href="${base[lang]}" class="text-link">${t(lang, 'Compare families', 'Aileleri karşılaştırın')} →</a></div></div><figure class="catalogue-hero-photo">${photo(f, lang, true)}<figcaption>${t(lang, 'Example configuration', 'Örnek konfigürasyon')} / ${f.name}</figcaption></figure></section>
  <div class="section-shell spec-strip"><div><span>${t(lang, 'FAMILY CAPACITY', 'AİLE KAPASİTESİ')}</span><strong>${esc(d.capacity)}</strong></div><div><span>${t(lang, 'FRAME', 'GÖVDE')}</span><strong>${esc(d.layout)}</strong></div><div><span>${t(lang, 'EQUIPMENT LEVELS', 'DONANIM SEVİYELERİ')}</span><strong>${f.tiers.length ? f.tiers.join(' / ') : t(lang, 'Application-specific', 'Uygulamaya özel')}</strong></div></div>
  <section class="section-shell product-story"><div><p class="eyebrow">${t(lang, 'BUILT FOR YOUR WORK', 'ÇALIŞMANIZ İÇİN ÜRETİLDİ')}</p><h2>${esc(d.use)}</h2><div class="material-tags">${d.materials.map(m => `<span>${esc(m)}</span>`).join('')}</div></div><div><ul class="feature-list">${d.features.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div></section>
  <section class="section-shell selection-note"><div><p class="eyebrow">${t(lang, 'SPECIFY THE COMPLETE SYSTEM', 'TÜM SİSTEMİ BİRLİKTE BELİRLEYİN')}</p><h2>${t(lang, 'The right frame is the start.', 'Doğru gövde bir başlangıçtır.')}</h2></div><div><p>${esc(d.guidance)}</p><p>${t(lang, 'Confirm the applicable method, grips, strain measurement, software and safety arrangement with the final system specification.', 'Uygulanacak metodu, çeneleri, uzama ölçümünü, yazılımı ve güvenlik düzenini nihai sistem özellikleriyle birlikte teyit edin.')}</p><a class="text-link" href="${brochure}">${t(lang, 'Existing comparison brochure (Turkish PDF)', 'Mevcut karşılaştırma broşürü (Türkçe PDF)')} ↗</a></div></section>
  ${familyModels(lang,f.id)}${quote(lang, f)}<section class="section-shell related-families"><h2>${t(lang, 'Explore other families', 'Diğer ürün aileleri')}</h2><div>${families.filter(other => other.id !== f.id).map(other => `<a href="${url(lang, other)}">${other.name}<span>↗</span></a>`).join('')}</div></section>`;
  return document(lang, f, `${f.name} — ${d.label}`, d.intro, body);
}

function document(lang, family, title, description, body) {
  return `<!doctype html><html lang="${lang}"><head>${metadata(lang, family, title, description)}</head><body class="catalogue-page"><a class="skip-link" href="#main">${t(lang, 'Skip to content', 'İçeriğe geç')}</a>${header(lang, family)}<main id="main"><nav class="breadcrumbs section-shell" id="top" aria-label="${t(lang, 'Breadcrumb', 'Sayfa yolu')}"><a href="${home(lang)}">Labomak</a><span>/</span>${family ? `<a href="${base[lang]}">${t(lang, 'Universal testing machines', 'Üniversal test cihazları')}</a><span>/</span><span aria-current="page">${family.name}</span>` : `<span aria-current="page">${t(lang, 'Universal testing machines', 'Üniversal test cihazları')}</span>`}</nav>${body}</main>${footer(lang)}<script src="/script.js" defer></script><script src="/catalogue.js" defer></script></body></html>`;
}

export function build() {
  fs.mkdirSync(out, { recursive: true });
  for (const file of ['styles.css', 'script.js', 'catalogue.css', 'catalogue.js', 'logo.png', 'home.css', 'home.js', 'tensile-geometry.js']) fs.copyFileSync(path.join(root, file), path.join(out, file));
  fs.cpSync(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
  for (const lang of ['en', 'tr']) {
    const seo = homepageSeo(lang);
    let html = inputs[lang].replace(/<header[\s\S]*?<main/, header(lang, null, true) + '<main');
    html = localiseNavigation(html, lang)
      .replace(/href="(?:\.\.\/)?styles.css"/g, 'href="/styles.css"><link rel="stylesheet" href="/catalogue.css"')
      .replace(/src="(?:\.\.\/)?script.js"/g, 'src="/script.js"')
      .replace('</body>', '<script src="/catalogue.js" defer></script></body>')
      .replace(/<footer[\s\S]*?<\/footer>/, footer(lang));
    html = html.replace(/<main[\s\S]*?<\/main>/, `<main id="main">${homepage(lang,quote)}</main>`)
      .replace('<body>', '<body class="landing-page">')
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`)
      .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/, `<meta name="description" content="${esc(seo.description)}">`)
      .replace(/<meta property="og:title" content="[^"]*"\s*\/?\s*>/, `<meta property="og:title" content="${esc(seo.title)}">`)
      .replace(/<meta property="og:description" content="[^"]*"\s*\/?\s*>/, `<meta property="og:description" content="${esc(seo.description)}">`)
      .replace('</head>', seo.extra + '</head>');
    write(home(lang), html);
    write(base[lang], overview(lang));
    for (const family of families) write(url(lang, family), detail(lang, family));
  }
  buildPortfolio({header,footer,quote,write});
  const pairs = [{ en: home('en'), tr: home('tr') }, { en: base.en, tr: base.tr }, ...families.map(f => ({ en: url('en', f), tr: url('tr', f) })), ...portfolioPairs];
  const sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' + pairs.flatMap(pair => ['en', 'tr'].map(lang => `<url><loc>${domain + pair[lang]}</loc>${['en', 'tr'].map(l => `<xhtml:link rel="alternate" hreflang="${l}" href="${domain + pair[l]}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${domain + pair.en}"/></url>`)).join('') + '</urlset>';
  fs.writeFileSync(path.join(out, 'sitemap.xml'), sitemap);
  fs.writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${domain}/sitemap.xml\n`);
  applySiteBasePath();
  console.log(`Built ${pairs.length*2} static pages in dist/ (English and Turkish).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) build();
