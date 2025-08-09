import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDistrictAndLicenseClassIfMissing1754745600000
  implements MigrationInterface
{
  name = "AddDistrictAndLicenseClassIfMissing1754745600000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure table exists before altering
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = 'courier_application'
        ) THEN
          RAISE NOTICE 'Table courier_application does not exist. Skipping column additions.';
        ELSE
          -- Add columns if they do not exist
          ALTER TABLE "courier_application" 
            ADD COLUMN IF NOT EXISTS "district" character varying,
            ADD COLUMN IF NOT EXISTS "licenseClass" character varying;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop columns only if they exist to be safe
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='courier_application' AND column_name='district'
        ) THEN
          ALTER TABLE "courier_application" DROP COLUMN "district";
        END IF;
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='courier_application' AND column_name='licenseClass'
        ) THEN
          ALTER TABLE "courier_application" DROP COLUMN "licenseClass";
        END IF;
      END $$;
    `);
  }
}
