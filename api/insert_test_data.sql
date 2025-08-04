-- Insert test courier applications
INSERT INTO courier_application (
  "firstName", "lastName", "email", "phone", "city", "district", 
  "address", "birthDate", "gender", "nationality", "idNumber", 
  "education", "licenseClass", "vehicleType", "workPeriod", 
  "hasVehicle", "courierExperience", "workExperiences", "status", "notes"
) VALUES 
(
  'Ahmet', 'Yılmaz', 'ahmet.yilmaz@example.com', '+90 532 123 4567', 
  'İstanbul', 'Kadıköy', 'Kadıköy Mah. Bağdat Cad. No:123', '1990-05-15', 
  'Erkek', 'Türk', '12345678901', 'Lise', 'B', 'Motosiklet', 'Tam Zamanlı', 
  true, '3 yıl kurye deneyimi', '2020-2023: ABC Kargo - Kurye', 'pending', 
  'Güvenilir ve zamanında teslimat yapan deneyimli kurye'
),
(
  'Mehmet', 'Özkan', 'mehmet.ozkan@example.com', '+90 532 987 6543', 
  'Ankara', 'Çankaya', 'Çankaya Mah. Kızılırmak Cad. No:456', '1988-08-22', 
  'Erkek', 'Türk', '98765432109', 'Üniversite', 'B', 'Bisiklet', 'Yarı Zamanlı', 
  true, '2 yıl bisiklet kuryesi', '2022-2024: XYZ Delivery - Bisiklet Kuryesi', 'approved', 
  'Çevre dostu ulaşım tercihi'
),
(
  'Ayşe', 'Kaya', 'ayse.kaya@example.com', '+90 532 456 7890', 
  'İzmir', 'Karşıyaka', 'Karşıyaka Mah. Atatürk Cad. No:789', '1992-03-10', 
  'Kadın', 'Türk', '11223344556', 'Lise', 'B', 'Scooter', 'Tam Zamanlı', 
  true, '1 yıl yeni başlayan', 'İlk iş deneyimi', 'pending', 
  'Yeni mezun, öğrenmeye açık'
),
(
  'Fatma', 'Demir', 'fatma.demir@example.com', '+90 532 321 6549', 
  'Bursa', 'Osmangazi', 'Osmangazi Mah. İnönü Cad. No:321', '1985-12-05', 
  'Kadın', 'Türk', '66778899001', 'Meslek Lisesi', 'A2', 'Motosiklet', 'Yarı Zamanlı', 
  true, '5 yıl deneyimli kurye', '2018-2023: DEF Kargo - Kıdemli Kurye', 'rejected', 
  'Referanslar yetersiz'
),
(
  'Ali', 'Şahin', 'ali.sahin@example.com', '+90 532 654 9870', 
  'Antalya', 'Muratpaşa', 'Muratpaşa Mah. Lara Cad. No:654', '1991-07-18', 
  'Erkek', 'Türk', '33445566778', 'Üniversite', 'B', 'Araba', 'Tam Zamanlı', 
  true, '4 yıl araç ile teslimat', '2019-2023: GHI Lojistik - Şoför Kurye', 'approved', 
  'Büyük paketler için ideal'
);
