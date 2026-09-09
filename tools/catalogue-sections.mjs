import fs from 'node:fs';
import { specifications, variantComparisons } from '../data/technical-content.mjs';
import { documents, documentKinds, documentsFor, resourceUrl } from '../data/resources.mjs';
import { fixtureGroups, fixtureUrl } from '../data/fixtures.mjs';
import { buildFixturePages } from './fixture-pages.mjs';
export { fixtureDirectory } from './fixture-pages.mjs';
import { tr as t, productById, productUrl, categoryUrl } from '../data/portfolio.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const assets=new Map(JSON.parse(fs.readFileSync(new URL('../data/portfolio-assets.json',import.meta.url),'utf8')).map(a=>[a.id,a.local]));
const kindName=(kind,lang)=>documentKinds.find(k=>k[0]===kind)[lang==='tr'?2:1];
const link=(href,label)=>`<a href="${esc(href)}">${esc(label)}</a>`;
export const sectionPairs=[{en:resourceUrl('en'),tr:resourceUrl('tr')},...fixtureGroups.map(g=>({en:fixtureUrl('en',g.id),tr:fixtureUrl('tr',g.id)}))];

export function technicalNavigation(p,lang){
  const links=[['#product-overview',t(lang,'Overview','Genel bakış')]];
  if(specifications[p.id])links.push(['#specifications',t(lang,'Specifications','Teknik özellikler')]);
  if(variantComparisons[p.id])links.push(['#product-variants',t(lang,'Compare versions','Versiyonları karşılaştırın')]);
  if(p.id==='55')links.push(['#hammer-options',t(lang,'Hammer options','Çekiç seçenekleri')]);
  links.push(['#product-documents',t(lang,'Documents & references','Dokümanlar ve referanslar')],['#enquire',t(lang,'Enquire','Bilgi alın')]);
  return `<nav class="section-shell product-section-nav" aria-label="${t(lang,'On this product page','Bu ürün sayfasında')}">${links.map(([href,label])=>link(href,label)).join('')}</nav>`;
}
export function technicalContent(p,lang){
  const rows=specifications[p.id];
  let html=rows?`<section class="section-shell technical-section" id="specifications"><p class="eyebrow">${t(lang,'TECHNICAL DATA','TEKNİK VERİLER')}</p><h2>${t(lang,'Specifications at a glance.','Teknik özelliklere bir bakış.')}</h2><p>${t(lang,'Match the listed configuration and options to your specimen and test procedure.','Listelenen konfigürasyon ve seçenekleri numunenize ve test prosedürünüze göre belirleyin.')}</p><table class="specification-table"><caption>${esc(p.name[lang])}</caption><thead><tr><th scope="col">${t(lang,'Parameter','Parametre')}</th><th scope="col">${t(lang,'Specification','Özellik')}</th></tr></thead><tbody>${rows.map(r=>`<tr><th scope="row">${esc(r.label[lang])}</th><td>${esc(r.value[lang])}</td></tr>`).join('')}</tbody></table></section>`:'';
  const comparison=variantComparisons[p.id];
  if(comparison)html+=`<section class="section-shell technical-section" id="product-variants"><p class="eyebrow">${t(lang,'CONFIGURATION CHOICES','KONFİGÜRASYON SEÇENEKLERİ')}</p><h2>${t(lang,'Choose the workflow.','Çalışma şeklinizi seçin.')}</h2><div class="table-scroll" tabindex="0" role="region" aria-label="${t(lang,'Version comparison, scroll horizontally','Versiyon karşılaştırması, yatay kaydırılabilir')}"><table class="variant-table"><caption>${esc(p.name[lang])} — ${t(lang,'version comparison','versiyon karşılaştırması')}</caption><thead><tr><th scope="col">${t(lang,'Feature','Özellik')}</th>${comparison.columns.map(c=>`<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${comparison.rows.map(r=>`<tr><th scope="row">${esc(r.label[lang==='tr'?1:0])}</th>${r.values.map(v=>`<td>${esc(v[lang==='tr'?1:0])}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
  if(p.id==='55'){
    const hammers=p.source.tables[0].filter(row=>['ISO 179-1','ISO 180'].includes(row[0]));
    html+=`<section class="section-shell technical-section" id="hammer-options"><p class="eyebrow">${t(lang,'PENDULUM SELECTION','SARKAÇ SEÇİMİ')}</p><h2>${t(lang,'Match the hammer to the method.','Çekici metoda göre seçin.')}</h2><p>${t(lang,'Select the hammer, fixture and specimen geometry together. The listed options apply to different pendulum configurations.','Çekiç, fikstür ve numune geometrisini birlikte seçin. Listelenen seçenekler farklı sarkaç konfigürasyonları içindir.')}</p><div class="table-scroll" tabindex="0" role="region" aria-label="${t(lang,'Hammer options, scroll horizontally','Çekiç seçenekleri, yatay kaydırılabilir')}"><table><caption>${t(lang,'Charpy / Izod hammer options','Charpy / İzod çekiç seçenekleri')}</caption><thead><tr>${[t(lang,'Method reference','Metot referansı'),t(lang,'Energy','Enerji'),t(lang,'Strike centre (mm)','Vurma merkezi (mm)'),t(lang,'Drop angle (°)','Düşme açısı (°)'),t(lang,'Weight (kg)','Ağırlık (kg)')].map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${hammers.map(r=>`<tr><th scope="row">${esc(r[0])}</th>${r.slice(1).map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
  }
  return html;
}
export function namedProductDocuments(p,lang){
  return documentsFor(p).map(d=>`<a class="resource-link" href="${esc(d.url)}">${esc(d.name[lang])} · PDF ↗</a>`).join('')+`<a class="resource-link" href="${resourceUrl(lang)}">${t(lang,'Browse the document library','Doküman kütüphanesini keşfedin')} →</a>`;
}
export function buildSectionPages({lang,page,quote}){
  buildFixturePages({lang,page,quote});
  const title=t(lang,'Brochures & technical documents','Broşürler ve teknik dokümanlar');
  const intro=t(lang,'Find product brochures, operating guides, family comparisons and example reports.','Ürün broşürlerini, kullanım kılavuzlarını, ürün ailesi karşılaştırmalarını ve örnek raporları bulun.');
  const body=`<section class="section-shell directory-hero resource-hero"><p class="eyebrow">LABOMAK / ${t(lang,'RESOURCES','KAYNAKLAR')}</p><h1>${title}</h1><p>${intro}</p></section><section class="section-shell family-section" id="documents"><div class="section-title"><h2>${t(lang,'The document library.','Doküman kütüphanesi.')}</h2><p data-document-count aria-live="polite">${documents.length} ${t(lang,'documents','doküman')}</p></div><form class="catalogue-filters" data-resource-filter data-lang="${lang}" role="search"><label>${t(lang,'Find a document','Doküman arayın')}<input type="search" name="search" placeholder="${t(lang,'Product or document name…','Ürün veya doküman adı…')}"></label><label>${t(lang,'Document type','Doküman türü')}<select name="kind"><option value="all">${t(lang,'All documents','Tüm dokümanlar')}</option>${documentKinds.map(k=>`<option value="${k[0]}">${esc(k[lang==='tr'?2:1])}</option>`).join('')}</select></label><button type="reset" class="filter-reset">${t(lang,'Clear filters','Filtreleri temizle')} ↺</button></form><div class="document-grid">${documents.map(d=>`<article class="document-card" id="${d.id}" data-document data-kind="${d.kind}" data-search="${esc(d.name.en+' '+d.name.tr)}"><div class="document-kind"><span>PDF</span><span>${esc(kindName(d.kind,lang))}</span></div><h3>${esc(d.name[lang])}</h3><div class="document-products">${d.productIds.slice(0,3).map(id=>{const p=productById.get(Number(id));return link(productUrl(lang,p),p.name[lang]);}).join('')}</div><a class="document-open" href="${esc(d.url)}">${t(lang,'Open PDF','PDF aç')} ↗</a></article>`).join('')}</div><div class="empty-results" data-no-documents hidden><h3>${t(lang,'No matching documents.','Eşleşen doküman bulunamadı.')}</h3><p>${t(lang,'Try the product name or clear the filters.','Ürün adını deneyin veya filtreleri temizleyin.')}</p></div></section>${quote(lang)}`;
  page(lang,{en:resourceUrl('en'),tr:resourceUrl('tr')},title,intro,body,[{name:t(lang,'Resources','Kaynaklar'),url:resourceUrl(lang)}],false);
}
