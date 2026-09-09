import fs from 'node:fs';
import { categoryUrl } from './portfolio.mjs';
export const fixtureSnapshot=JSON.parse(fs.readFileSync(new URL('../product-inventory/fixture-expansion/galleries.json',import.meta.url),'utf8'));
const definitions=[
  ['vice','mengene-tipi-ceneler','Vice grips','Mengene çeneleri'],
  ['pneumatic','pnomatik-kavramalar-ve-ceneler','Pneumatic grips','Pnömatik çeneler'],
  ['pincer','kerpeten-tip-ceneler','Pincer grip configurations','Kerpeten tipi çeneler'],
  ['wire-rope','tel-iphalat-serit-vb-numune-cekme-ceneleri','Wire, rope & ribbon grips','Tel, ip, halat ve şerit çeneleri'],
  ['holders','tutucu-fiksturler-ve-ceneler','Specimen holders & grips','Numune tutucular ve çeneler'],
  ['flexure','egilme-ve-bukulme-aparatlari-ve-fiksturleri','Flexure fixtures','Eğilme fikstürleri'],
  ['compression','sikistirma-plakalari-ve-aparatlari','Compression platens','Basma plakaları'],
  ['peel','soyulma-siyrilma-yapisma-dayanimi-fiksturleri','Peel & adhesion fixtures','Soyulma ve yapışma fikstürleri'],
  ['shear','shear-kesme-soyma-aparatlari','Shear & cutting fixtures','Kesme ve kayma fikstürleri'],
  ['puncture','penetrasyon-delme-saplama-problari-fiksturleri','Puncture fixtures','Delme fikstürleri'],
  ['textile','tekstil-dugme-citcit','Textile, button & snap fixtures','Tekstil, düğme ve çıtçıt fikstürleri'],
  ['plastics-rubber','plastik-ve-kaucuk-icin-ozel-test-fiskturleri','Plastics & rubber fixtures','Plastik ve kauçuk fikstürleri'],
  ['fasteners','baglanti-elemanlari','Fastener fixtures','Bağlantı elemanı fikstürleri'],
  ['paper-packaging','kagit-karton-mukavva-sektoru','Paper & packaging fixtures','Kağıt, karton ve mukavva fikstürleri'],
  ['ceramics','seramik-fayans-yer-karosu','Ceramic & tile fixtures','Seramik, fayans ve yer karosu fikstürleri'],
  ['footwear','ayakkabi-sektoru','Footwear fixtures','Ayakkabı test fikstürleri'],
  ['wood-furniture','ahsap-mobilya-test-ceneleri','Wood & furniture fixtures','Ahşap ve mobilya fikstürleri'],
  ['test-setups','labomak-dayanim-cihazlarina-ait-bazi-ornekler','Testing system examples','Test sistemi örnekleri']
];
export const fixtureGroups=definitions.map(([id,slug,en,tr])=>{
  const source=fixtureSnapshot.galleries.find(g=>g.slug===slug);
  if(!source?.images.length)throw new Error('Missing fixture images: '+slug);
  return {id,name:{en,tr},source,intro:{en:`Explore ${source.images.length} illustrated configurations from the Labomak ${en.toLowerCase()} collection.`,tr:`Labomak ${tr.toLocaleLowerCase('tr')} koleksiyonundaki ${source.images.length} görselli konfigürasyonu inceleyin.`},examples:source.images.map(image=>({image,name:{en:image.caption,tr:image.caption}}))};
});
export const fixtureItems=[...fixtureGroups.reduce((items,g)=>{
  for(const e of g.examples){
    if(!items.has(e.image.id))items.set(e.image.id,{...e,groups:[],captions:[]});
    const item=items.get(e.image.id);item.groups.push(g);
    if(!item.captions.includes(e.image.caption))item.captions.push(e.image.caption);
  }
  return items;
},new Map()).values()];
export const fixtureUrl=(lang,id)=>categoryUrl(lang,'fixtures')+id+'/';
