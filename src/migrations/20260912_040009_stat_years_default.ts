import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about" ALTER COLUMN "stat_years" SET DEFAULT '4 expériences';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about" ALTER COLUMN "stat_years" SET DEFAULT '3+ ans';`)
}
