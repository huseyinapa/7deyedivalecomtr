import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToUsers1691234567890 implements MigrationInterface {
  name = "AddRoleToUsers1691234567890";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if column exists before adding
    const hasColumn = await queryRunner.hasColumn("users", "role");
    if (!hasColumn) {
      await queryRunner.query(
        `ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT 'user'`
      );
    }

    // Update existing users to have 'user' role if they don't have one
    await queryRunner.query(
      `UPDATE "users" SET "role" = 'user' WHERE "role" IS NULL OR "role" = ''`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn("users", "role");
    if (hasColumn) {
      await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    }
  }
}
