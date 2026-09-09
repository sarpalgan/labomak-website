import json, re, html, hashlib, unicodedata
from collections import Counter
from pathlib import Path
from urllib.parse import urljoin
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parent
def save(name,obj): (ROOT/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def clean(x): return re.sub(r'\s+',' ',html.unescape(x or '')).strip()
def text(x): return clean(BeautifulSoup(x,'html.parser').get_text(' ',strip=True))
def key(x): return ''.join(c for c in unicodedata.normalize('NFKD',x.lower().replace('ı','i')) if not unicodedata.combining(c))
def api(kind):
    url='https://labomak.com.tr/wp-json/wp/v2/'+kind+'?per_page=100'
    path=ROOT/'raw'/(hashlib.sha256(url.encode()).hexdigest()[:20]+'.json')
    return json.loads(json.loads(path.read_text(encoding='utf-8'))['body'])
posts=api('posts'); cats=api('categories'); pages=api('pages')
catmap={c['id']:c for c in cats}
excluded={20:'Contact information',18:'Company information',2640:'Application navigation',2452:'Sector navigation',464:'Delivery/news article',454:'Delivery/news article',905:'Downloads index',40:'Customer references'}
collections={4229,2860,4212,4693,4612,4606,4427,4231,4156,4144,4000,3988,3963,3935,3956,3911,3891,3373,1128,1559,709}
families={2840,318,2609}

def classify(name):
    n=key(name)
    for tokens,label in [(['falcon','yazilim'],'Software'),(['fikstur','cene','aparat'],'Fixtures and grips'),(['ekstansometre'],'Extensometers'),(['dokunmatik','kumanda','aksesuar'],'Controls and accessories'),(['yorulma','omur','guvenilirli'],'Fatigue and durability testing'),(['darbe','charpy','izod','drop','hardy'],'Impact testing'),(['gecirgen','sizdirmaz','vakum'],'Permeability and leak testing'),(['firin','etuv','inkubator','sicaklig','iklimlendirme','sogukta'],'Thermal and environmental testing'),(['labotens','kolon','cekme','malzeme dayanim','coklu gorev'],'Universal and tensile testing'),(['kagit','karton','koli','boxmax','sct','ect','ista'],'Paper and packaging testing'),(['mfi','erime'],'Melt flow testing'),(['yay'],'Spring testing'),(['asindir'],'Abrasion testing'),(['beton','kagir','marshall','duktil','su emme'],'Construction material testing'),(['fren','emniyet','isofix'],'Automotive component testing'),(['seramik','fayans'],'Ceramic flexural testing')]:
        if any(t in n for t in tokens): return label
    return 'Special-purpose testing'

assets={}; gallery={}
def images(s,source_id,source_url):
    result=[]
    for img in s.select('img'):
        src=img.get('src') or img.get('data-src')
        if not src or src.startswith('data:'): continue
        src=urljoin(source_url,src); a=img.find_parent('a')
        candidates=[{'url':src,'descriptor':'displayed'}]
        for v in img.get('srcset','').split(','):
            bits=v.strip().split()
            if bits: candidates.append({'url':urljoin(source_url,bits[0]),'descriptor':bits[1] if len(bits)>1 else ''})
        linked=urljoin(source_url,a.get('href','')) if a else ''
        full=linked if re.search(r'\.(png|jpe?g|gif|webp)(?:\?|$)',linked,re.I) else max(candidates,key=lambda v:int(re.sub(r'\D','',v['descriptor']) or 0))['url']
        caption=clean(a.get('data-rl_caption') or a.get('data-rl_title') or '') if a else ''
        fig=img.find_parent('figure')
        if not caption and fig and fig.select_one('figcaption'): caption=fig.select_one('figcaption').get_text(' ',strip=True)
        alt=clean(img.get('alt','')); aid='img-'+hashlib.sha256(full.encode()).hexdigest()[:12]
        item=dict(id=aid,url=full,display_url=src,alt=alt,caption=caption,variants=candidates)
        if aid not in assets: assets[aid]={**item,'source_ids':[],'source_urls':[],'role':'source-content image; product photo, diagram, screenshot or illustrative image; review before publishing','availability':'URL observed in source; binary not downloaded or checked'}
        for field,value in [('source_ids',source_id),('source_urls',source_url)]:
            if value not in assets[aid][field]: assets[aid][field].append(value)
        if not any(x['id']==aid for x in result): result.append(item)
        if img.find_parent(class_='rl-gallery-item') or source_id=='wp-page-2329':
            name=caption or alt
            if aid not in gallery: gallery[aid]=dict(id='gallery-'+aid[4:],name_tr=name or None,product_type=classify(name),image_id=aid,image_url=full,source_ids=[],source_urls=[],record_kind='gallery_item',review_status='Candidate offering or example; caption retained verbatim. Not a confirmed unique SKU.')
            for field,value in [('source_ids',source_id),('source_urls',source_url)]:
                if value not in gallery[aid][field]: gallery[aid][field].append(value)
    return result

def content_fields(content,sid,url):
    s=BeautifulSoup(content,'html.parser')
    ims=images(s,sid,url)
    links=[]
    for a in s.select('a[href]'):
        u=urljoin(url,a['href'])
        if not any(x['url']==u for x in links): links.append(dict(label=clean(a.get_text(' ',strip=True)),url=u))
    return dict(images=ims,primary_image_url=ims[0]['url'] if ims else None,primary_image_status='First content image; editorial selection required' if ims else 'No content image found',headings=[clean(h.get_text(' ',strip=True)) for h in s.select('h1,h2,h3,h4,h5,h6') if clean(h.get_text())],tables=[[[clean(c.get_text(' ',strip=True)) for c in row.select('th,td')] for row in t.select('tr')] for t in s.select('table')],documents=[x for x in links if re.search(r'\.(pdf|docx?|xlsx?|zip)(?:\?|$)',x['url'],re.I)],content_links=links,source_text=s.get_text('\n',strip=True))

records=[]; excluded_records=[]
for o in posts:
    if o['id'] in excluded:
        excluded_records.append(dict(source_wordpress_id=o['id'],title_tr=text(o['title']['rendered']),source_url=o['link'],reason=excluded[o['id']]))
        continue
    sid='wp-post-'+str(o['id']); name=text(o['title']['rendered'])
    kind='collection' if o['id'] in collections else 'product_family' if o['id'] in families else 'software' if o['id']==274 else 'product'
    notes=[]
    if o['id'] in [1276,4775]: notes.append('Same product name appears on two pages with different descriptions/configurations. Retained separately pending model review.')
    if o['id']==5159: notes.append('URL slug says ceko-monocol, but page title says Kobi Duocol. Title retained; do not infer identity from URL.')
    if o['id']==318: notes.append('Source Tetra Col heading says Max 1 Ton | 1.000 kN: inconsistent units. Preserve evidence; verify capacity before publication.')
    if o['id']==552: notes.append('Source title repeats ECT. Do not silently treat the repeated title as an additional product; full content retained.')
    if o['id'] in families: notes.append('Family/overview page overlaps individual model records; not an additional SKU.')
    records.append(dict(id=sid,source_wordpress_id=o['id'],slug=o['slug'],name_tr=name,record_kind=kind,product_type=classify(name),source_url=o['link'],source_modified=o['modified'],source_categories=[dict(id=i,name_tr=catmap[i]['name'],url=catmap[i]['link']) for i in o['categories'] if i in catmap],featured_media_id=o['featured_media'],review_notes=notes,**content_fields(o['content']['rendered'],sid,o['link'])))

# These offerings exist as category descriptions/menu entries without dedicated model pages.
for cid in [227,228,229,230,220,223,225,278]:
    o=catmap[cid]; sid='wp-category-'+str(cid)
    records.append(dict(id=sid,source_wordpress_id=cid,slug=o['slug'],name_tr=clean(o['name']),record_kind='accessory_category',product_type=classify(o['name']),source_url=o['link'],source_modified=None,source_categories=[],review_notes=['Category-level offering, not a confirmed individual model. Description can be sparse or empty.'],**content_fields(o['description'],sid,o['link'])))

# Preserve the FAQ fixture examples and service page separately from saleable offerings.
supporting=[]
for o in pages:
    sid='wp-page-'+str(o['id'])
    supporting.append(dict(id=sid,name_tr=text(o['title']['rendered']),record_kind='supporting_page',source_url=o['link'],**content_fields(o['content']['rendered'],sid,o['link'])))

# Dedicated gallery pages can contain images absent from the regular post feed.
sitemap_url='https://labomak.com.tr/index.php/rl_gallery-sitemap.xml'
sitemap_path=ROOT/'raw'/(hashlib.sha256(sitemap_url.encode()).hexdigest()[:20]+'.json')
if sitemap_path.exists():
    sitemap=BeautifulSoup(json.loads(sitemap_path.read_text(encoding='utf-8'))['body'],'xml')
    for loc in sitemap.find_all('loc'):
        if loc.parent.name!='url': continue
        url=loc.text
        if url.endswith('/rl_gallery/') or 'kalite-belgeleri' in url: continue
        path=ROOT/'raw'/(hashlib.sha256(url.encode()).hexdigest()[:20]+'.json')
        if not path.exists(): continue
        response=json.loads(path.read_text(encoding='utf-8'))
        if response['status']!=200: continue
        soup=BeautifulSoup(response['body'],'html.parser')
        content=''.join(str(g) for g in soup.select('.rl-gallery'))
        sid='source-gallery-'+url.rstrip('/').split('/')[-1]
        supporting.append(dict(id=sid,name_tr=clean(soup.title.get_text()).strip(' |'),record_kind='gallery_source',source_url=url,**content_fields(content,sid,url)))

# Explicit named offerings embedded in overview pages; no invented model numbers.
embedded_specs=[(274,'FALCON EKO','Software'),(274,'FALCON PRO','Software'),(318,'Duo Col Serisi','Universal and tensile testing'),(318,'Custom Made Özel İmalat Cihazlar','Special-purpose testing'),(1559,'Drop Test Cihazları — Serbest düşürme test cihazları','Impact testing'),(1559,'Eğik düzlem sürtünme test cihazları','Paper and packaging testing'),(1559,'Elektronik nakliye titreşimi test cihazı','Paper and packaging testing'),(1559,'Karton levha 4 nokta eğme dayanımı','Paper and packaging testing'),(1559,'Oluk hazırlama, Dairesel ve düzlemsel numune hazırlama ve kesme makineleri','Sample preparation'),(1559,'Kağıt yırtılma dayanımı','Paper and packaging testing'),(1559,'Kağıt karton kalınlık ölçüm cihazları','Measurement accessories'),(1559,'Kağıt karton nemi ölçüm cihazları','Measurement accessories')]
embedded=[]
for pid,name,typ in embedded_specs:
    parent=next(r for r in records if r['id']=='wp-post-'+str(pid))
    embedded.append(dict(id='embedded-'+hashlib.sha256((str(pid)+name).encode()).hexdigest()[:12],name_tr=name,record_kind='embedded_offering',product_type=typ,parent_id=parent['id'],source_url=parent['source_url'],image_url=None,review_status='Named within parent page; exact model/variant and image assignment require review. Consult parent images and source text.'))

counts=Counter(r['record_kind'] for r in records)
meta=dict(schema_version='1.0',scraped_on='2026-09-08',source_website='https://labomak.com.tr/',language='tr',purpose='Research inventory for a future website rebuild. Not wired into the website.',counts=dict(published_posts=len(posts),published_pages=len(pages),source_categories=len(cats),catalog_records=len(records),record_kinds=dict(counts),excluded_posts=len(excluded_records),embedded_offerings=len(embedded),gallery_candidates=len(gallery),unique_content_images=len(assets)),rules=['Source titles/captions preserved; English product_type is an editorial classification.','Counts are source records and candidates, not a count of unique saleable SKUs.','Image URLs are explicitly present in href/src/srcset; no guessed original URLs.','Gallery images deduplicated by selected source URL, not visual similarity. Different photographs may represent the same product.','Source prose, tables, headings and document URLs retained for later content migration.','Raw HTML is archival evidence, not safe-to-render application content. Sanitize before importing.'])
save('catalog.json',dict(metadata=meta,products=records,embedded_offerings=embedded,gallery_items=list(gallery.values()),supporting_pages=supporting,excluded_pages=excluded_records))
save('images.json',list(assets.values()))
save('taxonomy.json',[dict(id=c['id'],name_tr=clean(c['name']),slug=c['slug'],parent_id=c['parent'],source_url=c['link'],published_post_count=c['count'],description_html=c['description']) for c in cats])

def md(x): return clean(x).replace('|','\\|')
lines=['# Labomak source product inventory','', 'Scraped: 8 September 2026 · Source: https://labomak.com.tr/','',f"{len(records)} catalog records: "+', '.join(f'{v} {k}' for k,v in counts.items())+'.', '',f'Also captured: {len(embedded)} embedded offerings, {len(gallery)} gallery candidates, and {len(assets)} unique content-image URLs. These counts are not unique SKU counts.','', 'Turkish source names are retained. Product types are editorial labels. Full descriptions, tables, all images, documents and categories are in `catalog.json`.','']
for typ in sorted(set(r['product_type'] for r in records)):
    lines+=['## '+typ,'','| ID | Product / source title | Record kind | Source | Image |','|---|---|---|---|---|']
    for r in records:
        if r['product_type']==typ: lines.append(f"| {r['id']} | {md(r['name_tr'])} | {r['record_kind']} | [Page]({r['source_url']}) | "+(f"[Image]({r['primary_image_url']})" if r['primary_image_url'] else 'Not found')+' |')
    lines.append('')
lines+=['## Named offerings within overview pages','','| Offering | Type | Source |','|---|---|---|']
for r in embedded: lines.append(f"| {md(r['name_tr'])} | {r['product_type']} | [Page]({r['source_url']}) |")
lines+=['','## Source issues to review','']
for r in records:
    for note in r['review_notes']:
        if r['record_kind']!='accessory_category': lines.append(f"- **{r['name_tr']}** ({r['id']}): {note}")
lines+=['','## Excluded non-product entries','','| Title | Reason | Source |','|---|---|---|']
for r in excluded_records: lines.append(f"| {md(r['title_tr'])} | {r['reason']} | [Page]({r['source_url']}) |")
(ROOT/'PRODUCTS.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
lines=['# Gallery fixture and product candidates','','Names are source captions, not normalized model names. One row per unique selected image URL. Multiple rows may show the same product; review before turning these into product pages.','','| ID | Source caption | Type | Image | References |','|---|---|---|---|---|']
for g in gallery.values(): lines.append(f"| {g['id']} | {md(g['name_tr'] or 'Uncaptioned image')} | {g['product_type']} | [Image]({g['image_url']}) | "+' · '.join(f"[Page {i+1}]({u})" for i,u in enumerate(g['source_urls']))+' |')
(ROOT/'GALLERY-ITEMS.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print(json.dumps(meta['counts'],ensure_ascii=False,indent=2))
