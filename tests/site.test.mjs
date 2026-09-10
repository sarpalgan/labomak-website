import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { build, root } from '../tools/build.mjs';
import { createServer } from '../tools/serve.mjs';
import { families, base } from '../data/catalogue.mjs';
import { portfolioPairs } from '../tools/portfolio.mjs';
import { products, productUrl, categoryUrl, categories, groupProducts, groups } from '../data/portfolio.mjs';
import { specifications, variantComparisons } from '../data/technical-content.mjs';
import { documents, resourceUrl } from '../data/resources.mjs';
import { fixtureGroups, fixtureItems, fixtureSnapshot, fixtureUrl } from '../data/fixtures.mjs';
import { applicationGuides, applicationGuideById } from '../data/application-guides.mjs';
import { groupUrl, productById } from '../data/portfolio.mjs';

build();
const routes = ['/', '/tr/', ...['en', 'tr'].flatMap(lang => [base[lang], ...families.map(f => base[lang] + f.id + '/')]), ...portfolioPairs.flatMap(p=>[p.en,p.tr])];
const pages = new Map(routes.map(route => [route, fs.readFileSync(path.join(root, 'dist', route, 'index.html'), 'utf8')]));

test('all catalogue pages have unique titles, one main and h1, no duplicate IDs', () => {
  assert.equal(pages.size, routes.length);
  const titles = new Set();
  for (const [route, html] of pages) {
    assert.equal((html.match(/<main\b/g) || []).length, 1, route);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, route);
    titles.add(html.match(/<title>(.*?)<\/title>/s)[1]);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(ids.length, new Set(ids).size, `Duplicate IDs: ${route}`);
    assert.ok(!html.includes('data-demo-form'), route);
    assert.ok(html.includes('data-enquiry'), route);
    assert.ok(!/Vestel|KALİTEST/.test(html), route);
  }
  assert.equal(titles.size, pages.size);
});

test('all local assets, links and fragments resolve in generated output', () => {
  for (const [route, html] of pages) {
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:)/.test(match[1])) continue;
      const target = new URL(match[1], 'http://local.test' + route);
      const pathname = target.pathname.replace(/index\.html$/, '');
      const file = path.join(root, 'dist', pathname, pathname.endsWith('/') ? 'index.html' : '');
      assert.ok(fs.existsSync(file), `${route} -> ${match[1]}`);
      if (target.hash) {
        const targetHtml = pages.get(pathname);
        assert.ok(targetHtml?.includes(`id="${target.hash.slice(1)}"`), `Missing fragment: ${route} -> ${match[1]}`);
      }
    }
  }
});

test('canonical and reciprocal hreflang resolve across the full catalogue', () => {
  for (const [route, html] of pages) {
    assert.ok(html.includes(`rel="canonical" href="https://labomak.com.tr${route}"`), route);
    for (const lang of ['en', 'tr', 'x-default']) {
      const alternate = html.match(new RegExp(`hreflang="${lang}" href="https://labomak.com.tr([^\"]+)"`));
      assert.ok(alternate && pages.has(alternate[1]), `${route} ${lang}`);
      assert.ok(pages.get(alternate[1]).includes(`href="https://labomak.com.tr${route}"`), `Reciprocal: ${route}`);
    }
    for (const json of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) assert.doesNotThrow(() => JSON.parse(json[1]));
  }
  const sitemap = fs.readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8');
  assert.equal((sitemap.match(/<loc>/g) || []).length, pages.size);
});

test('every route uses the supplied wordmark and the shared six-item navigation', () => {
  for (const [route,html] of pages) {
    const header=html.match(/<header[\s\S]*?<\/header>/)[0];
    assert.ok(header.includes('src="/assets/labomak-wordmark.png"'),route);
    assert.ok(header.includes('width="986" height="108"'),route);
    assert.ok(!header.includes('brand-wordmark">LABOMAK'),route);
    assert.equal((header.match(/class="nav-mega"/g)||[]).length,6,route);
    assert.ok(html.includes('src="/script.js"'),route);
    assert.ok(html.includes('href="/catalogue.css"'),route);
  }
});

