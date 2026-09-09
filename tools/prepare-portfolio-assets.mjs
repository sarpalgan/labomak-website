import fs from 'node:fs';
import {products,inventory} from '../data/portfolio.mjs';
import {fixtureGroups} from '../data/fixtures.mjs';
const chosen=[...products.map(p=>p.image),...inventory.products.filter(p=>p.record_kind==='accessory_category').flatMap(p=>p.images.slice(0,1)),...inventory.products.find(p=>p.id==='wp-post-1128').images.slice(1,13),...fixtureGroups.flatMap(g=>g.examples.map(e=>e.image))];
const unique=[...new Map(chosen.filter(Boolean).map(i=>[i.id,i])).values()];
fs.writeFileSync(new URL('../data/portfolio-assets.json',import.meta.url),JSON.stringify(unique.map(i=>({id:i.id,url:i.display_url,local:'/assets/catalogue/'+i.id+new URL(i.display_url).pathname.match(/\.[^.]+$/)[0]})),null,2));
console.log(`Prepared ${unique.length} image references.`);
