import { Client } from "pg";
import * as dotenv from "dotenv";

// .env dosyasından yapılandırmayı yükle
dotenv.config();

async function createDatabase() {
  const dbName = process.env.DB_DATABASE || "yedi_db";
  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "yedi",
    database: "postgres", // postgres veritabanına bağlanarak diğer veritabanları üzerinde işlem yapabiliriz
  });

  try {
    await client.connect();
    console.log("PostgreSQL sunucusuna bağlandı.");

    // Veritabanının var olup olmadığını kontrol et
    const checkResult = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    // Veritabanı yoksa oluştur
    if (checkResult.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`${dbName} veritabanı başarıyla oluşturuldu.`);
    } else {
      console.log(`${dbName} veritabanı zaten mevcut.`);
    }

    // Veritabanına bağlantıyı kapat
    await client.end();
    console.log("PostgreSQL bağlantısı kapatıldı.");
  } catch (error) {
    console.error("Veritabanı oluşturma sırasında hata:", error);
    process.exit(1);
  }
}

createDatabase();
