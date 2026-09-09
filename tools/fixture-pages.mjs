import fs from 'node:fs';
import { fixtureGroups, fixtureItems, fixtureUrl } from '../data/fixtures.mjs';
import { tr as t, categoryUrl } from '../data/portfolio.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const assets=new Map(JSON.parse(fs.readFileSync(new URL('../data/portfolio-assets.json',import.meta.url),'utf8')).map(a=>[a.id,a.local]));
const description=lang=>t(lang,'Browse by fixture type, material or test standard. Original Turkish descriptions accompany each image; discuss the final configuration with our engineers.','Fikstür türüne, malzemeye veya test standardına göre arayın. Her görselin orijinal açıklamasını inceleyin; nihai konfigürasyonu mühendislerimizle belirleyin.');

function groupLinks(lang){
  return `<nav class="fixture-group-links" aria-label="${t(lang,'Fixture collections','Fikstür koleksiyonları')}">${fixtureGroups.map(g=>`<a href="${fixtureUrl(lang,g.id)}">${esc(g.name[lang])}<span>${g.examples.length}</span></a>`).join('')}</nav>`;
}
function gallery(lang,group){
  const items=group?group.examples.map(e=>({...e,groups:[group],captions:[e.image.caption]})):fixtureItems;
  return `<section class="section-shell fixture-library" id="${group?'fixture-options':'fixture-examples'}" data-fixture-library data-lang="${lang}">
    <div class="section-title"><div><p class="eyebrow">${t(lang,'THE FIXTURE COLLECTION','FİKSTÜR KOLEKSİYONU')}</p><h2>${group?t(lang,'Explore every configuration.','Tüm konfigürasyonları inceleyin.'):t(lang,'Find the right contact.','Doğru kavramayı bulun.')}</h2></div><p class="fixture-total">${items.length}<span>${t(lang,'illustrated examples','görselli örnek')}</span></p></div>
    <p>${description(lang)}</p>
    ${group?'':`<details class="fixture-collections"><summary>${t(lang,'Browse all 18 collections','18 koleksiyonun tümünü keşfedin')}</summary>${groupLinks(lang)}</details>`}
    <form class="catalogue-filters" data-fixture-filter role="search"><label>${t(lang,'Search fixtures','Fikstür arayın')}<input type="search" name="search" placeholder="${t(lang,'e.g. textile, ASTM, ISO, kauçuk…','Örn. tekstil, ASTM, ISO, kauçuk…')}"></label>${group?'':`<label>${t(lang,'Collection','Koleksiyon')}<select name="group"><option value="all">${t(lang,'All collections','Tüm koleksiyonlar')}</option>${fixtureGroups.map(g=>`<option value="${g.id}">${esc(g.name[lang])} (${g.examples.length})</option>`).join('')}</select></label>`}<button type="reset" class="filter-reset">${t(lang,'Clear filters','Filtreleri temizle')} ↺</button></form>
    <p class="fixture-result-count" data-fixture-count aria-live="polite">${items.length} ${t(lang,'examples','örnek')}</p>
    <div class="fixture-library-grid">${items.map(e=>`<article class="fixture-card" id="${e.image.id}" data-fixture data-groups="${e.groups.map(g=>g.id).join(' ')}" data-search="${esc([...e.captions,...e.groups.flatMap(g=>[g.name.en,g.name.tr])].join(' '))}">
      <a class="fixture-image-link" href="${esc(e.image.url)}" data-fixture-preview aria-label="${esc(t(lang,'Enlarge image: ','Görseli büyüt: ')+e.image.caption)}"><img src="${assets.get(e.image.id)}" alt="${esc(e.image.caption)}" lang="tr" width="300" height="300" loading="lazy" decoding="async"><span aria-hidden="true">↗</span></a>
      <div class="fixture-card-body"><div class="fixture-tags">${e.groups.map(g=>`<a href="${fixtureUrl(lang,g.id)}">${esc(g.name[lang])}</a>`).join('')}</div><h3 lang="tr">${esc(e.image.caption)}</h3><div class="fixture-card-actions"><a href="#enquire" data-fixture-enquire data-caption="${esc(e.image.caption)}" data-source="${esc(e.groups[0].source.source_url)}">${t(lang,'Enquire','Bilgi alın')} ↗</a><a href="${esc(e.groups[0].source.source_url)}">${t(lang,'Source','Kaynak')} ↗</a></div></div></article>`).join('')}</div>
    <div class="empty-results" data-fixture-empty hidden><h3>${t(lang,'No matching fixtures.','Eşleşen fikstür bulunamadı.')}</h3><p>${t(lang,'Try a material, a standard number or another collection.','Bir malzeme, standart numarası veya başka bir koleksiyon deneyin.')}</p></div>
    <button class="button fixture-more" type="button" data-fixture-more hidden>${t(lang,'Show more examples','Daha fazla örnek göster')} ↓</button>
    <dialog class="fixture-dialog" aria-label="${t(lang,'Fixture image','Fikstür görseli')}"><button type="button" data-fixture-close aria-label="${t(lang,'Close image','Görseli kapat')}">×</button><img data-fixture-large alt=""><p data-fixture-caption lang="tr"></p><a data-fixture-original>${t(lang,'Open original image','Orijinal görseli aç')} ↗</a></dialog>
  </section>`;
}
export const fixtureDirectory=lang=>gallery(lang);
export function buildFixturePages({lang,page,quote}){
  for(const g of fixtureGroups){
    const body=`<section class="section-shell directory-hero fixture-hero"><p class="eyebrow">LABOMAK / ${t(lang,'GRIPS & FIXTURES','ÇENELER VE FİKSTÜRLER')}</p><h1>${esc(g.name[lang])}</h1><p>${esc(g.intro[lang])}</p><a class="text-link" href="${categoryUrl(lang,'fixtures')}">← ${t(lang,'All grips & fixtures','Tüm çeneler ve fikstürler')}</a></section>${gallery(lang,g)}<section class="section-shell product-reference"><div><h2>${t(lang,'Specify your setup.','Düzeneğinizi belirleyin.')}</h2><p>${t(lang,'Share the specimen dimensions, test method, expected force and machine connection. Contact surfaces and fixture dimensions depend on the application.','Numune ölçülerini, test metodunu, beklenen kuvveti ve cihaz bağlantısını paylaşın. Temas yüzeyleri ve fikstür ölçüleri uygulamaya göre belirlenir.')}</p></div><a class="resource-link" href="${g.source.source_url}">${t(lang,'Original collection','Orijinal koleksiyon')} ↗</a></section>${quote(lang,{id:'fixture-'+g.id,name:g.name[lang]})}<section class="section-shell family-section"><h2>${t(lang,'Explore the other collections.','Diğer koleksiyonları keşfedin.')}</h2>${groupLinks(lang)}</section>`;
    page(lang,{en:fixtureUrl('en',g.id),tr:fixtureUrl('tr',g.id)},g.name[lang],g.intro[lang],body,[{name:t(lang,'Grips & fixtures','Çeneler ve fikstürler'),url:categoryUrl(lang,'fixtures')},{name:g.name[lang],url:fixtureUrl(lang,g.id)}]);
  }
}
