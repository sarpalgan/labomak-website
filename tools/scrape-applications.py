"""Refresh the eleven application sources supplied by the site owner."""
import concurrent.futures, hashlib, json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parent.parent/'product-inventory/application-review'
ROOT.mkdir(exist_ok=True)
PATHS={
 'tensile':'uygulamalara-gore-test-cihazlari/cekme-kopma-testi-test-aparatlari/',
 'impact':'category/uygulamalara-gore-test-cihazlari/darbe-uygulamalara-gore-test-cihazlari/',
 'flexure':'uygulamalara-gore-test-cihazlari/egilme-bukulme-sehim-testi-ve-test-aparatlari/',
 'crush':'uygulamalara-gore-test-cihazlari/sikistirma/ezilme-testi-ve-test-aparatlari/',
 'compression':'uygulamalara-gore-test-cihazlari/sikistirma/sikistirma-plakalari/',
 'shear':'mukavemet-test-cihazlari/kesme-kayma-shear-testi-ve-test-aparatlari/',
 'adhesion':'mukavemet-test-cihazlari/soyulma-yapisma-testi-ve-test-aparatlari/',
 'abrasion':'category/uygulamalara-gore-test-cihazlari/asindirma/',
 'puncture':'mukavemet-test-cihazlari/cekme-ceneleri-ve-fiksturler/delinme-penetrasyon-testi-ve-test-aparatlari/',
 'permeability':'category/uygulamalara-gore-test-cihazlari/gecirgenlik/',
 'temperature':'category/uygulamalara-gore-test-cihazlari/isitma/'
}
def fetch(entry):
 key,path=entry; url='https://labomak.com.tr/index.php/'+path
 r=requests.get(url,timeout=60);r.raise_for_status();r.encoding='utf-8'
 raw={'url':url,'final_url':r.url,'status':r.status_code,'retrieved_at':datetime.now(timezone.utc).isoformat(),'body':r.text}
 (ROOT/(hashlib.sha256(url.encode()).hexdigest()[:20]+'.json')).write_text(json.dumps(raw,ensure_ascii=False),encoding='utf8')
 soup=BeautifulSoup(r.text,'html.parser')
 content=soup.select_one('.content') or soup
 for el in content.select('script,style,nav,.post-nav,.share,.related-posts'): el.decompose()
 item={k:v for k,v in raw.items() if k!='body'}
 item.update(id=key,title=soup.title.get_text(' ',strip=True),text=content.get_text('\n',strip=True),
             links=[{'text':a.get_text(' ',strip=True),'url':urljoin(url,a['href'])} for a in content.select('a[href]')],
             images=[{'url':urljoin(url,i['src']),'alt':i.get('alt','')} for i in content.select('img[src]')])
 print(key,r.status_code,len(item['text']),flush=True)
 return item
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: items=list(pool.map(fetch,PATHS.items()))
 (ROOT/'sources.json').write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding='utf8')
