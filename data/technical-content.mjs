// Every table row carries a verbatim source fragment for migration checks.
const row=(en,tr,value,evidence,trValue=value)=>({label:{en,tr},value:{en:value,tr:trValue},evidence});
export const specifications={
  5326:[
    row('Load cell','Yük hücresi','500 N','500 N’luk bir yük hücresi'),
    row('Specimen width','Numune genişliği','15 mm','Numune genişliği: 15 mm'),
    row('Test span options','Test açıklığı seçenekleri','0.7 mm / 0.3 mm','0,7 mm veya 0,3 mm','0,7 mm / 0,3 mm'),
    row('Test speed','Test hızı','3 mm/min','Test hızı: 3 mm/dak','3 mm/dak'),
    row('Display','Ekran','7-inch colour touchscreen','7 inç renkli dokunmatik ekran','7 inç renkli dokunmatik ekran')],
  228:[
    row('Weight loading','Ağırlık yükleme','Manual','El ile yükleme','Manuel'),
    row('Sample cutting','Numune kesme','Automatic, with programmable intervals','Otomatik kesme bıçağı','Otomatik, programlanabilir aralıklarla'),
    row('Internal data logger','Dahili veri kaydı','10 results without a computer','Bilgisayarsız kullanım halinde 10 adet datayı hafızaya alır','Bilgisayarsız kullanımda 10 sonuç'),
    row('Included weights','Birlikte verilen ağırlıklar','0.325 kg / 2.16 kg / 5 kg','1 Adet 0.325 kg, 1 Adet 2.16 kg, 1 Adet 5 kg','0,325 kg / 2,16 kg / 5 kg'),
    row('Die material','Kalıp malzemesi','Tungsten carbide','Tungsten karbür kalıp','Tungsten karbür'),
    row('Data transfer','Veri aktarımı','USB','Usb data aktarımı')],
  160:[
    row('Drive','Tahrik','AC servo motor','A.C. Servo motor kontrollü sistem','AC servo motor'),
    row('Speed range','Hız aralığı','0.1–500 mm/min','0.1–500 mm/dak. Hız aralığı','0,1–500 mm/dak'),
    row('Equipment levels','Donanım seviyeleri','Kobi / Kompetan','Kobi ve Kompetan serisi olarak iki seviyede'),
    row('Compression platforms','Basma platformları','Multiple sizes; custom configurations','muhtelif kapasite ve ebatlarda','Farklı ölçüler; özel konfigürasyonlar')],
  4859:[
    row('Specimen thickness','Numune kalınlığı','Less than 2 mm','Kalınlığı 2 mm’den az','2 mm altında'),
    row('Adjustable test angle','Ayarlanabilir test açısı','1–90°','(1 ~ 90) °'),
    row('Adjustable test duration','Ayarlanabilir test süresi','3–30 seconds','(3 saniye ~ 30 saniye)','3–30 saniye'),
    row('Return movement','Geri dönüş','Automatic return to the starting position','Otomatik başlangıç pozisyonu','Başlangıç konumuna otomatik dönüş')],
  2097:[
    row('Test principle','Test prensibi','Mullen-type hydraulic diaphragm','Mullen tip','Mullen tipi hidrolik diyafram'),
    row('Paper pump rate','Kağıt pompa hızı','95 ±5 ml/min','Kağıt = 95 +/- 5 ml / dak','95 ±5 ml/dak'),
    row('Board pump rate','Karton pompa hızı','170 ±15 ml/min','Karton Ve Oluklu Mukavva = 170 +/- 15 ml / dak','170 ±15 ml/dak'),
    row('Clamping','Sıkıştırma','Pneumatic','Pnömatik kelepçe kapatma sistemi','Pnömatik'),
    row('Hydraulic medium','Hidrolik ortam','Glycerine','Hidrolik gliserin basınç devresi','Gliserin')],
  1185:[
    row('Chamber volume options','Kabin hacmi seçenekleri','48 / 55 / 64 / 125 / 250 / 500 / 720 L','48-55-64-125-250-500-720 Lt.'),
    row('Temperature setting','Sıcaklık ayarı','Ambient to 250 °C','Ortam sıcaklığı ile 250 °C arası ısı ayarı','Ortam sıcaklığından 250 °C’ye'),
    row('Inner chamber','İç kabin','AISI 304 stainless steel','AISI 304 paslanmaz iç kabin','AISI 304 paslanmaz çelik'),
    row('Timer','Zamanlayıcı','1 second–9,999 hours','1sn.-9999 saat arası','1 saniye–9.999 saat')],
  4770:[
    row('Preload','Ön yük','3 N','Ön yükleme ağırlığı 3 N'),
    row('Total load','Toplam yük','500 N','Toplam yükleme ağırlığı 500 N'),
    row('Comparator travel','Komparatör stroku','25 mm','25 mm. stroklu komparatör'),
    row('Display','Ekran','4.3-inch touchscreen','4.3″ dokunmatik ekran','4,3 inç dokunmatik ekran')],
  4760:[
    row('Working pressure','Çalışma basıncı','700 bar','700 bar çalışma basıncı'),
    row('Hose length','Hortum uzunluğu','2 m','2m. hortum uzunluğu'),
    row('Dimensions H × W × D','Ölçüler Y × G × D','50 × 25 × 25 cm','Yükseklik : 50 cm.'),
    row('Weight','Ağırlık','15 kg','Ağırlık :15 kg.')],
  4753:[
    row('Interchangeable weights','Değiştirilebilir ağırlıklar','0.5 / 1 / 2 / 6.8 kg','0.5,1,2 ve 6.8 kg.','0,5 / 1 / 2 / 6,8 kg'),
    row('Drop heights','Düşme yükseklikleri','100 / 300 mm','Ayarlanabilir 100 ve 300 mm.'),
    row('Striker','Vurucu','Ø20 mm steel','Ø20 çelik vurma ağızı','Ø20 mm çelik')],
  4740:[
    row('Maximum compression load','Maksimum basma yükü','50 kN','Max. basma kapasitesi: 50 kN.'),
    row('Plate loading speed','Plaka yükleme hızı','50.8 mm/min','Plaka yükleme oranı 50.8 mm /dakikadır','50,8 mm/dak'),
    row('Speed range','Hız aralığı','0.1–500 mm/min','0.1–500 mm/dak. Hız aralığı','0,1–500 mm/dak'),
    row('Marshall mould','Marshall kalıbı','4 inches','Marshall Stabilite Kalıbı 4”','4 inç'),
    row('Display','Ekran','7-inch touchscreen','7″ dokunmatik ekran','7 inç dokunmatik ekran')],
  4650:[
    row('Water temperature setting','Su sıcaklığı ayarı','0–50 °C','0-50 °C su ısı ayarı'),
    row('Temperature resolution','Sıcaklık çözünürlüğü','0.1 °C','0.1 °C ısı çözünürlüğü','0,1 °C'),
    row('Test speed','Test hızı','50 mm/min','50 mm./dk. deney hızı','50 mm/dak'),
    row('Load cells','Yük hücreleri','3 × 300 N','300 N. kapasiteli 3 adet loadcell'),
    row('Maximum stroke','Maksimum strok','1,500 mm','Max.strok: 1500 mm.','1.500 mm')],
  4626:[
    row('Compression plate diameter','Basma plakası çapı','300 mm','Basma Plakaları Çapı: 300 mm'),
    row('Maximum plate opening','Maksimum plaka açıklığı','310 mm','Max iki plaka arası açıklık : 310 mm'),
    row('Maximum piston travel','Maksimum piston hareketi','50 mm','Max Piston Hateketi : 50 mm'),
    row('Compression plate hardness','Basma plakası sertliği','60 HRC','Plakaların Sertlik Derecesi : 60 HRC')],
  4789:[
    row('Standard cooling capacity','Standart soğutma kapasitesi','−20 ±0.5 °C','Max. soğutma kapasitesi -20 ±0.5 °C','−20 ±0,5 °C'),
    row('Optional cooling capacity','Opsiyonel soğutma kapasitesi','−40 °C','-40°C soğutma kapasitesi'),
    row('Test speed','Deney hızı','360 ±1 mm/min','360±1 mm./dk. deney hızı','360 ±1 mm/dak'),
    row('Bath material','Kazan malzemesi','AISI 304 stainless steel','AISI 304 paslanmaz kazan','AISI 304 paslanmaz çelik')],
  4775:[
    row('Maximum force','Maksimum kuvvet','50 kN','Max. kuvvet kapasitesi: 50kN.'),
    row('Drive','Tahrik','AC servo motor','A.C. servo motor tahrikli','AC servo motor'),
    row('Linear scale','Doğrusal cetvel','100 mm','100 mm. linner cetvel'),
    row('Display','Ekran','7-inch touchscreen','7″ dokunmatik ekran','7 inç dokunmatik ekran')],
  4619:[
    row('Horizontal clamping load','Yatay sıkma yükü','100 kN','Yatay sıkma yükü 100 kN.'),
    row('Vertical compression load','Dikey basma yükü','100 kN','Dikey basma yükü 100 kN.'),
    row('Specimen-thickness fixture options','Numune kalınlığı için aparat seçenekleri','100 / 200 mm','100 mm. ve 200 mm. numune kalınlıklarına'),
    row('Horizontal load holding','Yatay yük tutma','Within ±2% of the selected load','± %2 sınırı içinde','Seçilen yükün ±%2 sınırı içinde')],
  668:[
    row('Force capacity','Kuvvet kapasitesi','±5 kN','± 5 kN'),
    row('Frequency','Frekans','5 Hz','5 Hz'),
    row('Stroke','Strok','±10 mm','± 10 mm'),
    row('Test workflow','Test iş akışı','Computer control, analysis, reports and archives','Tam bilgisayar kontrollü, analiz, raporlama, arşivleme','Bilgisayar kontrolü, analiz, raporlar ve arşivler')]
};

