import fs from 'node:fs';
import { applicationGuideById } from '../data/application-guides.mjs';
import { applicationBody, applicationHub, applicationImage } from './application-pages.mjs';
import { highlights } from '../data/product-highlights.mjs';
import { technicalNavigation, technicalContent, namedProductDocuments, fixtureDirectory, buildSectionPages, sectionPairs } from './catalogue-sections.mjs';
import { resourceUrl, documentKinds } from '../data/resources.mjs';
import { fixtureGroups, fixtureItems } from '../data/fixtures.mjs';
import { products, productUrl, productById, categories, categoryById, categoryUrl, catalogRoot, groups, groupUrl, groupProducts, selection, inventory, tr as t } from '../data/portfolio.mjs';
const domain='https://labomak.com.tr';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const manifest=JSON.parse(fs.readFileSync(new URL('../data/portfolio-assets.json',import.meta.url),'utf8'));
const assets=new Map(manifest.map(a=>[a.id,a.local]));
const imageUrl=p=>p.existingFamily?'/assets/products/'+p.existingFamily+'.png':assets.get(p.image?.id);
const photo=(p,lang,eager=false)=>imageUrl(p)?`<img src="${imageUrl(p)}" alt="${esc(p.name[lang])}" width="500" height="500" ${eager?'fetchpriority="high"':'loading="lazy"'}>`:'';
const a=(href,label)=>`<a href="${href}">${esc(label)}</a>`;
const categoryLink=(lang,c)=>a(categoryUrl(lang,c.id),c[lang]);
const groupLink=(lang,kind,g)=>a(groupUrl(lang,kind,g[0]),g[lang==='tr'?2:1]);

