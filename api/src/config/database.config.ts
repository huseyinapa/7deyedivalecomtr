import { registerAs } from "@nestjs/config";
import { DataSourceOptions } from "typeorm";
import { resolve } from "path";

export default registerAs("database", (): DataSourceOptions => {
  return {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "yedi",
    database: process.env.DB_DATABASE || "yedi_db",
    schema: "public",
    entities: [resolve(__dirname, "../../**/*.entity{.ts,.js}")],
    migrations: [resolve(__dirname, "../../database/migrations/**/*{.ts,.js}")],
    synchronize: process.env.DB_SYNCHRONIZE === "true",
    logging: process.env.NODE_ENV === "development",
  };
});
