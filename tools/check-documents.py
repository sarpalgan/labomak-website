"""Verify linked PDF responses without downloading the complete documents."""
import json, concurrent.futures
from datetime import date
from pathlib import Path
import requests
root=Path(__file__).resolve().parent.parent
items=json.loads((root/'data/document-check-input.json').read_text(encoding='utf-8-sig'))
def check(item):
    try:
        with requests.get(item['url'],stream=True,timeout=40) as r:
            prefix=next(r.iter_content(chunk_size=1024),b'')
            return {**item,'checked_on':date.today().isoformat(),'status':r.status_code,'content_type':r.headers.get('Content-Type'),'pdf_signature':b'%PDF-' in prefix,'prefix_hex':prefix[:16].hex(),'final_url':r.url}
    except Exception as error: return {**item,'status':0,'error':str(error)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: results=list(pool.map(check,items))
(root/'data/document-status.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(results,ensure_ascii=False,indent=2))
