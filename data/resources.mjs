import { createHash } from 'node:crypto';
import { inventory, products } from './portfolio.mjs';
const titles={
  'YENI-FALCON-YAY-TANSIYON-KULLANMA-KILAVUZU.pdf':['Spring testing — operating guide','Yay testleri — kullanım kılavuzu','manual'],
  '21.YAY-TANSIYON-KOMPETAN-MONOCOL-brosur.pdf':['MonoCol Kompetan spring tester','MonoCol Kompetan yay test cihazı','brochure'],
  '22.YAY-TANSIYON-KOMPETAN-DUOCOL-brosur.pdf':['DuoCol Kompetan spring tester','DuoCol Kompetan yay test cihazı','brochure'],
  '10.CEKME-KOPMA-BASMA-UZAMA-TEST-CIHAZLARI-KARSILASTIRMA-BROSURU.pdf':['Universal testing — family comparison','Üniversal test — ürün ailesi karşılaştırması','comparison'],
  'LABOTENS-MONOCOL-KOMPETAN-brosur.pdf':['MonoCol Kompetan brochure','MonoCol Kompetan broşürü','brochure'],
  '3.LABOTENS-KOBI-MONOCOL-brosur.pdf':['MonoCol Kobi brochure','MonoCol Kobi broşürü','brochure'],
  'LABOTENS-KOBI-DUOCOL-yeni-cihaz-brosur.pdf':['DuoCol Kobi brochure','DuoCol Kobi broşürü','brochure'],
  '1.LABOTENS-CEKO-MONOCOL-brosur_.pdf':['MonoCol Çeko brochure','MonoCol Çeko broşürü','brochure'],
  'CEKO-DUOCOL-BT.pdf':['DuoCol Çeko Android brochure','DuoCol Çeko Android broşürü','brochure'],
  'Örnek-test-raporu.pdf':['Falcon — example test report','Falcon — örnek test raporu','sample'],
  '30.YUKSEK-KAPASITE-HIDROLIK-TEST-CIHAZLARI-brosur.pdf':['TetraCol hydraulic systems brochure','TetraCol hidrolik sistemler broşürü','brochure'],
  '19.YAY-TANSIYON-KOBI-MONOCOL.pdf':['MonoCol Kobi spring tester','MonoCol Kobi yay test cihazı','brochure'],
  '20.YAY-TANSIYON-KOBI-DUOCOL.pdf':['DuoCol Kobi spring tester','DuoCol Kobi yay test cihazı','brochure'],
  'MFI-Kullanim-Klavuzu.pdf':['MFI — operating guide','MFI — kullanım kılavuzu','manual'],
  '8.LABOFLOW-KOBI-mfi-erime-noktasi-endeksi-brosuru.pdf':['LABOFLOW Kobi MFI brochure','LABOFLOW Kobi MFI broşürü','brochure'],
  '9.LABOFLOW-KOMPETAN-mfi-erime-noktasi-endeksi-brosuru.pdf':['LABOFLOW Kompetan MFI brochure','LABOFLOW Kompetan MFI broşürü','brochure'],
  '23.ETUV_.pdf':['Drying ovens brochure','Kurutma fırınları broşürü','brochure'],
  'HAVA-GECIRGENLIK-TEST-CIHAZI-brosur.pdf':['Textile air permeability brochure','Tekstil hava geçirgenliği broşürü','brochure']
};
const collected=new Map();
for(const source of inventory.products)for(const doc of source.documents){
  if(!/\.pdf$/i.test(doc.url))continue;
  const normalized=decodeURI(doc.url).normalize('NFC');
  const name=normalized.split('/').at(-1); const info=titles[name];
  if(!info)throw new Error('Name this source document before publishing: '+name);
  if(!collected.has(normalized))collected.set(normalized,{id:'doc-'+createHash('sha256').update(normalized).digest('hex').slice(0,10),url:new URL(normalized).href,name:{en:info[0],tr:info[1]},kind:info[2],sourceIds:[]});
  const item=collected.get(normalized);
  if(!item.sourceIds.includes(source.id))item.sourceIds.push(source.id);
}
export const documents=[...collected.values()].map(doc=>({...doc,productIds:products.filter(p=>doc.sourceIds.includes(p.source.id)&&(doc.kind!=='comparison'||p.category==='universal')).map(p=>p.id)}));
export const documentKinds=[['brochure','Brochures','Broşürler'],['manual','Operating guides','Kullanım kılavuzları'],['comparison','Comparisons','Karşılaştırmalar'],['sample','Example reports','Örnek raporlar']];
export const documentsFor=p=>documents.filter(d=>d.productIds.includes(p.id));
export const resourceUrl=lang=>lang==='tr'?'/tr/kaynaklar/':'/en/resources/';
