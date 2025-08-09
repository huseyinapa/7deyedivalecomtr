import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedByToUsers1754286597980 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='users' AND column_name='createdBy'
        ) THEN
          ALTER TABLE "users" ADD "createdBy" character varying;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='users' AND column_name='createdBy'
        ) THEN
          ALTER TABLE "users" DROP COLUMN "createdBy";
        END IF;
      END $$;
    `);
  }
}