function menu(label,introLabel,intro,url,columns){
  return `<details class="nav-mega"><summary>${esc(label)}</summary><div class="mega-menu"><div class="mega-intro"><span>${esc(introLabel)}</span><strong>${esc(intro)}</strong><a href="${url}">${esc(label)} <b>→</b></a></div>${columns.map(([heading,links])=>`<div class="mega-column"><h3>${esc(heading)}</h3>${links.join('')}</div>`).join('')}</div></details>`;
}
export function portfolioNavigation(html,lang){
  const nav=html.match(/<nav class="desktop-nav"[\s\S]*?<\/nav>/)?.[0];
  if(!nav)return html;
  const old=[...nav.matchAll(/<details class="nav-mega">[\s\S]*?<\/details>/g)].map(m=>m[0]);
  const replacements=[
    menu(t(lang,'Products','Ürünler'),'01 / LABOMAK',t(lang,'Find the equipment for your test.','Testinize uygun ekipmanı bulun.'),catalogRoot(lang),[
      [t(lang,'Machines & systems','Cihazlar ve sistemler'),categories.slice(0,6).map(c=>categoryLink(lang,c))],
      [t(lang,'Specialist equipment','Özel ekipmanlar'),[...categories.slice(6,10).map(c=>categoryLink(lang,c)),a(categoryUrl(lang,'universal')+'custom/',t(lang,'Custom test systems','Özel test sistemleri')),a(catalogRoot(lang),t(lang,'View all products →','Tüm ürünleri görün →'))]]]),
    menu(t(lang,'Applications','Uygulamalar'),'02 / '+t(lang,'TEST METHODS','TEST METOTLARI'),t(lang,'Start with what you need to measure.','Ölçmek istediğiniz sonuçla başlayın.'),groupUrl(lang,'applications'),[
      [t(lang,'Mechanical tests','Mekanik testler'),groups.applications.slice(0,6).map(g=>groupLink(lang,'applications',g))],
      [t(lang,'Performance tests','Performans testleri'),groups.applications.slice(6).map(g=>groupLink(lang,'applications',g))]]),
    menu(t(lang,'Industries','Sektörler'),'03 / '+t(lang,'YOUR INDUSTRY','SEKTÖRÜNÜZ'),t(lang,'Explore equipment for your materials.','Malzemelerinize uygun ekipmanları keşfedin.'),groupUrl(lang,'industries'),[
      [t(lang,'Materials & production','Malzeme ve üretim'),groups.industries.slice(0,5).map(g=>groupLink(lang,'industries',g))],
      [t(lang,'Components & specialist sectors','Bileşenler ve özel sektörler'),groups.industries.slice(5).map(g=>groupLink(lang,'industries',g))]])
  ];
  let updated=nav;
  old.slice(0,3).forEach((s,i)=>{updated=updated.replace(s,replacements[i]);});
  updated=updated.replace(old[4],menu(t(lang,'Resources','Kaynaklar'),'05 / '+t(lang,'TECHNICAL LIBRARY','TEKNİK KÜTÜPHANE'),t(lang,'The details behind your equipment.','Ekipmanınızın teknik ayrıntıları.'),resourceUrl(lang),[
    [t(lang,'Browse documents','Dokümanları keşfedin'),documentKinds.map(k=>a(resourceUrl(lang)+'?kind='+k[0]+'#documents',k[lang==='tr'?2:1]))],
    [t(lang,'Equipment selection','Ekipman seçimi'),[a(categoryUrl(lang,'universal'),t(lang,'Compare testing systems','Test sistemlerini karşılaştırın')),a(categoryUrl(lang,'fixtures'),t(lang,'Find grips and fixtures','Çene ve fikstür bulun')),a(resourceUrl(lang),t(lang,'All documents →','Tüm dokümanlar →'))]]
  ]));
  updated=updated.replace(/<a\b[^>]*>([^<]*(?:Falcon|Falcon')[^<]*)<\/a>/gi,(whole,label)=>{
    const fragment=/Eko/i.test(label)?'#eko':/Pro/i.test(label)?'#pro':'';
    return a(productUrl(lang,productById.get(274))+fragment,label);
  });
  updated=updated.replace(/href="#falcon"/g,`href="${productUrl(lang,productById.get(274))}"`);
  return html.replace(nav,updated);
}

export const portfolioPairs=[
  ...sectionPairs,
  {en:catalogRoot('en'),tr:catalogRoot('tr')},
  ...categories.filter(c=>c.id!=='universal').map(c=>({en:categoryUrl('en',c.id),tr:categoryUrl('tr',c.id)})),
  ...products.filter(p=>!p.existingFamily).map(p=>({en:productUrl('en',p),tr:productUrl('tr',p)})),
  ...Object.entries(groups).flatMap(([kind,items])=>['',...items.map(g=>g[0])].map(id=>({en:groupUrl('en',kind,id),tr:groupUrl('tr',kind,id)})))
];

function cards(items,lang){
  return `<div class="family-grid equipment-grid">${items.map(p=>`<article class="family-card" data-family data-type="${p.category}" data-search="${esc([p.name.en,p.name.tr,p.intro[lang],p.source.name_tr,...p.source.source_categories.map(c=>c.name_tr)].join(' '))}"><a class="family-photo" href="${productUrl(lang,p)}" aria-label="${esc(p.name[lang])}">${photo(p,lang)}</a><div class="family-content"><p class="family-capacity">${esc(categoryById.get(p.category)[lang])}</p><h3>${a(productUrl(lang,p),p.name[lang])}</h3><p>${esc(p.intro[lang])}</p><a class="family-detail-link" href="${productUrl(lang,p)}">${t(lang,'Explore product','Ürünü inceleyin')} →</a></div></article>`).join('')}</div>`;
}
function filters(lang,items){
  return `<form class="catalogue-filters" data-catalogue-filter data-unit="products" data-lang="${lang}" role="search"><label>${t(lang,'Search products','Ürün arayın')}<input type="search" name="search" placeholder="${t(lang,'Product, material or test…','Ürün, malzeme veya test…')}" autocomplete="off"></label><label>${t(lang,'Equipment group','Ekipman grubu')}<select name="type"><option value="all">${t(lang,'All groups','Tüm gruplar')}</option>${categories.filter(c=>items.some(p=>p.category===c.id)).map(c=>`<option value="${c.id}">${esc(c[lang])}</option>`).join('')}</select></label><button type="reset" class="filter-reset">${t(lang,'Clear filters','Filtreleri temizle')} ↺</button></form>`;
}
function listing(items,lang){
  return `<section class="section-shell family-section" id="equipment"><div class="section-title"><h2>${t(lang,'Explore the equipment.','Ekipmanları keşfedin.')}</h2><p data-result-count aria-live="polite">${items.length} ${t(lang,'products','ürün')}</p></div>${filters(lang,items)}${cards(items,lang)}<div class="empty-results" data-no-results hidden><h3>${t(lang,'No matching products.','Eşleşen ürün bulunamadı.')}</h3><p>${t(lang,'Try another term or clear the filters.','Başka bir kelime deneyin veya filtreleri temizleyin.')}</p><a href="#enquire" class="text-link">${t(lang,'Ask about your test','Testiniz için bize ulaşın')} →</a></div></section>`;
}
function categoryTiles(lang){
  return `<nav class="category-tiles section-shell" aria-label="${t(lang,'Product categories','Ürün kategorileri')}">${categories.map((c,i)=>`<a href="${categoryUrl(lang,c.id)}"><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(c[lang])}</strong><b>↗</b></a>`).join('')}</nav>`;
}
function hero(title,intro,lang,p){
  return `<section class="catalogue-hero section-shell portfolio-hero"><div><p class="eyebrow">LABOMAK / ${t(lang,'TEST EQUIPMENT','TEST EKİPMANLARI')}</p><h1>${esc(title)}</h1><p>${esc(intro)}</p><div class="hero-actions"><a href="#equipment" class="button button-filled">${t(lang,'Explore equipment','Ekipmanları inceleyin')} ↓</a><a class="text-link" href="#enquire">${t(lang,'Get selection advice','Seçim desteği alın')} ↗</a></div></div><figure class="catalogue-hero-photo">${photo(p,lang,true)}<figcaption>${esc(p.name[lang])}</figcaption></figure></section>`;
}
function setup(category,lang){
  return `<section class="section-shell product-story"><div><p class="eyebrow">${t(lang,'SPECIFY YOUR TEST','TESTİNİZİ TANIMLAYIN')}</p><h2>${t(lang,'A setup that fits your specimen.','Numunenize uygun bir düzenek.')}</h2><p>${t(lang,'Share these details so we can define the equipment and options for your work.','İşinize uygun ekipman ve seçenekleri belirlememiz için bu bilgileri paylaşın.')}</p></div><ul class="feature-list">${selection[category].map(row=>`<li>${esc(row[lang==='tr'?1:0])}</li>`).join('')}</ul></section>`;
}
function productHighlights(p,lang){
  if(!highlights[p.id])return '';
  return `<section class="section-shell product-story product-highlights"><div><p class="eyebrow">${t(lang,'PRODUCT OVERVIEW','ÜRÜNE GENEL BAKIŞ')}</p><h2>${t(lang,'Built around the test.','Teste göre tasarlandı.')}</h2></div><ul class="feature-list">${highlights[p.id].map(row=>`<li>${esc(row[lang==='tr'?1:0])}</li>`).join('')}</ul></section>`;
}
function fixtureExamples(lang){ return fixtureDirectory(lang); }
function accessoryOptions(lang){
  const names={227:['Touchscreen computers','Dokunmatik bilgisayarlar'],228:['Additional displays','İlave ekranlar'],229:['Extensometers','Ekstansometreler'],230:['Hand controls','El kumandaları']};
  return `<section class="section-shell family-section" id="equipment"><h2>${t(lang,'Complete the test station.','Test istasyonunu tamamlayın.')}</h2><div class="accessory-grid">${[227,228,229,230].map(id=>{const s=inventory.products.find(p=>p.id==='wp-category-'+id);const name=names[id][lang==='tr'?1:0];return `<article class="accessory-card">${s.images[0]?`<img src="${assets.get(s.images[0].id)}" alt="${esc(name)}" width="300" height="230" loading="lazy">`:''}<h3>${esc(name)}</h3><p>${t(lang,'Select with your machine model and controller.','Cihaz modeliniz ve kontrolörünüzle birlikte seçin.')}</p><a href="#enquire" class="text-link">${t(lang,'Discuss compatibility','Uyumluluğu görüşün')} →</a></article>`;}).join('')}</div></section>`;
}
function software(lang){
  return `<section class="section-shell software-options"><article id="eko"><p class="eyebrow">FALCON EKO</p><h2>${t(lang,'Everyday testing. Clear reports.','Günlük testler. Açık raporlar.')}</h2><ul class="feature-list"><li>${t(lang,'Live numerical and graphical results','Canlı sayısal ve grafik sonuçlar')}</li><li>${t(lang,'Comparison of up to 10 tests','10 teste kadar karşılaştırma')}</li><li>${t(lang,'Reports with your company logo and PDF output','Firma logolu raporlar ve PDF çıktısı')}</li></ul></article><article id="pro"><p class="eyebrow">FALCON PRO</p><h2>${t(lang,'Deeper analysis. A lasting record.','Ayrıntılı analiz. Kalıcı kayıt.')}</h2><ul class="feature-list"><li>${t(lang,'Archived test records and automatic backups','Arşivlenen test kayıtları ve otomatik yedekleme')}</li><li>${t(lang,'User accounts and access permissions','Kullanıcı hesapları ve erişim yetkileri')}</li><li>${t(lang,'Comparison of up to 100 tests','100 teste kadar karşılaştırma')}</li></ul></article></section>`;
}
const facts={
  668:[['Force capacity','Kuvvet kapasitesi','±5 kN'],['Frequency','Frekans','5 Hz'],['Stroke','Strok','±10 mm']],
  4775:[['Maximum force','Maksimum kuvvet','50 kN'],['Touchscreen','Dokunmatik ekran','7″']],
  4619:[['Horizontal clamping load','Yatay sıkma yükü','100 kN'],['Vertical compression load','Dikey basma yükü','100 kN']]
};
export function familyModels(lang,familyId){
  const items=products.filter(p=>p.family===familyId);
  if(!items.length)return '';
  return `<section class="section-shell family-section" id="models"><p class="eyebrow">${t(lang,'EXPLORE THE MODELS','MODELLERİ KEŞFEDİN')}</p><h2>${t(lang,'Choose your equipment level.','Donanım seviyenizi seçin.')}</h2>${cards(items,lang)}</section>`;
}

