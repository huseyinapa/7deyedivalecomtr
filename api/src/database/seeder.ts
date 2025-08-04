import { DataSource } from "typeorm";
import { config } from "dotenv";
import { UserSeeder } from "./seeds/user.seeder";
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

// Create a new data source
const dataSource = new DataSource({
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

// Initialize data source and run seeders
const initialize = async (): Promise<void> => {
  try {
    await dataSource.initialize();
    console.log("Data Source has been initialized!");

    // Run seeders
    await runSeeders(dataSource);

    // Close the connection
    await dataSource.destroy();
    console.log("Connection closed");
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
  }
};

// Run seeders
const runSeeders = async (dataSource: DataSource): Promise<void> => {
  console.log("Starting to run seeders...");

  try {
    const userSeeder = new UserSeeder();
    await dataSource.transaction(async (entityManager) => {
      await userSeeder.run(entityManager);
    });

    console.log("Seeders executed successfully");
  } catch (error) {
    console.error("Error running seeders:", error);
  }
};

// Run the seeder
initialize();
