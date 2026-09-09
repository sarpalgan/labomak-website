"""Capture both legacy gallery archives and every gallery they link to."""
import json, hashlib, concurrent.futures, re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlsplit
import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'product-inventory/fixture-expansion'
OUT.mkdir(exist_ok=True)
BASE = 'https://labomak.com.tr/index.php/rl_gallery/'

def fetch(url):
    response = requests.get(url, timeout=60)
    response.raise_for_status()
    response.encoding = 'utf-8'
    record = dict(url=url, final_url=response.url, status=response.status_code,
                  retrieved_at=datetime.now(timezone.utc).isoformat(), body=response.text)
    (OUT / (hashlib.sha256(url.encode()).hexdigest()[:20]+'.json')).write_text(json.dumps(record, ensure_ascii=False), encoding='utf-8')
    return record

def text(value):
    return ' '.join(BeautifulSoup(value or '', 'html.parser').stripped_strings)

if __name__ == '__main__':
    archives = [fetch(BASE), fetch(BASE+'page/2/')]
    links = {}
    for archive in archives:
        soup = BeautifulSoup(archive['body'], 'html.parser')
        for a in soup.select('h2 a[href], h1 a[href], .entry-title a[href]'):
            url = urljoin(BASE, a['href'])
            if url.startswith(BASE) and url != BASE and '/page/' not in url:
                links[url] = text(a.get_text())
    galleries = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        records = list(pool.map(fetch, links))
    for record in records:
        soup = BeautifulSoup(record['body'], 'html.parser')
        images = {}
        for a in soup.select('.rl-gallery a[href]'):
            img = a.find('img')
            if not img: continue
            url = urljoin(record['url'], a['href'])
            if not re.search(r'\.(jpe?g|png|gif|webp)$', urlsplit(url).path, re.I): continue
            caption = text(a.get('data-rl_caption') or a.get('data-rl_title') or a.get('title') or img.get('alt'))
            images[url] = dict(id='img-'+hashlib.sha256(url.encode()).hexdigest()[:12], url=url,
                               display_url=urljoin(record['url'], img.get('src', url)), caption=caption,
                               alt=text(img.get('alt')), variants=img.get('srcset', ''))
        slug = record['url'].rstrip('/').split('/')[-1]
        content = soup.select_one('.entry-content')
        galleries.append(dict(id='source-gallery-'+slug, slug=slug, name_tr=links[record['url']],
                              source_url=record['url'], status=record['status'], retrieved_at=record['retrieved_at'],
                              images=list(images.values()), source_text=text(str(content or ''))))
        print(slug, len(images), flush=True)
    result = dict(archives=[{k:v for k,v in r.items() if k!='body'} for r in archives], galleries=galleries)
    (OUT/'galleries.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print('Galleries:',len(galleries),'Unique images:',len({i['url'] for g in galleries for i in g['images']}))
