import { DataSource } from "typeorm";
import { config } from "dotenv";
import { resolve } from "path";

// Initialize environment variables
config();

// Get database config from environment
const {
  DB_HOST = "localhost",
  DB_PORT = 5432,
  DB_USERNAME = "postgres",
  DB_PASSWORD = "yedi",
  DB_DATABASE = "yedi_db",
} = process.env;

// Create and export the data source
export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: [resolve(__dirname, "../**/*.entity{.ts,.js}")],
  migrations: [resolve(__dirname, "migrations/**/*{.ts,.js}")],
  synchronize: false,
});
