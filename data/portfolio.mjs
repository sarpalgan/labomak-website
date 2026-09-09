import fs from 'node:fs';
import { applicationGuides } from './application-guides.mjs';
export const inventory = JSON.parse(fs.readFileSync(new URL('../product-inventory/catalog.json', import.meta.url), 'utf8'));
export const bySource = new Map(inventory.products.filter(p=>p.id.startsWith('wp-post-')).map(p => [p.source_wordpress_id, p]));
export const tr = (lang, en, turkish) => lang === 'tr' ? turkish : en;
export const catalogRoot = lang => lang === 'tr' ? '/tr/urunler/' : '/en/products/';
export const categories = [
  ['universal', 'Universal testing', 'Üniversal test', 'Tensile, compression and material-strength systems.', 'Çekme, basma ve malzeme dayanım test sistemleri.'],
  ['packaging', 'Paper & packaging', 'Kağıt ve ambalaj', 'From paper stiffness to the strength of a finished box.', 'Kağıt sertliğinden bitmiş kolinin dayanımına.'],
  ['impact', 'Impact & drop', 'Darbe ve düşme', 'Pendulum, falling-weight and impact test equipment.', 'Sarkaçlı, ağırlık düşürmeli ve darbe test ekipmanları.'],
  ['fatigue', 'Fatigue & springs', 'Yorulma ve yay', 'Measure spring behaviour and performance under repeated loading.', 'Yay davranışını ve tekrarlanan yükler altındaki performansı ölçün.'],
  ['flow', 'Flow & permeability', 'Akış ve geçirgenlik', 'Melt flow, air and water-vapour transmission, and leak testing.', 'Erime akışı, hava ve su buharı geçirgenliği ve sızdırmazlık testleri.'],
  ['thermal', 'Thermal & environmental', 'Isıl ve çevresel testler', 'Condition specimens and evaluate materials under temperature exposure.', 'Numuneleri şartlandırın, malzemeleri sıcaklık altında değerlendirin.'],
  ['construction', 'Construction materials', 'Yapı malzemeleri', 'Testing for concrete, masonry, bitumen, flooring and ceramics.', 'Beton, kagir, bitüm, zemin ve seramik testleri.'],
  ['components', 'Component testing', 'Bileşen testleri', 'Dedicated systems for automotive, sanitary, pipe and duct components.', 'Otomotiv, sıhhi ürünler, boru ve kanal bileşenleri için özel sistemler.'],
  ['fixtures', 'Grips & fixtures', 'Çeneler ve fikstürler', 'Connect the specimen to the test with the right gripping and support geometry.', 'Numuneyi doğru kavrama ve destek geometrisiyle test edin.'],
  ['accessories', 'Accessories & controls', 'Aksesuarlar ve kontrol', 'Strain measurement, operator controls and display options.', 'Uzama ölçümü, kullanıcı kumandaları ve ekran seçenekleri.'],
  ['software', 'Falcon software', 'Falcon yazılımı', 'Test control, analysis, reporting and archive workflows.', 'Test kontrolü, analiz, raporlama ve arşiv iş akışları.']
].map(([id,en,tr,enIntro,trIntro]) => ({id,en,tr,intro:{en:enIntro,tr:trIntro}}));
export const categoryById = new Map(categories.map(c => [c.id,c]));
export const categoryUrl = (lang,id) => id === 'universal' ? (lang === 'tr' ? '/tr/urunler/universal-test-cihazlari/' : '/en/products/universal-testing-machines/') : catalogRoot(lang) + id + '/';

