import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "yedi",
  database: process.env.DB_DATABASE || "yedi_db",
  schema: "public",
  entities: ["src/**/*.entity{.ts,.js}"],
  migrations: ["src/database/migrations/**/*{.ts,.js}"],
  synchronize: false, // Migration için synchronize false olmalı
  logging: true,
  migrationsTableName: "migrations",
});
