import json, hashlib
from pathlib import Path
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parent
def read(name): return json.loads((ROOT/name).read_text(encoding='utf-8'))
def response(url):
    p=ROOT/'raw'/(hashlib.sha256(url.encode()).hexdigest()[:20]+'.json')
    return json.loads(p.read_text(encoding='utf-8')) if p.exists() else None
catalog=read('catalog.json'); assets=read('images.json')
records=catalog['products']+catalog['supporting_pages']
ids=[r['id'] for r in records]+[r['id'] for r in catalog['embedded_offerings']]+[r['id'] for r in catalog['gallery_items']]
assert len(ids)==len(set(ids)), 'Duplicate record IDs'
asset_ids={a['id'] for a in assets}
assert len(asset_ids)==len(assets), 'Duplicate asset IDs'
for r in records:
    assert r['source_url'].startswith('https://labomak.com.tr/')
    assert all(i['id'] in asset_ids for i in r['images'])
for r in catalog['gallery_items']: assert r['image_id'] in asset_ids
known={r['source_url'] for r in records+catalog['excluded_pages']}
coverage={}
for kind in ['post','page','rl_gallery','helpie_faq']:
    url='https://labomak.com.tr/index.php/'+kind+'-sitemap.xml'
    r=response(url)
    assert r and r['status']==200, 'Missing sitemap '+url
    s=BeautifulSoup(r['body'],'xml')
    urls=[loc.text for loc in s.find_all('loc') if loc.parent.name=='url']
    missing=[]; errors=[]; unclassified=[]
    for u in urls:
        r=response(u)
        if not r: missing.append(u)
        elif r['status']!=200: errors.append(dict(url=u,status=r['status']))
        if kind in ['post','page'] and u not in known: unclassified.append(u)
    coverage[kind]=dict(sitemap_url=url,listed_urls=len(urls),not_fetched=missing,fetch_errors=errors,unclassified_regular_content=unclassified)
sources=[]
for p in catalog['products']:
    r=response(p['source_url'])
    if not r or r['status']!=200: sources.append(dict(id=p['id'],url=p['source_url'],status=r['status'] if r else None))
report=dict(checked_on='2026-09-08',sitemaps=coverage,catalog_source_fetch_issues=sources,validation=dict(unique_record_ids=True,unique_asset_ids=True,image_references_resolve=True,main_catalog_records=len(catalog['products']),gallery_candidates=len(catalog['gallery_items']),image_urls=len(assets)),limitations=['Image binaries and linked PDFs were not downloaded or individually validated.','Gallery entries are image/caption candidates, not deduplicated model records.','FAQ and gallery archive pages are crawl evidence; original regular content is reconciled separately.'])
(ROOT/'coverage.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