test('product pages retain provenance, select the right enquiry and switch to the same product', () => {
  for (const p of products.filter(p=>!p.existingFamily)) for(const lang of ['en','tr']) {
    assert.equal(p.source.id, `wp-post-${p.id}`, 'Never confuse a WordPress category ID with a product post ID');
    const html=pages.get(productUrl(lang,p));
    assert.ok(html.includes(`href="${p.source.source_url.replace(/&/g,'&amp;')}"`),p.slug);
    assert.ok(html.includes(`<option selected>${p.name[lang].replace(/&/g,'&amp;')}</option>`),p.slug);
    const other=lang==='en'?'tr':'en';
    assert.ok(html.includes(`href="${productUrl(other,p)}" lang="${other}"`),p.slug);
    assert.ok(!/\[caption|\[rl_gallery|as nwdkj|Metakl/.test(html),p.slug);
  }
});

test('product navigation links to real equipment groups, and discovery groups contain products', () => {
  for(const lang of ['en','tr']) {
    const html=pages.get(lang==='en'?'/':'/tr/');
    const nav=html.match(/<nav class="desktop-nav"[\s\S]*?<\/nav>/)[0];
    for(const c of categories.filter(c=>c.id!=='software')) assert.ok(nav.includes(`href="${categoryUrl(lang,c.id)}"`),c.id);
  }
  for(const group of Object.values(groups).flat()) assert.ok(groupProducts(group).length>0,group[0]);
});

test('technical tables retain traceable source facts and valid product anchors', () => {
  const fold=value=>value.replace(/\s+/g,' ').trim();
  for(const [id,rows] of Object.entries(specifications)) {
    const p=products.find(p=>p.id===id);
    assert.ok(p,id);
    for(const row of rows) assert.ok(fold(p.source.source_text).includes(fold(row.evidence)),`${id}: ${row.evidence}`);
    for(const lang of ['en','tr']) assert.ok(pages.get(productUrl(lang,p)).includes('id="specifications"'),id);
  }
  for(const id of Object.keys(variantComparisons)) for(const lang of ['en','tr']) {
    const p=products.find(p=>p.id===id);
    assert.ok(pages.get(productUrl(lang,p)).includes('id="product-variants"'),id);
  }
  const impact=products.find(p=>p.id==='55');
  assert.ok(pages.get(productUrl('en',impact)).includes('id="hammer-options"'));
});

test('document library deduplicates URLs and exposes checked documents with meaningful labels', () => {
  assert.equal(documents.length,new Set(documents.map(d=>decodeURI(d.url))).size);
  const status=JSON.parse(fs.readFileSync(path.join(root,'data/document-status.json'),'utf8'));
  for(const d of documents){
    const verified=status.find(s=>s.id===d.id);
    assert.equal(verified?.status,200,d.url);
    assert.equal(verified.pdf_signature,true,d.url);
    for(const lang of ['en','tr']){
      const html=pages.get(resourceUrl(lang));
      assert.ok(html.includes(`href="${d.url}"`),d.id);
      assert.ok(html.includes(d.name[lang].replace(/&/g,'&amp;')),d.id);
    }
  }
});

test('fixture groups are linked to source galleries and preselect their own enquiry', () => {
  for(const g of fixtureGroups)for(const lang of ['en','tr']){
    const html=pages.get(fixtureUrl(lang,g.id));
    assert.ok(html.includes(`href="${g.source.source_url}"`),g.id);
    assert.ok(html.includes(`<option selected>${g.name[lang].replace(/&/g,'&amp;')}</option>`),g.id);
    assert.ok(pages.get(categoryUrl(lang,'fixtures')).includes(`href="${fixtureUrl(lang,g.id)}"`),g.id);
    for(const example of g.examples)assert.ok(g.source.images.some(i=>i.id===example.image.id),g.id);
  }
});

test('complete fixture migration covers both archives and every populated equipment gallery', () => {
  assert.equal(fixtureSnapshot.archives.length,2);
  assert.equal(fixtureSnapshot.galleries.length,21);
  const included=fixtureSnapshot.galleries.filter(g=>g.images.length && g.slug!=='labomak-kalite-belgeleri');
  assert.equal(included.length,18);
  assert.equal(fixtureItems.length,332);
  assert.equal(new Set(fixtureItems.map(e=>e.image.url)).size,fixtureItems.length);
  const assets=JSON.parse(fs.readFileSync(path.join(root,'data/portfolio-assets.json'),'utf8'));
  const status=JSON.parse(fs.readFileSync(path.join(root,'data/portfolio-assets-status.json'),'utf8'));
  for(const source of included){
    const group=fixtureGroups.find(g=>g.source.slug===source.slug);
    assert.ok(group,source.slug);
    assert.deepEqual(group.examples.map(e=>e.image.id),source.images.map(i=>i.id));
    for(const image of source.images){
      const item=fixtureItems.find(e=>e.image.id===image.id);
      assert.ok(item.groups.some(g=>g.id===group.id));
      assert.ok(item.captions.includes(image.caption));
      const asset=assets.find(a=>a.id===image.id);
      assert.ok(status.some(s=>s.local===asset.local && s.status!=='error'));
      for(const lang of ['en','tr'])for(const route of [categoryUrl(lang,'fixtures'),fixtureUrl(lang,group.id)]){
        const html=pages.get(route);
        assert.ok(html.includes(`id="${image.id}"`),`${route}: ${image.id}`);
        assert.ok(html.includes(`src="${asset.local}"`),`${route}: ${image.id}`);
        assert.ok(html.includes('data-fixture-filter'),route);
      }
    }
  }
});

test('application guides cover all requested sources with crawlable bilingual answers and curated equipment', () => {
  const sources=JSON.parse(fs.readFileSync(path.join(root,'product-inventory/application-review/sources.json'),'utf8'));
  assert.equal(sources.length,11);
  assert.equal(applicationGuides.length,12);
  const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  for(const source of sources){
    assert.equal(source.status,200,source.id);
    assert.ok(applicationGuideById.has(source.id),source.id);
    for(const lang of ['en','tr'])assert.ok(pages.get(groupUrl(lang,'applications',source.id)).includes(`href="${source.url}"`));
  }
  for(const guide of applicationGuides)for(const lang of ['en','tr']){
    const route=groupUrl(lang,'applications',guide.id), html=pages.get(route);
    assert.ok(html.includes(`<h1>${escape(guide.name[lang])}</h1>`),route);
    assert.ok(html.includes(escape(guide.overview[lang])),route);
    assert.ok(html.includes(escape(guide.distinction[lang])),route);
    for(const f of guide.faq){
      assert.ok(html.includes(`<summary>${escape(f.question[lang])}</summary>`),route);
      assert.ok(html.includes(`<p>${escape(f.answer[lang])}</p>`),route);
    }
    for(const id of ['overview','results','preparation','faq','equipment','references'])assert.ok(html.includes(`id="${id}"`),route);
    assert.ok(html.includes('aria-labelledby="test-diagram-title test-diagram-desc"'),route);
    const listed=[...html.matchAll(/data-application-product="(\d+)"/g)].map(m=>Number(m[1]));
    assert.deepEqual(listed,guide.productIds,route);
    for(const id of guide.fixtureIds)assert.ok(html.includes(`href="${fixtureUrl(lang,id)}"`),route);
    const structured=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
    const webpage=structured.find(s=>s['@type']==='WebPage');
    assert.equal(webpage.inLanguage,lang);
    assert.deepEqual(webpage.mainEntity.itemListElement.map(i=>i.url),guide.productIds.map(id=>'https://labomak.com.tr'+productUrl(lang,productById.get(id))));
    const breadcrumb=structured.find(s=>s['@type']==='BreadcrumbList');
    assert.equal(breadcrumb.itemListElement[1].item,'https://labomak.com.tr'+groupUrl(lang,'applications'));
    assert.ok(html.includes('property="og:image"'),route);
    assert.ok(!html.includes('"@type":"FAQPage"'), 'FAQ rich-result feature is retired; no misleading SEO claims');
    const nav=pages.get(lang==='en'?'/':'/tr/').match(/<nav class="desktop-nav"[\s\S]*?<\/nav>/)[0];
    assert.ok(nav.includes(`href="${route}"`),route);
  }
  assert.ok(!applicationGuideById.get('abrasion').productIds.includes(4728),'Specimen grinder is not an abrasion measurement instrument');
  assert.equal(productById.get(4728).name.en,'Specimen surface grinder');
  assert.ok(!applicationGuideById.get('permeability').productIds.includes(5159),'Legacy taxonomy wrongly included a general tensile machine');
  assert.ok(!applicationGuideById.get('permeability').productIds.includes(228),'MFI is not permeability');
});

test('preview server serves pages and blocks source access and POST', async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const route of routes) {
      const response = await fetch(origin + route);
      assert.equal(response.status, 200, route);
      assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
    }
    assert.equal((await fetch(origin + '/data/catalogue.mjs')).status, 404);
    assert.equal((await fetch(origin + '/missing')).status, 404);
    assert.equal((await fetch(origin + '/%2e%2e%5cpackage.json')).status, 403);
    assert.equal((await fetch(origin + '/', { method: 'POST' })).status, 405);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
