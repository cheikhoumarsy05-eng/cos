import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "experience" ADD COLUMN "figure" varchar;
  ALTER TABLE "experience_locales" ADD COLUMN "figure_label" varchar;
  ALTER TABLE "freelance" ADD COLUMN "figure" varchar;
  ALTER TABLE "freelance_locales" ADD COLUMN "figure_label" varchar;
  ALTER TABLE "volunteering" ADD COLUMN "figure" varchar;
  ALTER TABLE "volunteering_locales" ADD COLUMN "figure_label" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "experience" DROP COLUMN "figure";
  ALTER TABLE "experience_locales" DROP COLUMN "figure_label";
  ALTER TABLE "freelance" DROP COLUMN "figure";
  ALTER TABLE "freelance_locales" DROP COLUMN "figure_label";
  ALTER TABLE "volunteering" DROP COLUMN "figure";
  ALTER TABLE "volunteering_locales" DROP COLUMN "figure_label";`)
}
