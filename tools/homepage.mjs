import fs from 'node:fs';
import { catalogRoot, categoryUrl, productById, productUrl, groupUrl, tr as t } from '../data/portfolio.mjs';
import { fixtureGroups, fixtureItems, fixtureUrl } from '../data/fixtures.mjs';
import { applicationGuideById } from '../data/application-guides.mjs';
import { tensileRender } from './tensile-render.mjs';

const esc = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const assets = new Map(JSON.parse(fs.readFileSync(new URL('../data/portfolio-assets.json',import.meta.url),'utf8')).map(a=>[a.id,a.local]));
const picture = (p,lang) => `<img src="${assets.get(p.image.id)}" alt="${esc(p.name[lang])}" width="500" height="500" loading="lazy" decoding="async">`;
export const homeStages = lang => lang === 'tr'
  ? ['Numuneyi kavrayın', 'Çekme yükü uygulayın', 'Deformasyonu izleyin', 'Kopmayı inceleyin']
  : ['Grip the specimen', 'Apply tensile load', 'Observe deformation', 'Examine the fracture'];

export function homepage(lang, quote) {
  const stages = homeStages(lang);
  const products = [5191,5212,55,160].map(id=>productById.get(id));
  const featuredFixtures = ['vice','pneumatic'].map(id=>fixtureGroups.find(g=>g.id===id)).filter(Boolean);
  const appRoot = lang === 'tr' ? '/tr/uygulamalar/' : '/en/applications/';
  return `<section id="top" class="lm-hero-track" data-tensile-story>
    <div class="lm-hero-sticky">
      <div class="section-shell lm-hero-layout">
        <div class="lm-hero-copy">
          <p class="eyebrow"><span></span>${t(lang,'MATERIALS TESTING · ENGINEERED IN TÜRKİYE','MALZEME TESTLERİ · TÜRKİYE’DE ÜRETİLDİ')}</p>
          <h1>${t(lang,'Confidence.<br><em>Under load.</em>','Yük altında.<br><em>Güvenle.</em>')}</h1>
          <p class="lm-hero-intro">${t(lang,'Tensile testing machines, precision fixtures and dedicated test systems. Built around the material in your hands.','Çekme test cihazları, hassas fikstürler ve özel test sistemleri. Elinizdeki malzeme için tasarlandı.')}</p>
          <div class="hero-actions"><a class="button lm-button-gold" href="${catalogRoot(lang)}">${t(lang,'Explore the equipment','Cihazları keşfedin')} <span aria-hidden="true">↗</span></a><a class="lm-quiet-link" href="#quote">${t(lang,'Talk to an engineer','Mühendisimizle görüşün')} <span aria-hidden="true">↗</span></a></div>
          <a class="lm-scroll-cue" href="#solutions"><span aria-hidden="true">↓</span>${t(lang,'SCROLL TO PUT IT TO THE TEST','TESTİ GÖRMEK İÇİN KAYDIRIN')}</a>
        </div>
        <figure class="lm-machine-scene">
          <div class="lm-scene-heading"><span>LABOMAK / ${t(lang,'TEST IN MOTION','HAREKET HALİNDE TEST')}</span><span class="lm-scene-dot" aria-hidden="true"></span></div>
          ${tensileRender(lang)}
          <figcaption>${t(lang,'Tensile testing · Illustrative ductile specimen','Çekme testi · Temsili sünek numune')}<span>${t(lang,'Exaggerated motion. Material behaviour varies.','Hareket temsili olarak büyütülmüştür. Malzeme davranışı değişir.')}</span></figcaption>
        </figure>
      </div>
      <div class="section-shell lm-test-console">
        <ol class="lm-test-stages">${stages.map((s,i)=>`<li data-test-stage="${i}"${i===0?' class="is-active"':''}><span>0${i+1}</span>${s}</li>`).join('')}</ol>
        <div class="lm-motion-controls" data-motion-controls hidden>
          <label for="tensile-progress">${t(lang,'Explore the test','Testi inceleyin')}<input id="tensile-progress" type="range" min="0" max="100" step="1" value="0" aria-valuetext="${stages[0]}"></label>
          <button type="button" data-motion-toggle aria-pressed="false" data-pause="${t(lang,'Pause scroll motion','Kaydırma hareketini durdur')}" data-resume="${t(lang,'Enable scroll motion','Kaydırma hareketini aç')}">${t(lang,'Pause scroll motion','Kaydırma hareketini durdur')}</button>
        </div>
      </div>
    </div>
  </section>
  <section class="lm-introduction section-shell" id="solutions">
    <p class="eyebrow">01 / ${t(lang,'THE RIGHT TEST STARTS HERE','DOĞRU TEST BURADA BAŞLAR')}</p>
    <div class="lm-section-heading"><h2>${t(lang,'Every material has a story.<br>Make yours measurable.','Her malzemenin bir hikâyesi var.<br>Sizinkini ölçülebilir kılın.')}</h2><p>${t(lang,'From incoming material to the finished component, connect your question to the right method, machine and fixture.','Giriş malzemesinden bitmiş bileşene, sorunuzun karşılığını doğru metot, cihaz ve fikstürle bulun.')}</p></div>
    <div class="lm-application-links">${['tensile','compression','flexure','impact','adhesion','permeability'].map((id,i)=>{const g=applicationGuideById.get(id); return `<a href="${groupUrl(lang,'applications',id)}"><span class="lm-link-index">0${i+1}</span><h3>${esc(g.name[lang])}</h3><span class="lm-link-arrow" aria-hidden="true">↗</span></a>`;}).join('')}</div>
    <a class="text-link" href="${appRoot}">${t(lang,'Explore all application guides','Tüm uygulama rehberlerini keşfedin')} ↗</a>
  </section>
  <section class="lm-equipment" id="machines"><div class="section-shell">
    <p class="eyebrow">02 / ${t(lang,'MEET YOUR NEXT TEST SYSTEM','YENİ TEST SİSTEMİNİZLE TANIŞIN')}</p>
    <div class="lm-section-heading"><h2>${t(lang,'Purpose in every detail.','Her ayrıntıda bir amaç.')}</h2><a class="text-link" href="${catalogRoot(lang)}">${t(lang,'View the full catalogue','Tüm kataloğu inceleyin')} ↗</a></div>
    <div class="lm-product-grid">${products.map((p,i)=>`<article class="lm-product-card"><a class="lm-product-photo" href="${productUrl(lang,p)}">${picture(p,lang)}<span class="lm-product-index">0${i+1}</span><span class="lm-photo-arrow" aria-hidden="true">↗</span></a><p class="eyebrow">${i<2?'LABOTENS':i===2?'CHARPY / IZOD':'BOXMAX'}</p><h3><a href="${productUrl(lang,p)}">${esc(p.name[lang])}</a></h3><p>${esc(p.intro[lang])}</p></article>`).join('')}</div>
  </div></section>
  <section class="lm-fixtures"><div class="section-shell lm-fixture-layout">
    <div class="lm-fixture-copy"><p class="eyebrow">03 / ${t(lang,'A BETTER CONNECTION','DOĞRU BAĞLANTI')}</p><h2>${t(lang,'Small contact.<br><em>Big difference.</em>','Küçük temas.<br><em>Büyük fark.</em>')}</h2><p>${t(lang,'The grip is where the machine meets the material. Explore vice, pneumatic and wedge grips, bending fixtures, compression platens and application-specific tooling.','Çene, cihazın malzemeyle buluştuğu yerdir. Mengene, pnömatik ve kama çeneleri, eğme fikstürlerini, basma plakalarını ve uygulamanıza özel aparatları keşfedin.')}</p><a class="button lm-button-gold" href="${categoryUrl(lang,'fixtures')}">${t(lang,'Find your grips & fixtures','Çene ve fikstürleri keşfedin')} ↗</a><div class="lm-fixture-numbers"><div><strong>${fixtureGroups.length}</strong><span>${t(lang,'fixture collections','fikstür koleksiyonu')}</span></div><div><strong>${fixtureItems.length}</strong><span>${t(lang,'illustrated examples','görselli örnek')}</span></div></div></div>
    <div class="lm-fixture-photos">${featuredFixtures.map((g,i)=>`<a href="${fixtureUrl(lang,g.id)}" class="lm-fixture-tile"><img src="${assets.get(g.examples[i===0?2:0].image.id)}" alt="${esc(g.name[lang])}" width="300" height="300" loading="lazy" decoding="async"><span>${esc(g.name[lang])}<b aria-hidden="true">↗</b></span></a>`).join('')}</div>
  </div></section>
  <section class="section-shell lm-workflow" id="why-labomak"><p class="eyebrow">04 / ${t(lang,'ENGINEERED AROUND YOUR WORK','İŞİNİZE GÖRE TASARLANDI')}</p><div class="lm-section-heading"><h2>${t(lang,'From specimen.<br>To insight.','Numuneden.<br>Sonuca.')}</h2><p>${t(lang,'Build a complete testing workflow with Labomak: the frame, the specimen connection and the tools to understand the result.','Labomak ile eksiksiz bir test iş akışı oluşturun: cihaz gövdesi, numune bağlantısı ve sonucu anlamlandıran araçlar.')}</p></div><div class="lm-workflow-grid">
    <article><span>01 —</span><h3>${t(lang,'Start with the specimen','Numuneyle başlayın')}</h3><p>${t(lang,'Share your material, dimensions, test method and expected force. These define the equipment you need.','Malzemenizi, ölçülerinizi, test metodunu ve beklenen kuvveti paylaşın. İhtiyacınız olan ekipmanı bunlar belirler.')}</p></article>
    <article><span>02 —</span><h3>${t(lang,'Configure the connection','Bağlantıyı yapılandırın')}</h3><p>${t(lang,'Match the load cell, grips, fixture geometry and strain measurement to the application.','Yük hücresini, çeneleri, fikstür geometrisini ve uzama ölçümünü uygulamanızla eşleştirin.')}</p></article>
    <article id="falcon"><span>03 — FALCON</span><h3>${t(lang,'Turn tests into insight','Testleri bilgiye dönüştürün')}</h3><p>${t(lang,'Explore Falcon Eko and Pro for test control, analysis and reporting, with capabilities matched to your configuration.','Konfigürasyonunuza uygun test kontrolü, analiz ve raporlama özellikleri için Falcon Eko ve Pro’yu keşfedin.')}</p><a class="text-link" href="${productUrl(lang,productById.get(274))}">${t(lang,'Discover Falcon','Falcon’ı keşfedin')} ↗</a></article>
  </div></section>
  <div class="lm-contact-wrap">${quote(lang).replace('id="enquire"','id="quote"')}</div>`;
}

