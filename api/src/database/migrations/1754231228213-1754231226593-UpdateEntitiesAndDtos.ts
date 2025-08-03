import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntitiesAndDtos1754231228213 implements MigrationInterface {
  name = "UpdateEntitiesAndDtos1754231228213";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the old courier_application table if it exists
    await queryRunner.query(`DROP TABLE IF EXISTS "courier_application"`);

    // Create new courier_application table with updated structure
    await queryRunner.query(`
            CREATE TABLE "courier_application" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "uid" character varying,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phone" character varying NOT NULL,
                "city" character varying NOT NULL,
                "district" character varying,
                "address" text,
                "birthDate" character varying,
                "gender" character varying,
                "nationality" character varying,
                "idNumber" character varying,
                "maritalStatus" character varying,
                "militaryStatus" character varying,
                "education" character varying,
                "licenseClass" character varying,
                "vehicleType" character varying,
                "workPeriod" character varying,
                "hasVehicle" boolean NOT NULL DEFAULT false,
                "courierExperience" text,
                "workExperiences" text,
                "references" text,
                "status" character varying NOT NULL DEFAULT 'pending',
                "notes" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_courier_application" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "courier_application"`);
  }
}
