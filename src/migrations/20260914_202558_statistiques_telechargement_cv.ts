import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Compte les ouvertures du CV.
 *
 * La table reçoit une ligne par passage sur la route « /cv ». Cette route ne
 * sert à rien tant que les liens publics pointent sur le PDF : le basculement
 * de `cv_url` fait donc partie de la migration, et non d'une visite dans
 * l'admin qu'on oublierait de faire. Le `down` remet le chemin du fichier
 * avant de supprimer la table, pour qu'un retour en arrière laisse un site
 * dont le bouton CV fonctionne encore.
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "cv_downloads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"referer" varchar,
  	"country" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cv_downloads_id" integer;
  CREATE INDEX "cv_downloads_updated_at_idx" ON "cv_downloads" USING btree ("updated_at");
  CREATE INDEX "cv_downloads_created_at_idx" ON "cv_downloads" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cv_downloads_fk" FOREIGN KEY ("cv_downloads_id") REFERENCES "public"."cv_downloads"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_cv_downloads_id_idx" ON "payload_locked_documents_rels" USING btree ("cv_downloads_id");
  UPDATE "site" SET "cv_url" = '/cv' WHERE "cv_url" = '/cv-cheikh-oumar-sy.pdf';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "site" SET "cv_url" = '/cv-cheikh-oumar-sy.pdf' WHERE "cv_url" = '/cv';
  ALTER TABLE "cv_downloads" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cv_downloads" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cv_downloads_fk";
  
  DROP INDEX "payload_locked_documents_rels_cv_downloads_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cv_downloads_id";`)
}