export function homepageSeo(lang) {
  const domain='https://labomak.com.tr';
  const url=domain+(lang==='tr'?'/tr/':'/');
  const title=t(lang,'Tensile & Materials Testing Machines | Labomak','Çekme ve Malzeme Test Cihazları | Labomak');
  const description=t(lang,'Explore Labomak tensile testing machines, Charpy and Izod impact testers, packaging test systems, grips and fixtures. Find equipment by application.','Labomak çekme test cihazlarını, Charpy ve İzod darbe cihazlarını, ambalaj test sistemlerini, çene ve fikstürleri keşfedin. Uygulamanıza uygun ekipmanı bulun.');
  const photo=domain+assets.get(productById.get(5191).image.id);
  const schema={'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':domain+'/#organization',name:'Labomak',url:domain,logo:domain+'/logo.png',email:'info@labomak.com.tr',telephone:'+90 212 438 18 26'},{'@type':'WebSite','@id':domain+'/#website',url:domain,name:'Labomak',inLanguage:['en','tr'],publisher:{'@id':domain+'/#organization'}},{'@type':'WebPage','@id':url+'#webpage',url,name:title,description,inLanguage:lang,isPartOf:{'@id':domain+'/#website'},primaryImageOfPage:{'@type':'ImageObject',url:photo}}]};
  return {title,description,extra:`<meta property="og:url" content="${url}"><meta property="og:image" content="${photo}"><meta property="og:image:alt" content="Labomak DuoCol Kompetan"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${JSON.stringify(schema)}</script><link rel="stylesheet" href="/home.css"><script type="module" src="/home.js"></script>`};
}
