import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "article_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"views" numeric DEFAULT 0 NOT NULL,
  	"likes" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "article_stats_id" integer;
  CREATE UNIQUE INDEX "article_stats_slug_idx" ON "article_stats" USING btree ("slug");
  CREATE INDEX "article_stats_updated_at_idx" ON "article_stats" USING btree ("updated_at");
  CREATE INDEX "article_stats_created_at_idx" ON "article_stats" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_article_stats_fk" FOREIGN KEY ("article_stats_id") REFERENCES "public"."article_stats"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_article_stats_id_idx" ON "payload_locked_documents_rels" USING btree ("article_stats_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "article_stats" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "article_stats" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_article_stats_fk";
  
  DROP INDEX "payload_locked_documents_rels_article_stats_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "article_stats_id";`)
}