export function buildPortfolio({header,footer,quote,write}){
  function page(lang,pair,title,intro,body,crumbs=[],includeCatalogueRoot=true,seo={}){
    const route=pair[lang];
    let sharedHeader=header(lang,null).replace(/(<a[^>]*href=")[^"]+(" lang="(en|tr)")/g,(_,a,b,l)=>a+pair[l]+b);
    const schema={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{name:'Labomak',url:lang==='tr'?'/tr/':'/'},...(includeCatalogueRoot?[{name:t(lang,'Products','Ürünler'),url:catalogRoot(lang)}]:[]),...crumbs].map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:domain+c.url}))};
    write(route,`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} | Labomak</title><meta name="description" content="${esc(intro)}"><meta name="theme-color" content="#0d141b"><link rel="canonical" href="${domain+route}">${['en','tr'].map(l=>`<link rel="alternate" hreflang="${l}" href="${domain+pair[l]}">`).join('')}<link rel="alternate" hreflang="x-default" href="${domain+pair.en}"><meta property="og:title" content="${esc(title)} | Labomak"><meta property="og:description" content="${esc(intro)}"><meta property="og:type" content="website">${seo.image?`<meta property="og:image" content="${domain+seo.image}"><meta property="og:image:alt" content="${esc(seo.imageAlt||title)}">`:""}<meta property="og:url" content="${domain+route}"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/catalogue.css"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head><body class="catalogue-page portfolio-page"><a class="skip-link" href="#main">${t(lang,'Skip to content','İçeriğe geç')}</a>${sharedHeader}<main id="main"><nav class="breadcrumbs section-shell" id="top" aria-label="${t(lang,'Breadcrumb','Sayfa yolu')}">${a(lang==='tr'?'/tr/':'/','Labomak')}<span>/</span>${!includeCatalogueRoot?crumbs.map((c,i)=>`${i?"<span>/</span>":""}${i===crumbs.length-1?`<span aria-current="page">${esc(c.name)}</span>`:a(c.url,c.name)}`).join(''):route===catalogRoot(lang)?`<span aria-current="page">${t(lang,'Products','Ürünler')}</span>`:a(catalogRoot(lang),t(lang,'Products','Ürünler'))+crumbs.map((c,i)=>`<span>/</span>${i===crumbs.length-1?`<span aria-current="page">${esc(c.name)}</span>`:a(c.url,c.name)}`).join('')}</nav>${body}</main>${footer(lang)}<script src="/script.js" defer></script><script src="/catalogue.js" defer></script></body></html>`);
  }
  const pairFor=fn=>({en:fn('en'),tr:fn('tr')});
  for(const lang of ['en','tr']){
    buildSectionPages({lang,page,quote});
    const title=t(lang,'Equipment for every test.','Her test için ekipman.');
    const intro=t(lang,'Explore Labomak testing machines, grips and control systems. Search by product or find the right equipment group for your laboratory.','Labomak test cihazlarını, çenelerini ve kontrol sistemlerini keşfedin. Ürüne göre arayın veya laboratuvarınız için uygun ekipman grubunu bulun.');
    page(lang,pairFor(catalogRoot),title,intro,hero(title,intro,lang,productById.get(5191))+categoryTiles(lang)+listing(products,lang)+quote(lang));
    for(const category of categories.filter(c=>c.id!=='universal')){
      const items=products.filter(p=>p.category===category.id);
      const feature=items[0]||productById.get(5212);
      const categoryIntro=category.id==='fixtures'?t(lang,`${fixtureItems.length} illustrated examples across ${fixtureGroups.length} collections. Find grips, specimen holders and test fixtures for your material and method.`,`${fixtureGroups.length} koleksiyonda ${fixtureItems.length} görselli örnek. Malzemenize ve metodunuza uygun çeneleri, numune tutucuları ve test fikstürlerini bulun.`):category.intro[lang];
      const categoryHero=hero(category[lang],categoryIntro,lang,feature);
      const body=(category.id==='fixtures'?categoryHero.replace('href="#equipment"','href="#fixture-examples"')+fixtureExamples(lang):categoryHero)+(category.id==='accessories'?accessoryOptions(lang):listing(items,lang))+setup(category.id,lang)+quote(lang);
      page(lang,pairFor(l=>categoryUrl(l,category.id)),category[lang],category.intro[lang],body,[{name:category[lang],url:categoryUrl(lang,category.id)}]);
    }
    for(const p of products){
      if(p.existingFamily)continue;
      const c=categoryById.get(p.category);
      const details=facts[p.id];
      const sourceLinks=[p.source.source_url,...(p.id==='4775'?[inventory.products.find(r=>r.id==='wp-post-1276').source_url]:[])];
      const body=`<section class="catalogue-hero section-shell product-detail-hero" id="product-overview"><div><p class="eyebrow">LABOMAK / ${esc(c[lang])}</p><h1>${esc(p.name[lang])}</h1><p>${esc(p.intro[lang])}</p><div class="hero-actions"><a class="button button-filled" href="#enquire">${t(lang,'Discuss this product','Bu ürün için görüşelim')} ↗</a><a class="text-link" href="${categoryUrl(lang,p.category)}">${t(lang,'Explore the range','Ürün grubunu keşfedin')} →</a></div></div><figure class="catalogue-hero-photo">${photo(p,lang,true)}<figcaption>${t(lang,'Example configuration','Örnek konfigürasyon')}</figcaption></figure></section>${technicalNavigation(p,lang)}${details?`<div class="section-shell spec-strip">${details.map(row=>`<div><span>${esc(row[lang==='tr'?1:0])}</span><strong>${esc(row[2])}</strong></div>`).join('')}</div>`:''}${p.category==='software'?software(lang):''}${p.family?`<div class="section-shell family-reference"><a class="text-link" href="${categoryUrl(lang,'universal')+p.family+'/'}">${t(lang,'Compare the family and equipment levels','Ürün ailesini ve donanım seviyelerini karşılaştırın')} →</a></div>`:''}${productHighlights(p,lang)}${technicalContent(p,lang)}${setup(p.category,lang)}<section class="section-shell product-reference" id="product-documents"><div><p class="eyebrow">${t(lang,'TECHNICAL REFERENCE','TEKNİK REFERANS')}</p><h2>${t(lang,'Go into the details.','Ayrıntıları inceleyin.')}</h2><p>${t(lang,'Explore the product information and discuss the final configuration with our engineers.','Ürün bilgilerini inceleyin ve nihai konfigürasyonu mühendislerimizle görüşün.')}</p></div><div>${sourceLinks.map((u,i)=>`<a class="resource-link" href="${esc(u)}">${t(lang,i?'Additional configuration reference (Turkish)':'Technical product information (Turkish)',i?'Ek konfigürasyon bilgileri':'Teknik ürün bilgileri')} ↗</a>`).join('')}${namedProductDocuments(p,lang)}</div></section>${quote(lang,{id:p.id,name:p.name[lang]})}<section class="section-shell related-families"><h2>${t(lang,'Related equipment','İlgili ekipmanlar')}</h2>${cards(products.filter(other=>other.category===p.category&&other.id!==p.id).slice(0,3),lang)}</section>`;
      page(lang,pairFor(l=>productUrl(l,p)),p.name[lang]+(p.family?' — '+t(lang,'Material testing system','Malzeme test sistemi'):''),p.intro[lang],body,[{name:c[lang],url:categoryUrl(lang,p.category)},{name:p.name[lang],url:productUrl(lang,p)}]);
    }
    for(const [kind,items] of Object.entries(groups)){
      const label=t(lang,kind==='applications'?'Applications':'Industries',kind==='applications'?'Uygulamalar':'Sektörler');
      const intro=t(lang,'Find equipment by the test you perform and the materials you work with.','Yaptığınız teste ve çalıştığınız malzemeye göre ekipman bulun.');
      const hub=kind==='applications'?applicationHub(lang)+quote(lang):`<section class="section-shell directory-hero"><p class="eyebrow">LABOMAK / ${esc(label)}</p><h1>${esc(label)}</h1><p>${intro}</p></section><div class="section-shell directory-grid">${items.map(g=>`<a href="${groupUrl(lang,kind,g[0])}"><span>${groupProducts(g).length} ${t(lang,'products','ürün')}</span><h2>${esc(g[lang==='tr'?2:1])}</h2><b>↗</b></a>`).join('')}</div>${quote(lang)}`;
      page(lang,pairFor(l=>groupUrl(l,kind)),label,intro,hub,[{name:label,url:groupUrl(lang,kind)}],kind!=='applications');
      for(const group of items){
        if(kind==='applications'){
          const guide=applicationGuideById.get(group[0]);
          page(lang,pairFor(l=>groupUrl(l,kind,group[0])),guide.name[lang],guide.description[lang],applicationBody(guide,lang,quote),[{name:label,url:groupUrl(lang,kind)},{name:guide.name[lang],url:groupUrl(lang,kind,guide.id)}],false,{image:applicationImage(guide),imageAlt:productById.get(guide.productIds[0]).name[lang]});
          continue;
        }
        const related=groupProducts(group); const name=group[lang==='tr'?2:1];
        const desc=t(lang,`Explore Labomak equipment for ${name.toLowerCase()}. Select a product to discuss the specimen, method and configuration.`,`${name} için Labomak ekipmanlarını keşfedin. Numune, metot ve konfigürasyonu görüşmek için bir ürün seçin.`);
        const body=`<section class="section-shell directory-hero"><p class="eyebrow">LABOMAK / ${esc(label)}</p><h1>${esc(name)}</h1><p>${esc(desc)}</p></section>${listing(related,lang)}${quote(lang)}`;
        page(lang,pairFor(l=>groupUrl(l,kind,group[0])),name+' — '+label,desc,body,[{name:label,url:groupUrl(lang,kind)},{name,url:groupUrl(lang,kind,group[0])}]);
      }
    }
  }
}
