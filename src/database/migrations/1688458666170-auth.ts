import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auth1688458666170 implements MigrationInterface {
  name = 'Auth1688458666170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "profileId" uuid`);
    await queryRunner.query(`ALTER TABLE "user" ADD "identityCardId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_906baf3b36bacb5fafb466468c5" FOREIGN KEY ("identityCardId") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_906baf3b36bacb5fafb466468c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "identityCardId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileId"`);
  }
}
