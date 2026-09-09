import json, time, re, hashlib, concurrent.futures
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit
import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
RAW = ROOT / 'raw'
RAW.mkdir(exist_ok=True)
BASE = 'https://labomak.com.tr/'

def fetch(url):
    key = hashlib.sha256(url.encode()).hexdigest()[:20]
    dest = RAW / (key + '.json')
    if dest.exists(): return json.loads(dest.read_text(encoding='utf-8'))
    for attempt in range(3):
        try:
            r = requests.get(url, timeout=50, headers={'User-Agent':'Labomak-Catalog-Inventory/1.0'}, verify=True)
            r.encoding = 'utf-8'
            result = dict(url=url, final_url=r.url, status=r.status_code, body=r.text)
            if r.status_code < 500: break
        except Exception as e:
            result = dict(url=url, status=0, error=str(e), body='')
        time.sleep(1 + attempt)
    dest.write_text(json.dumps(result, ensure_ascii=False), encoding='utf-8')
    return result

def normalized(href, base=BASE):
    u=urlsplit(urljoin(base, href))
    if u.hostname not in ['labomak.com.tr','www.labomak.com.tr']: return None
    if u.query or re.search(r'\.(jpg|jpeg|png|gif|pdf|zip|webp|mp4|docx?)$',u.path,re.I): return None
    if any(x in u.path for x in ['/feed','/wp-content','/wp-admin','/wp-json','/tag/','/author/','/comment']): return None
    return urlunsplit(('https','labomak.com.tr',u.path or '/','',''))

if __name__ == '__main__':
    probes=[BASE, BASE+'wp-sitemap.xml',BASE+'sitemap_index.xml',BASE+'wp-json/wp/v2/posts?per_page=100',BASE+'wp-json/wp/v2/pages?per_page=100',BASE+'wp-json/wp/v2/categories?per_page=100']
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        results=list(pool.map(fetch, probes))
    for r in results: print(r['url'],r['status'],len(r['body']),flush=True)
    pending={BASE}; seen=set(); records=[]
    for r in results:
        if 'sitemap' in r['url'] and r['status']==200:
            s=BeautifulSoup(r['body'],'xml')
            for loc in s.select('loc'):
                u=normalized(loc.text)
                if u: pending.add(u)
        if '/wp/v2/' in r['url'] and r['status']==200:
            try:
                for obj in json.loads(r['body']):
                    u=normalized(obj.get('link',''))
                    if u: pending.add(u)
            except Exception: pass
    while pending:
        batch=sorted(pending-seen)[:12]
        if not batch: break
        seen.update(batch); pending.difference_update(batch)
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
            rows=list(pool.map(fetch,batch))
        for r in rows:
            s=BeautifulSoup(r['body'],'html.parser')
            for a in s.select('a[href]'):
                u=normalized(a['href'],r['url'])
                if u and u not in seen: pending.add(u)
            if 'sitemap' in r['url']:
                for loc in BeautifulSoup(r['body'],'xml').select('loc'):
                    u=normalized(loc.text)
                    if u and u not in seen: pending.add(u)
            records.append({k:v for k,v in r.items() if k!='body'})
        print('Crawled',len(seen),'remaining',len(pending),flush=True)
    (ROOT/'crawl-log.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
