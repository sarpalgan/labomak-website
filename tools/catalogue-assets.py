"""Cache the selected source photos locally; never invent an original image URL."""
import json, concurrent.futures, time
from pathlib import Path
import requests
from PIL import Image

root=Path(__file__).resolve().parent.parent
manifest=json.loads((root/'data/portfolio-assets.json').read_text(encoding='utf-8'))
def download(item):
    destination=root/item['local'].lstrip('/')
    if destination.exists():
        with Image.open(destination) as image: image.verify()
        return {'url':item['url'],'local':item['local'],'status':'cached'}
    destination.parent.mkdir(parents=True,exist_ok=True)
    for attempt in range(3):
        try:
            r=requests.get(item['url'],timeout=45)
            r.raise_for_status()
            if not r.headers.get('content-type','').startswith('image/'): raise ValueError('Non-image response')
            destination.write_bytes(r.content)
            with Image.open(destination) as image: image.verify()
            return {'url':item['url'],'local':item['local'],'status':'downloaded'}
        except Exception as error:
            if attempt==2: return {'url':item['url'],'local':item['local'],'status':'error','error':str(error)}
            time.sleep(1)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results=list(pool.map(download,manifest))
(root/'data/portfolio-assets-status.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print('Images:',len(results),'Errors:',sum(r['status']=='error' for r in results),flush=True)
for r in results:
    if r['status']=='error': print(r,flush=True)
