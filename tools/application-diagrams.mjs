const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
export function applicationDiagram(id,lang){
  const t=(en,tr)=>lang==='tr'?tr:en;
  const line=(x1,y1,x2,y2,arrow=false)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${arrow?'#b47a12':'#536775'}" stroke-width="${arrow?4:2}" ${arrow?'marker-end="url(#test-arrow)"':''}/>`;
  const rect=(x,y,w,h,fill='#d7e0e2')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}" stroke="#536775" stroke-width="2"/>`;
  const text=(x,y,s)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="#283b48" font-size="13" font-family="Arial,sans-serif">${esc(s)}</text>`;
  const path=(d,fill='none')=>`<path d="${d}" fill="${fill}" stroke="#536775" stroke-width="3"/>`;
  let art,desc;
  if(id==='tensile'){
    art=rect(173,52,74,34)+rect(173,230,74,34)+path('M188 86 L188 113 Q201 125 201 140 L201 210 Q201 222 188 230 L232 230 Q219 222 219 210 L219 140 Q219 125 232 113 L232 86 Z','#efc76e')+line(210,48,210,18,true)+line(210,268,210,294,true)+line(270,139,270,209)+line(260,139,280,139)+line(260,209,280,209)+text(307,180,'L₀')+text(105,174,t('Gauge section','Ölçü bölgesi'))+line(149,170,196,170);
    desc=t('Axial tension: two grips pull outward; L₀ marks the initial gauge length on the specimen.','Eksenel çekme: iki çene dışa doğru çeker; L₀ numune üzerindeki başlangıç ölçü boyunu gösterir.');
  }else if(['compression','crush'].includes(id)){
    art=rect( 90,83,240,20)+rect(90,226,240,20)+(id==='crush'?rect(145,113,130,105,'#efc76e')+path('M145 113 L210 136 L275 113 M210 136 L210 218'):rect(171,113,78,105,'#efc76e'))+line(210,25,210, 70,true)+line(210,290,210,259,true)+text(210,180,id==='crush'?t('Box / component','Kutu / bileşen'):t('Specimen','Numune'));
    desc=t('Compression: opposing platens load the specimen inward along the vertical axis.','Basma: karşılıklı plakalar numuneyi düşey eksende içe doğru yükler.');
  }else if(id==='flexure'){
    art=path('M66 184 Q210 206 354 184','none')+path('M80 225 L99 193 L118 225 Z','#d7e0e2')+path('M302 225 L321 193 L340 225 Z','#d7e0e2')+line(210, 70,210,178,true)+text(210,48,t('Applied load','Uygulanan yük'))+line(99,258,321,258)+line(99,250,99,266)+line(321,250,321,266)+text(210,285,t('Support span','Destek açıklığı'));
    desc=t('Three-point bending: one central loading nose and two lower supports.','Üç nokta eğilme: ortada bir yükleme ucu ve altta iki destek.');
  }else if(id==='shear'){
    art=rect(70,145,175,18)+rect(175,173,175,18)+rect(175,163,70,10,'#efc76e')+line(105,154,28,154,true)+line(315,182,392,182,true)+text(210, 80,t('Single-lap joint','Tek bindirmeli bağlantı'))+line(210,95,210,140)+text(210,250,t('Bonded overlap','Yapıştırılmış bindirme'))+line(210,230,210,196);
    desc=t('Lap shear: overlapping adherends are pulled in opposite directions across a bonded overlap.','Bindirme kayması: bindirmeli altlıklar yapıştırılmış bölge boyunca zıt yönlerde çekilir.');
  }else if(id==='adhesion'){
    art=rect(90,205,250,22)+path('M330 199 L216 199 Q200 199 200 180 L200 85')+line(200, 80,200,28,true)+line(218,178,245,178)+line(245,178,245,199)+text(280,160,'90°')+text(210,265,t('Bonded substrate','Yapıştırılmış altlık'));
    desc=t('90-degree peel: a flexible strip is pulled upward from a supported horizontal substrate.','90 derece soyulma: esnek şerit desteklenen yatay altlıktan yukarı doğru çekilir.');
  }else if(id==='puncture'||id==='impact'){
    art=rect(68,213,95,20)+rect(257,213,95,20)+path('M80 207 L160 207 Q210 224 260 207 L340 207')+path('M196 102 L224 102 L224 149 L210 166 L196 149 Z','#d7e0e2')+line(210,32,210, 80,true)+text(210,285,t('Supported specimen','Desteklenen numune'))+text( 80,137,id==='impact'?t('Falling mass','Düşen kütle'):t('Driven probe','İlerletilen prob'));
    desc=id==='impact'?t('Falling-mass impact: a striker falls toward a specimen held over an opening.','Düşen kütle darbesi: vurucu açıklık üzerinde tutulan numuneye düşer.'):t('Puncture: a driven probe approaches a specimen held around an exposed area.','Delinme: ilerletilen prob açık alan çevresinden tutulan numuneye yaklaşır.');
  }else if(id==='permeability'){
    art=rect(193,65,34,190,'#efc76e')+[115,160,205].map(y=>line(65,y,170,y,true)+line(250,y,355,y,true)).join('')+text(100, 50,t('Upstream','Giriş tarafı'))+text(320,50,t('Downstream','Çıkış tarafı'))+text(210,285,t('Exposed specimen area','Açık numune alanı'));
    desc=t('Transport through a specimen from one controlled side to the other; the driving condition depends on the method.','Numunenin bir kontrollü tarafından diğerine geçiş; geçişi oluşturan koşul metoda bağlıdır.');
  }else if(id==='temperature'){
    art=rect(85, 50,250,220)+rect(110, 70,175,175,'#f3f5f1')+line(115,160,280,160)+rect(159,123,78, 30,'#efc76e')+line(310,118,310,210)+`<circle cx="310" cy="220" r="12" fill="#b47a12"/>`+text(198,104,t('Specimen','Numune'))+text(210,300,t('Controlled exposure','Kontrollü maruziyet'));
    desc=t('A chamber exposes a specimen to a controlled environment; a sensor tracks the chamber condition.','Kabin numuneyi kontrollü çevreye maruz bırakır; sensör kabin koşulunu izler.');
  }else if(id==='abrasion'){
    art=rect(70,218,280,22,'#efc76e')+`<circle cx="210" cy="167" r="47" fill="#d7e0e2" stroke="#536775" stroke-width="3"/><circle cx="210" cy="167" r="12" fill="#f3f5f1" stroke="#536775"/>`+line(210,42,210,101,true)+line(110,272,310,272,true)+text(210, 30,t('Normal load','Normal yük'))+text(210,300,t('Relative motion','Göreli hareket'));
    desc=t('An abrasive counterface contacts a surface under normal load while relative movement produces wear.','Aşındırıcı karşı yüzey normal yük altında yüzeye temas eder; göreli hareket aşınma oluşturur.');
  }else{
    art=line(55,255,375,255)+line(55,255,55, 50)+path('M65 150 C90 45 115 45 140 150 S190 255 215 150 S265 45 290 150 S340 255 365 150')+text(210,292,t('Time / cycles','Zaman / çevrim'))+text(100, 30,t('Load','Yük'));
    desc=t('Schematic repeated loading as a function of time; this is an illustration, not measured test data.','Zamana bağlı şematik tekrarlı yükleme; bu çizim ölçülmüş deney verisi değildir.');
  }
  return `<figure class="application-diagram"><svg viewBox="0 0 420 320" role="img" aria-labelledby="test-diagram-title test-diagram-desc"><title id="test-diagram-title">${esc(desc)}</title><desc id="test-diagram-desc">${t('Concept diagram; dimensions and deformation are illustrative.','Kavram çizimi; boyutlar ve deformasyon temsilidir.')}</desc><defs><marker id="test-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#b47a12"/></marker></defs>${art}</svg><figcaption>${esc(desc)} <span>${t('Schematic · not to scale','Şema · ölçekli değildir')}</span></figcaption></figure>`;
}
