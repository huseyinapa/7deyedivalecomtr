import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCallCourierTable1754232393620 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the existing table if it exists
    await queryRunner.query(`DROP TABLE IF EXISTS "call_courier"`);

    // Create the new call_courier table with updated structure
    await queryRunner.query(`
            CREATE TABLE "call_courier" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "uid" character varying,
                "senderName" character varying NOT NULL,
                "senderPhone" character varying NOT NULL,
                "senderAddress" text NOT NULL,
                "receiverName" character varying NOT NULL,
                "receiverPhone" character varying NOT NULL,
                "receiverAddress" text NOT NULL,
                "packageDescription" text,
                "packageWeight" numeric(10,2) NOT NULL DEFAULT '0',
                "packageValue" numeric(10,2),
                "notes" text,
                "status" character varying NOT NULL DEFAULT 'pending',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_call_courier_id" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "call_courier"`);
  }
}
