import { DataSource } from "typeorm";
import { CourierApplication } from "../../modules/courier-application/entities/courier-application.entity";

export class CourierApplicationSeeder {
  static async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(CourierApplication);

    // Check if we already have data
    const existingCount = await repository.count();
    if (existingCount > 0) {
      console.log("✅ Courier applications already exist, skipping seed");
      return;
    }

    const applications = [
      {
        firstName: "Ahmet",
        lastName: "Yılmaz",
        email: "ahmet.yilmaz@example.com",
        phone: "+90 532 123 4567",
        city: "İstanbul",
        district: "Kadıköy",
        address: "Kadıköy Mah. Bağdat Cad. No:123",
        birthDate: "1990-05-15",
        gender: "Erkek",
        nationality: "Türk",
        idNumber: "12345678901",
        education: "Lise",
        licenseClass: "B",
        vehicleType: "Motosiklet",
        workPeriod: "Tam Zamanlı",
        hasVehicle: true,
        courierExperience: "3 yıl kurye deneyimi",
        workExperiences: "2020-2023: ABC Kargo - Kurye",
        status: "pending",
        notes: "Güvenilir ve zamanında teslimat yapan deneyimli kurye",
      },
      {
        firstName: "Mehmet",
        lastName: "Özkan",
        email: "mehmet.ozkan@example.com",
        phone: "+90 532 987 6543",
        city: "Ankara",
        district: "Çankaya",
        address: "Çankaya Mah. Kızılırmak Cad. No:456",
        birthDate: "1988-08-22",
        gender: "Erkek",
        nationality: "Türk",
        idNumber: "98765432109",
        education: "Üniversite",
        licenseClass: "B",
        vehicleType: "Bisiklet",
        workPeriod: "Yarı Zamanlı",
        hasVehicle: true,
        courierExperience: "2 yıl bisiklet kuryesi",
        workExperiences: "2022-2024: XYZ Delivery - Bisiklet Kuryesi",
        status: "approved",
        notes: "Çevre dostu ulaşım tercihi",
      },
      {
        firstName: "Ayşe",
        lastName: "Kaya",
        email: "ayse.kaya@example.com",
        phone: "+90 532 456 7890",
        city: "İzmir",
        district: "Karşıyaka",
        address: "Karşıyaka Mah. Atatürk Cad. No:789",
        birthDate: "1992-03-10",
        gender: "Kadın",
        nationality: "Türk",
        idNumber: "11223344556",
        education: "Lise",
        licenseClass: "B",
        vehicleType: "Scooter",
        workPeriod: "Tam Zamanlı",
        hasVehicle: true,
        courierExperience: "1 yıl yeni başlayan",
        workExperiences: "İlk iş deneyimi",
        status: "pending",
        notes: "Yeni mezun, öğrenmeye açık",
      },
      {
        firstName: "Fatma",
        lastName: "Demir",
        email: "fatma.demir@example.com",
        phone: "+90 532 321 6549",
        city: "Bursa",
        district: "Osmangazi",
        address: "Osmangazi Mah. İnönü Cad. No:321",
        birthDate: "1985-12-05",
        gender: "Kadın",
        nationality: "Türk",
        idNumber: "66778899001",
        education: "Meslek Lisesi",
        licenseClass: "A2",
        vehicleType: "Motosiklet",
        workPeriod: "Yarı Zamanlı",
        hasVehicle: true,
        courierExperience: "5 yıl deneyimli kurye",
        workExperiences: "2018-2023: DEF Kargo - Kıdemli Kurye",
        status: "rejected",
        notes: "Referanslar yetersiz",
      },
      {
        firstName: "Ali",
        lastName: "Şahin",
        email: "ali.sahin@example.com",
        phone: "+90 532 654 9870",
        city: "Antalya",
        district: "Muratpaşa",
        address: "Muratpaşa Mah. Lara Cad. No:654",
        birthDate: "1991-07-18",
        gender: "Erkek",
        nationality: "Türk",
        idNumber: "33445566778",
        education: "Üniversite",
        licenseClass: "B",
        vehicleType: "Araba",
        workPeriod: "Tam Zamanlı",
        hasVehicle: true,
        courierExperience: "4 yıl araç ile teslimat",
        workExperiences: "2019-2023: GHI Lojistik - Şoför Kurye",
        status: "approved",
        notes: "Büyük paketler için ideal",
      },
      {
        firstName: "Zeynep",
        lastName: "Çelik",
        email: "zeynep.celik@example.com",
        phone: "+90 532 147 2580",
        city: "Adana",
        district: "Seyhan",
        address: "Seyhan Mah. Çukurova Cad. No:147",
        birthDate: "1993-11-25",
        gender: "Kadın",
        nationality: "Türk",
        idNumber: "99887766554",
        education: "Lise",
        licenseClass: "B",
        vehicleType: "Bisiklet",
        workPeriod: "Hafta Sonu",
        hasVehicle: true,
        courierExperience: "Yeni başlayan",
        workExperiences: "Öğrenci, part-time çalışmak istiyor",
        status: "pending",
        notes: "Öğrenci, sadece hafta sonları müsait",
      },
    ];

    try {
      const createdApplications = repository.create(applications);
      await repository.save(createdApplications);
      console.log(`✅ Created ${applications.length} courier applications`);
    } catch (error) {
      console.error("❌ Error creating courier applications:", error);
    }
  }
}