export const variantComparisons={
  228:{columns:['LABOFLOW Kobi','LABOFLOW Kompetan'],rows:[
    {label:['MVR workflow','MVR iş akışı'],values:[['Calculated from entered density; density measurement is required.','Girilen yoğunluktan hesaplanır; yoğunluk ölçümü gerekir.'],['Automatic volumetric measurement module.','Otomatik hacimsel ölçüm modülü.']]},
    {label:['Control & software','Kontrol ve yazılım'],values:[['Falcon Eko panel','Falcon Eko panel'],['Falcon Pro software','Falcon Pro yazılımı']]},
    {label:['Data workflow','Veri iş akışı'],values:[['USB transfer for spreadsheet records.','Tablo kayıtları için USB aktarımı.'],['Test reports, archived results and user permissions.','Test raporları, arşivlenen sonuçlar ve kullanıcı yetkileri.']]}
  ]},
  160:{columns:['BoxMax Kobi','BoxMax Kompetan'],rows:[
    {label:['Control station','Kontrol istasyonu'],values:[['Connect your computer; touchscreen panel optional.','Kendi bilgisayarınızı bağlayın; dokunmatik panel opsiyoneldir.'],['Integrated industrial touchscreen computer.','Tümleşik endüstriyel dokunmatik bilgisayar.']]},
    {label:['Test workflow','Test iş akışı'],values:[['Compression tests with live graphical and numerical results.','Canlı grafik ve sayısal sonuçlarla basma testleri.'],['Loading cycles, load holds and deformation reporting.','Yükleme çevrimleri, yükte bekleme ve deformasyon raporlama.']]}
  ]},
  2063:{columns:['EVO','EVO5'],rows:[
    {label:['Orifice selection','Orifis seçimi'],values:[['Manual changes','Manuel değişim'],['Automatic changes','Otomatik değişim']]},
    {label:['Software','Yazılım'],values:[['Falcon Pro optional','Falcon Pro opsiyonel'],['Falcon Pro with Windows touchscreen computer','Windows dokunmatik bilgisayarla Falcon Pro']]},
    {label:['Results','Sonuçlar'],values:[['10-test logger and USB transfer','10 testlik kayıt ve USB aktarımı'],['Numerical, graphical and statistical reports with archives','Arşivli sayısal, grafik ve istatistik raporlar']]}
  ]}
};