// Deliberately edited summaries. The dated scrape remains evidence, not publishable HTML.
const rows = [
  [571,'tetracol','universal','TetraCol hydraulic testing systems','TetraCol hidrolik test sistemleri','Hydraulic material testing with a frame and fixture arrangement selected for the application.','Uygulamaya göre seçilen gövde ve fikstür düzeniyle hidrolik malzeme testleri.'],
  [1240,'multitask','universal','MultiTask testing systems','MultiTask test sistemleri','Two load cells and fixture sets for laboratories working with different test setups.','Farklı test düzenleriyle çalışan laboratuvarlar için iki yük hücresi ve fikstür takımı.'],
  [5452,'servo-spring-fatigue','fatigue','Servo spring fatigue tester','Servo yay yorulma cihazı','Computer-controlled spring testing for tension and repeated loading.','Çekme ve tekrarlı yükleme için bilgisayar kontrollü yay test sistemi.'],
  [5326,'sct','packaging','SCT short-span compression tester','SCT kısa açıklıklı basma test cihazı','Short-span compression testing for paper and board.','Kağıt ve kartonun kısa açıklıkta basma dayanımını belirlemek için.'],
  [5212,'monocol-kompetan','universal','MonoCol Kompetan','MonoCol Kompetan','Single-column material testing with Falcon Pro analysis and archiving.','Falcon Pro analiz ve arşivleme ile tek kolonlu malzeme test sistemi.'],
  [5191,'duocol-kompetan','universal','DuoCol Kompetan','DuoCol Kompetan','Dual-column material testing with the Kompetan control and software level.','Kompetan kontrol ve yazılım seviyesiyle çift kolonlu malzeme test sistemi.'],
  [5183,'monocol-kobi','universal','MonoCol Kobi','MonoCol Kobi','A servo-driven single-column platform for routine laboratory material testing.','Rutin laboratuvar malzeme testleri için servo motorlu tek kolonlu platform.'],
  [5159,'duocol-kobi','universal','DuoCol Kobi','DuoCol Kobi','A dual-column platform with computer control for material-strength testing.','Malzeme dayanım testleri için bilgisayar kontrollü çift kolonlu platform.'],
  [5152,'monocol-ceko','universal','MonoCol Çeko','MonoCol Çeko','Single-column tensile and compression testing with Falcon Eko.','Falcon Eko ile tek kolonlu çekme ve basma testleri.'],
  [5135,'duocol-ceko-android','universal','DuoCol Çeko Android','DuoCol Çeko Android','Dual-column tensile and compression testing with the Çeko Android configuration.','Çeko Android konfigürasyonuyla çift kolonlu çekme ve basma testleri.'],
  [2097,'burst-testing','packaging','Paper & board burst tester','Kağıt ve karton patlatma test cihazı','Determine the bursting resistance of paper, board and corrugated packaging.','Kağıt, karton ve oluklu mukavvanın patlama dayanımını belirleyin.'],
  [4859,'bending-stiffness','packaging','Bending stiffness tester','Bükülme ve eğilme sertliği test cihazı','Evaluate the resistance of sheet materials to bending.','Levha malzemelerin bükülmeye karşı direncini değerlendirin.'],
  [4832,'falling-weight-impact','impact','Falling-weight impact tester','Ağırlık düşürmeli darbe test cihazı','Falling-weight impact testing with specimen supports and weights selected for the method.','Metoda uygun numune desteği ve ağırlıklarla düşürmeli darbe testleri.'],
  [4789,'low-temperature-bending','thermal','Low-temperature bending tester','Soğukta bükülme test cihazı','Evaluate the bending behaviour of waterproofing materials at low temperature.','Su yalıtım malzemelerinin düşük sıcaklıkta bükülme davranışını değerlendirin.'],
  [4786,'glass-wool-air-permeability','flow','Glass wool air permeability tester','Cam yünü hava geçirgenlik test cihazı','Measure resistance to airflow through glass wool and insulation materials.','Cam yünü ve yalıtım malzemelerinin hava akışına karşı direncini ölçün.'],
  [4782,'insulation-service-temperature','thermal','Insulation service-temperature tester','Yalıtım servis sıcaklığı test cihazı','Determine service-temperature behaviour of thermal insulation products.','Isı yalıtım ürünlerinin servis sıcaklığındaki davranışını belirleyin.'],
  [4779,'pipe-insulation-temperature','thermal','Pipe insulation temperature tester','Boru yalıtımı sıcaklık test cihazı','Temperature testing designed for pipe-shaped insulation specimens.','Boru biçimli yalıtım numuneleri için sıcaklık test sistemi.'],
  [4775,'brake-chamber','components','Brake chamber tester','Fren körüğü test cihazı','Measure service and emergency-brake force behaviour in brake chambers.','Fren körüklerinde servis ve imdat freni kuvvet davranışını ölçün.'],
  [4770,'static-indentation','construction','Static indentation tester','Statik çukurlaşma test cihazı','Evaluate indentation behaviour of flooring under a static load.','Zemin malzemelerinin statik yük altında çukurlaşma davranışını değerlendirin.'],
  [4766,'flush-valve-durability','components','Flush valve durability tester','Boşaltma vanası ömür test cihazı','Repeated-cycle testing for the reliability of toilet flushing valves.','Klozet boşaltma vanalarının güvenilirliği için tekrarlı çevrim testleri.'],
  [4763,'sanitary-loading','components','Toilet & basin load tester','Klozet ve lavabo yükleme test cihazı','Apply test loads to toilets and basins to assess structural performance.','Yapısal performansı değerlendirmek için klozet ve lavabolara test yükü uygulayın.'],
  [4760,'manual-hydraulic-tensile','universal','Manual hydraulic tensile tester','Manuel hidrolik çekme cihazı','Hydraulically applied tensile loading with manual operation.','Manuel kullanımla hidrolik çekme yükü uygulama sistemi.'],
  [4753,'pipe-impact','impact','Pipe impact tester','Boru darbe test cihazı','Impact testing for pipe and conduit specimens.','Boru ve elektrik tesisat borusu numuneleri için darbe testleri.'],
  [4750,'duct-sag','components','Duct sag tester','Hava kanalı sarkma test cihazı','Evaluate sagging in air duct specimens.','Hava kanalı numunelerindeki sarkmayı değerlendirin.'],
  [4747,'air-leak','flow','Air leak tester','Hava sızdırmazlık test cihazı','Evaluate air leakage in duct assemblies.','Hava kanalı düzeneklerinde hava kaçaklarını değerlendirin.'],
  [4744,'duct-bending','components','Duct bending tester','Hava kanalı bükme test cihazı','Test air duct bending behaviour in a dedicated setup.','Hava kanallarının bükülme davranışını özel bir düzenekte test edin.'],
  [4740,'marshall-stability','construction','Marshall stability tester','Marshall stabilite test cihazı','Assess the stability of bituminous mixture specimens.','Bitümlü karışım numunelerinin stabilitesini değerlendirin.'],
  [4737,'lock-durability','components','Key & lock durability tester','Anahtar ve kilit ömür test cihazı','Repeated operation testing for key and lock mechanisms.','Anahtar ve kilit mekanizmaları için tekrarlı çalışma testleri.'],
  [4732,'furniture-leg-flooring','construction','Furniture-leg flooring tester','Mobilya ayağı zemin test cihazı','Evaluate the effect of a furniture leg on floor coverings.','Mobilya ayağının zemin kaplamaları üzerindeki etkisini değerlendirin.'],
  [4728,'surface-abrasion','construction','Specimen surface grinder','Numune yüzeyi taşlama cihazı','Prepare parallel specimen surfaces for concrete and natural-stone testing.','Beton ve doğal taş testleri için paralel numune yüzeyleri hazırlayın.'],
  [4722,'vacuum-chamber','construction','Vacuum chamber','Vakum odası','Vacuum conditioning for material testing and specimen preparation.','Malzeme testleri ve numune hazırlama için vakum şartlandırması.'],
  [4716,'brake-frame','components','Railway brake frame tester','Fren çerçevesi test cihazı','Measure deflection of railway brake frame components under load.','Demiryolu fren çerçevesi bileşenlerinin yük altında esnemesini ölçün.'],
  [4702,'drip-pipe-tensile','components','Drip irrigation pipe tensile tester','Damla sulama borusu çekme test cihazı','Tensile testing for drip irrigation pipe specimens.','Damla sulama borusu numuneleri için çekme testleri.'],
  [4697,'drip-pipe-leak','flow','Drip irrigation pipe leak tester','Damla sulama borusu sızdırmazlık cihazı','Leak testing for drip irrigation pipes.','Damla sulama boruları için sızdırmazlık testleri.'],
  [4653,'water-vapour-permeability','flow','Water-vapour permeability tester','Su buharı geçirgenliği test cihazı','Evaluate water-vapour transmission through material specimens.','Malzeme numunelerinde su buharı geçişini değerlendirin.'],
  [4650,'force-ductilometer','construction','Force-measuring ductilometer','Kuvvet ölçerli düktilitemetre','Ductility testing with force measurement for bituminous materials.','Bitümlü malzemeler için kuvvet ölçümlü süneklik testleri.'],
  [4640,'water-absorption','construction','Water absorption tester','Su emme tayini test cihazı','Determine the water absorption behaviour of material specimens.','Malzeme numunelerinin su emme davranışını belirleyin.'],
  [4645,'climatic-chamber','thermal','Climatic chamber','İklimlendirme kabini','Controlled environmental conditioning for test specimens.','Test numuneleri için kontrollü çevresel şartlandırma.'],
  [4626,'concrete-compression','construction','Concrete compression press','Beton test presi','Apply compressive loading to concrete specimens.','Beton numunelerine basma yükü uygulayın.'],
  [3531,'pincer-grips','fixtures','Pincer grips','Kerpeten tip test çeneleri','Gripping arrangements for specimens that need a compact, concentrated grip.','Dar alanda kuvvetli kavrama gerektiren numuneler için çene düzenekleri.'],
  [3114,'coating-preparation-fixture','fixtures','Coating specimen preparation fixture','Kaplama numunesi hazırlama fikstürü','A dedicated preparation fixture for tensile testing of metallic coatings.','Metalik kaplamaların çekme testine yönelik özel numune hazırlama fikstürü.'],
  [274,'falcon','software','Falcon test software','Falcon test yazılımı','Control tests, analyse results and prepare reports with Falcon Eko and Falcon Pro.','Falcon Eko ve Falcon Pro ile testleri kontrol edin, sonuçları analiz edin ve rapor hazırlayın.'],
  [722,'spring-tension','fatigue','Spring tension tester','Yay tansiyon test cihazı','Testing platforms for coil, disc, pneumatic and gas springs.','Helezon, disk, pnömatik ve gaz yayları için test platformları.'],
  [228,'melt-flow-index','flow','MFI melt flow index tester','MFI erime akışkanlığı test cihazı','Determine melt mass-flow and volume-flow behaviour of thermoplastics.','Termoplastiklerin eriyik kütle ve hacim akış davranışını belirleyin.'],
  [55,'charpy-izod','impact','Charpy & Izod impact testing','Charpy ve İzod darbe testleri','Pendulum impact testing with hammer and fixture options for the selected method.','Seçilen metoda uygun çekiç ve fikstür seçenekleriyle sarkaçlı darbe testleri.'],
  [160,'boxmax','packaging','BoxMax box compression tester','BoxMax koli basma test cihazı','Compression testing of boxes, cartons and packaging with application-sized platforms.','Uygulamaya göre boyutlandırılmış platformlarla kutu, koli ve ambalaj basma testleri.'],
  [1185,'ovens-incubators','thermal','Drying ovens & incubators','Kurutma fırınları, etüvler ve inkübatörler','Air-circulating ovens for specimen conditioning and temperature exposure.','Numune şartlandırma ve sıcaklık deneyleri için hava sirkülasyonlu fırınlar.'],
  [552,'paper-compression','packaging','Paper & board compression testing','Kağıt ve karton basma testleri','ECT, FCT, RCT, CMT, CCT and PAT setups for paper and packaging laboratories.','Kağıt ve ambalaj laboratuvarları için ECT, FCT, RCT, CMT, CCT ve PAT düzenekleri.'],
  [2063,'textile-air-permeability','flow','Textile air permeability tester','Tekstil hava geçirgenlik test cihazı','Airflow resistance testing for woven, knitted and nonwoven textiles.','Dokuma, örme ve dokusuz tekstillerde hava akış direnci testleri.'],
  [668,'fatigue-life','fatigue','Fatigue & life tester','Yorulma ve ömür test cihazı','Computer-controlled cyclic loading with analysis, reporting and archiving.','Analiz, raporlama ve arşivlemeyle bilgisayar kontrollü çevrimsel yükleme.'],
  [2863,'board-puncture','packaging','Board puncture tester','Karton delme test cihazı','Measure the energy absorbed during puncture of corrugated board.','Oluklu mukavvanın delinme sırasında emdiği enerjiyi ölçün.'],
  [1495,'hardy-integrity','impact','HIT Hardy Integrity Tester','HIT bebek bezi darbe test cihazı','Evaluate absorbent distribution and clumping in diapers and hygiene products.','Bebek bezi ve hijyen ürünlerinde emici dağılımını ve topaklanmayı değerlendirin.'],
  [1315,'flexible-conduit-compression','components','Flexible conduit compression tester','Esnek elektrik borusu sıkıştırma cihazı','Automated compression testing for flexible electrical conduit systems.','Esnek elektrik tesisat boruları için otomatik sıkıştırma testleri.'],
  [1202,'ceramic-tile-flexure','construction','Ceramic tile flexural tester','Seramik ve fayans kırma test cihazı','Bending and breaking tests for ceramic tiles and related specimens.','Seramik, fayans ve ilgili numuneler için eğilme ve kırma testleri.'],
  [5106,'tape-static-shear','thermal','Adhesive tape static shear tester','Yapışkan bant statik kayma test cihazı','Evaluate static shear adhesion of tapes under specified temperature conditions.','Belirlenmiş sıcaklık koşullarında bantların statik kayma yapışmasını değerlendirin.'],
  [4619,'masonry-initial-shear','construction','Masonry initial shear tester','Kagir başlangıç kayma test cihazı','Determine initial shear strength in masonry bed joints.','Kagir birimlerin yatak derzlerindeki başlangıç kayma dayanımını belirleyin.']
];
const photoIndex = {5452:1,722:1,2097:2,1185:1};
export const products = rows.map(([sourceId,slug,category,enName,trName,enIntro,trIntro]) => {
  const source=bySource.get(sourceId);
  if (!source) throw new Error(`Missing inventory record ${sourceId}`);
  return {id:String(sourceId),slug,category,source, name:{en:enName,tr:trName},intro:{en:enIntro,tr:trIntro},image:source.images[photoIndex[sourceId] ?? 0],existingFamily:sourceId===571?'tetracol':sourceId===1240?'multitask':null,family: /monocol/.test(slug)?'monocol':/duocol/.test(slug)?'duocol':null};
});
export const productUrl = (lang,p) => p.existingFamily?categoryUrl(lang,'universal')+p.existingFamily+'/':catalogRoot(lang) + 'details/' + p.slug + '/';
export const productById = new Map(products.map(p=>[Number(p.id),p]));
export const groups = {
  applications: applicationGuides.map(g=>[g.id,g.name.en,g.name.tr,[],[],g.productIds]),
  industries: [
    ['polymers','Plastics & rubber','Plastik ve kauçuk',[304],[]],
    ['packaging','Paper & packaging','Kağıt ve ambalaj',[312,821],[]],
    ['textiles','Textiles & nonwovens','Tekstil ve dokusuz yüzeyler',[306,318],[]],
    ['metals','Metals & fasteners','Metal ve bağlantı elemanları',[867,868],[]],
    ['construction','Construction & ceramics','İnşaat ve seramik',[843,305,771],[]],
    ['automotive','Automotive & aerospace','Otomotiv ve havacılık',[438,311],[]],
    ['medical','Medical & biomedical','Medikal ve biyomedikal',[315,314,319],[]],
    ['wood','Wood & furniture','Ahşap ve mobilya',[745],[]],
    ['electronics','Electronics & energy','Elektronik ve enerji',[313,310],[]],
    ['food','Food & agriculture','Gıda ve tarım',[307,308],[]],
    ['footwear','Footwear','Ayakkabı',[770],[]]
  ]
};
export const groupUrl = (lang,kind,id='') => (lang==='tr'?'/tr/':'/en/')+(lang==='tr'?(kind==='applications'?'uygulamalar':'sektorler'):kind)+'/'+(id?id+'/':'');
export const groupProducts = group => group[5] ? group[5].map(id=>productById.get(id)) : products.filter(p=>group[4].includes(p.category)||p.source.source_categories.some(c=>group[3].includes(c.id)));
export const selection = {
  universal: [['Expected force and specimen dimensions','Beklenen kuvvet ve numune ölçüleri'],['Gripping, test travel and strain measurement','Kavrama, test mesafesi ve uzama ölçümü'],['Control and reporting requirements','Kontrol ve raporlama ihtiyaçları']],
  packaging: [['Material grade and specimen dimensions','Malzeme sınıfı ve numune ölçüleri'],['Test method and sample preparation','Test metodu ve numune hazırlama'],['Required load range and fixture arrangement','Gereken yük aralığı ve fikstür düzeni']],
  impact: [['Impact method and specimen geometry','Darbe metodu ve numune geometrisi'],['Required energy, weights and supports','Gereken enerji, ağırlıklar ve destekler'],['Guarding and sample handling','Koruyucu düzen ve numune yerleştirme']],
  fatigue: [['Load range and loading sequence','Yük aralığı ve yükleme sırası'],['Cycle count, frequency and travel','Çevrim sayısı, frekans ve hareket mesafesi'],['Specimen connection and failure criteria','Numune bağlantısı ve hata kriterleri']],
  flow: [['Material and specimen preparation','Malzeme ve numune hazırlama'],['Test medium, temperature and pressure','Test ortamı, sıcaklık ve basınç'],['Required measurement and reporting range','Gereken ölçüm ve raporlama aralığı']],
  thermal: [['Required temperature and exposure time','Gereken sıcaklık ve bekleme süresi'],['Specimen size and chamber arrangement','Numune boyutu ve kabin düzeni'],['Conditioning sequence and measurement points','Şartlandırma sırası ve ölçüm noktaları']],
  construction: [['Material, specimen geometry and preparation','Malzeme, numune geometrisi ve hazırlığı'],['Loading method and measurement range','Yükleme metodu ve ölçüm aralığı'],['Test procedure and reporting needs','Test prosedürü ve raporlama ihtiyaçları']],
  components: [['Component drawing and mounting points','Bileşen çizimi ve bağlantı noktaları'],['Loading sequence and operating conditions','Yükleme sırası ve çalışma koşulları'],['Measurements and acceptance criteria','Ölçümler ve kabul kriterleri']],
  fixtures: [['Specimen material and gripping area','Numune malzemesi ve kavrama alanı'],['Test load and machine connection','Test yükü ve cihaz bağlantısı'],['Alignment, contact surfaces and travel','Hizalama, temas yüzeyleri ve hareket mesafesi']],
  accessories: [['Machine model and existing controller','Cihaz modeli ve mevcut kontrolör'],['Measurement or operator-control needs','Ölçüm veya kullanıcı kontrol ihtiyaçları'],['Connection and software compatibility','Bağlantı ve yazılım uyumluluğu']],
  software: [['Test machine and controller','Test cihazı ve kontrolör'],['Methods and reporting requirements','Metotlar ve raporlama ihtiyaçları'],['Archive and user-access requirements','Arşiv ve kullanıcı erişim ihtiyaçları']]
};
