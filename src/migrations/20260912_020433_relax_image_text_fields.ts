import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero" ALTER COLUMN "image_alt" DROP NOT NULL;
  ALTER TABLE "hero" ALTER COLUMN "image_caption" DROP NOT NULL;
  ALTER TABLE "hero" ALTER COLUMN "image_year" DROP NOT NULL;
  ALTER TABLE "about" ALTER COLUMN "portrait_alt" DROP NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero" ALTER COLUMN "image_alt" SET NOT NULL;
  ALTER TABLE "hero" ALTER COLUMN "image_caption" SET NOT NULL;
  ALTER TABLE "hero" ALTER COLUMN "image_year" SET NOT NULL;
  ALTER TABLE "about" ALTER COLUMN "portrait_alt" SET NOT NULL;`)
}
