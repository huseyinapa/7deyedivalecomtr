#!/usr/bin/env node
import { exec } from "child_process";
import { promisify } from "util";
import * as readline from "readline";

const execAsync = promisify(exec);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Prompts the user for input
 */
function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Creates a new migration
 */
async function createMigration(): Promise<void> {
  try {
    const migrationName = await prompt(
      "Enter migration name (e.g., CreateNewTable): "
    );
    if (!migrationName) {
      console.error("Migration name is required");
      rl.close();
      return;
    }

    console.log(`Creating migration: ${migrationName}...`);
    const timestamp = Date.now();
    const migrationFileName = `${timestamp}-${migrationName}`;

    const command = `npx typeorm migration:create src/database/migrations/${migrationFileName}`;
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error(`Error creating migration: ${stderr}`);
    } else {
      console.log(stdout);
      console.log(`Migration ${migrationFileName} created successfully!`);
    }
  } catch (error) {
    console.error("Failed to create migration:", error);
  } finally {
    rl.close();
  }
}

/**
 * Runs migrations
 */
async function runMigrations(): Promise<void> {
  try {
    console.log("Running migrations...");
    const command =
      "npx typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts";
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error(`Error running migrations: ${stderr}`);
    } else {
      console.log(stdout);
      console.log("Migrations executed successfully!");
    }
  } catch (error) {
    console.error("Failed to run migrations:", error);
  } finally {
    rl.close();
  }
}

/**
 * Reverts the last migration
 */
async function revertMigration(): Promise<void> {
  try {
    console.log("Reverting last migration...");
    const command =
      "npx typeorm-ts-node-commonjs migration:revert -d src/database/data-source.ts";
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error(`Error reverting migration: ${stderr}`);
    } else {
      console.log(stdout);
      console.log("Last migration reverted successfully!");
    }
  } catch (error) {
    console.error("Failed to revert migration:", error);
  } finally {
    rl.close();
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log("Migration Helper");
  console.log("----------------");
  console.log("1. Create a new migration");
  console.log("2. Run migrations");
  console.log("3. Revert last migration");

  const option = await prompt("\nSelect an option (1-3): ");

  switch (option) {
    case "1":
      await createMigration();
      break;
    case "2":
      await runMigrations();
      break;
    case "3":
      await revertMigration();
      break;
    default:
      console.log("Invalid option selected");
      rl.close();
  }
}

// Run the main function
main().catch((error) => {
  console.error("An unexpected error occurred:", error);
  rl.close();
  process.exit(1);
});
