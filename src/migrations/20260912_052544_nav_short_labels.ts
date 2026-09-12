import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site" ADD COLUMN "section_titles_projects_nav" varchar DEFAULT 'Projets';
  ALTER TABLE "site" ADD COLUMN "section_titles_contact_nav" varchar DEFAULT 'Contact';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site" DROP COLUMN "section_titles_projects_nav";
  ALTER TABLE "site" DROP COLUMN "section_titles_contact_nav";`)
}
