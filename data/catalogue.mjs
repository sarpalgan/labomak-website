// Product-family data, transcribed from Labomak's existing catalogue.
// Capacity is a frame-family maximum, not the range of every configuration.
export const source = 'https://labomak.com.tr/index.php/imalatlarimiz/cekme-kopma-basma-uzama-test-cihazlari/';
export const brochure = 'https://labomak.com.tr/wp-content/uploads/10.CEKME-KOPMA-BASMA-UZAMA-TEST-CIHAZLARI-KARSILASTIRMA-BROSURU.pdf';
export const base = { en: '/en/products/universal-testing-machines/', tr: '/tr/urunler/universal-test-cihazlari/' };
export const families = [
  {
    id: 'monocol', name: 'MonoCol', maxKN: 2, type: 'electromechanical', tiers: ['Çeko', 'Kobi', 'Kompetan'],
    en: {
      label: 'Single-column tensile testing machines', capacity: 'Up to 2 kN', layout: 'Single column',
      intro: 'A compact bench-top platform for low-force tensile and compression testing. Configure the frame, grips and software around your samples and reporting needs.',
      materials: ['Films', 'Rubber', 'Textiles', 'Wire'],
      use: 'Low-force material and component tests',
      features: ['Bench-top format for laboratory workspaces', 'Çeko stepper drive or Kobi / Kompetan servo drive', 'Sample-specific grips and fixtures', 'Falcon software for control and reporting'],
      guidance: 'Select the load cell for the force your specimen is expected to reach. Check grip opening, specimen length and required travel together, especially for highly extensible materials.'
    },
    tr: {
      label: 'Tek kolonlu çekme test cihazları', capacity: '2 kN’ye kadar', layout: 'Tek kolon',
      intro: 'Düşük kuvvetli çekme ve basma testleri için kompakt, masaüstü platform. Gövde, çene ve yazılım seçeneklerini numunenize ve raporlama ihtiyacınıza göre belirleyin.',
      materials: ['Filmler', 'Kauçuk', 'Tekstil', 'Tel'], use: 'Düşük kuvvetli malzeme ve bileşen testleri',
      features: ['Laboratuvar çalışma alanları için masaüstü yapı', 'Çeko step motor veya Kobi / Kompetan servo motor', 'Numuneye uygun çene ve fikstürler', 'Kontrol ve raporlama için Falcon yazılımı'],
      guidance: 'Yük hücresini numunenizin beklenen kuvvetine göre seçin. Özellikle yüksek uzama gösteren malzemelerde çene açıklığını, numune uzunluğunu ve gerekli hareket mesafesini birlikte değerlendirin.'
    }
  },
  {
    id: 'duocol', name: 'DuoCol', maxKN: 200, type: 'electromechanical', tiers: ['Çeko', 'Kobi', 'Kompetan'],
    en: {
      label: 'Dual-column universal testing machines', capacity: 'Up to 200 kN', layout: 'Dual column',
      intro: 'An electromechanical platform for a broad range of material-strength tests. Standard, extended-height and wider-frame configurations accommodate different specimens and fixtures.',
      materials: ['Metals', 'Wood', 'Composites', 'Components'], use: 'Versatile material testing with higher force requirements',
      features: ['Dual-column frame with application-dependent capacity', 'Çeko offered at 5 kN; Kobi and Kompetan for the wider range', 'Extended-height and wider-column options', 'Tensile, compression and bend fixture options'],
      guidance: 'Choose capacity from the expected test load, then confirm the working width, travel, grips and strain measurement. The 200 kN family maximum does not apply to every DuoCol model.'
    },
    tr: {
      label: 'Çift kolonlu üniversal test cihazları', capacity: '200 kN’ye kadar', layout: 'Çift kolon',
      intro: 'Geniş bir malzeme dayanım testi yelpazesi için elektromekanik platform. Standart, uzun ve geniş kolon aralıklı gövde seçenekleri farklı numune ve fikstürlere uyum sağlar.',
      materials: ['Metaller', 'Ahşap', 'Kompozitler', 'Bileşenler'], use: 'Daha yüksek kuvvet gerektiren çok yönlü malzeme testleri',
      features: ['Uygulamaya göre kapasite sunan çift kolonlu gövde', 'Çeko 5 kN; daha geniş kapasite aralığı için Kobi ve Kompetan', 'Uzun gövde ve geniş kolon aralığı seçenekleri', 'Çekme, basma ve eğme fikstürü seçenekleri'],
      guidance: 'Beklenen test yüküne göre kapasiteyi seçin; çalışma genişliği, hareket mesafesi, çeneler ve uzama ölçümünü birlikte doğrulayın. Ailenin 200 kN üst sınırı her DuoCol modeli için geçerli değildir.'
    }
  },
  {
    id: 'tetracol', name: 'TetraCol', maxKN: null, type: 'hydraulic', tiers: ['Kobi', 'Kompetan'],
    en: {
      label: 'Hydraulic universal testing machines', capacity: 'Configured to application', layout: 'Hydraulic frame',
      intro: 'Hydraulic testing systems for demanding material and component tests. Specify a tensile, compression or combined test arrangement around the specimen and required method.',
      materials: ['Metals', 'Chains', 'Wire rope', 'Components'], use: 'High-force material and component testing',
      features: ['Hydraulic actuation', 'Tensile-only, compression-only or combined arrangements', 'Kobi and Kompetan configuration levels', 'Application-specific software and fixtures'],
      guidance: 'Provide specimen geometry, expected force and the test standard. Our team will confirm the rated capacity and test-space dimensions for the proposed configuration.'
    },
    tr: {
      label: 'Hidrolik üniversal test cihazları', capacity: 'Uygulamaya göre belirlenir', layout: 'Hidrolik gövde',
      intro: 'Yüksek kuvvet gerektiren malzeme ve bileşen testleri için hidrolik sistemler. Numuneye ve test metoduna göre çekme, basma veya birleşik test düzeni belirleyin.',
      materials: ['Metaller', 'Zincirler', 'Çelik halat', 'Bileşenler'], use: 'Yüksek kuvvetli malzeme ve bileşen testleri',
      features: ['Hidrolik tahrik', 'Sadece çekme, sadece basma veya birleşik test düzenleri', 'Kobi ve Kompetan donanım seviyeleri', 'Uygulamaya özel yazılım ve fikstürler'],
      guidance: 'Numune geometrisini, beklenen kuvveti ve test standardını paylaşın. Ekibimiz önerilen sistemin nominal kapasitesini ve test alanı ölçülerini teyit edecektir.'
    }
  },
  {
    id: 'multitask', name: 'MultiTask', maxKN: 200, type: 'electromechanical', tiers: [],
    en: {
      label: 'Dual-load-cell testing systems', capacity: 'Up to 200 kN', layout: 'Two test stations',
      intro: 'A servo-driven system with two load cells and two fixture sets. Keep different test setups ready and reduce fixture changes between recurring laboratory tasks.',
      materials: ['Mixed samples', 'Components', 'Metals', 'Polymers'], use: 'Laboratories alternating between different test setups',
      features: ['Two load cells and two sets of fixtures', 'Servo-motor drive', 'Separate tensile and compression setups', 'Frame size and capacity selected for the application'],
      guidance: 'Describe both tests when requesting a system. Each station needs its own suitable load cell and fixture selection. Confirm the operating sequence with our engineers.'
    },
    tr: {
      label: 'Çift yük hücreli test sistemleri', capacity: '200 kN’ye kadar', layout: 'İki test istasyonu',
      intro: 'İki yük hücresi ve iki fikstür takımı içeren servo motorlu sistem. Farklı test düzenlerini hazır tutarak tekrarlanan laboratuvar işleri arasında fikstür değişimini azaltın.',
      materials: ['Farklı numuneler', 'Bileşenler', 'Metaller', 'Polimerler'], use: 'Farklı test düzenleri arasında geçiş yapan laboratuvarlar',
      features: ['İki yük hücresi ve iki fikstür takımı', 'Servo motorlu tahrik', 'Ayrı çekme ve basma düzenleri', 'Uygulamaya göre seçilen gövde ve kapasite'],
      guidance: 'Sistem talebinde her iki testi de açıklayın. Her istasyon için uygun yük hücresi ve fikstür seçilmelidir. Çalışma sırasını mühendislerimizle teyit edin.'
    }
  },
  {
    id: 'custom', name: 'Custom', maxKN: null, type: 'custom', tiers: [],
    en: {
      label: 'Custom material testing systems', capacity: 'Built to your brief', layout: 'Application-specific',
      intro: 'Work with Labomak on a test system for specimens, loading arrangements or measurement tasks that need a dedicated design.',
      materials: ['Panels', 'Pipes', 'Assemblies', 'Special specimens'], use: 'Test requirements beyond a standard frame configuration',
      features: ['Specimen-led frame and fixture design', 'Panel and pipe testing arrangements', 'Long-duration deflection measurement projects', 'Test control developed around your method'],
      guidance: 'Start with the standard or test procedure, drawings or photos of your specimen, expected loads, measurement requirements and available installation space.'
    },
    tr: {
      label: 'Özel malzeme test sistemleri', capacity: 'İhtiyacınıza göre tasarlanır', layout: 'Uygulamaya özel',
      intro: 'Özel tasarım gerektiren numuneler, yükleme düzenleri veya ölçüm görevleri için Labomak ile bir test sistemi geliştirin.',
      materials: ['Paneller', 'Borular', 'Montajlar', 'Özel numuneler'], use: 'Standart gövde konfigürasyonlarının ötesindeki test ihtiyaçları',
      features: ['Numuneye göre gövde ve fikstür tasarımı', 'Panel ve boru test düzenleri', 'Uzun süreli sehim ölçüm projeleri', 'Metodunuza göre geliştirilen test kontrolü'],
      guidance: 'Standart veya test prosedürünü, numune çizimlerini veya fotoğraflarını, beklenen yükleri, ölçüm ihtiyaçlarını ve kurulum alanını paylaşarak başlayın.'
    }
  }
];
