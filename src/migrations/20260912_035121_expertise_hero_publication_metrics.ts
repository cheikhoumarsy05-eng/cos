import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "expertise_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"tools" varchar
  );
  
  CREATE TABLE "expertise" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Expertise',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "publication_items_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  ALTER TABLE "projects" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "hero" ADD COLUMN "role" varchar;
  ALTER TABLE "hero" ADD COLUMN "disciplines" varchar;
  ALTER TABLE "publication_items" ADD COLUMN "key_result" varchar;
  ALTER TABLE "site" ADD COLUMN "section_titles_expertise" varchar DEFAULT 'Expertise';
  ALTER TABLE "expertise_items" ADD CONSTRAINT "expertise_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publication_items_metrics" ADD CONSTRAINT "publication_items_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."publication_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "expertise_items_order_idx" ON "expertise_items" USING btree ("_order");
  CREATE INDEX "expertise_items_parent_id_idx" ON "expertise_items" USING btree ("_parent_id");
  CREATE INDEX "publication_items_metrics_order_idx" ON "publication_items_metrics" USING btree ("_order");
  CREATE INDEX "publication_items_metrics_parent_id_idx" ON "publication_items_metrics" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "expertise_items" CASCADE;
  DROP TABLE "expertise" CASCADE;
  DROP TABLE "publication_items_metrics" CASCADE;
  ALTER TABLE "projects" DROP COLUMN "featured";
  ALTER TABLE "hero" DROP COLUMN "role";
  ALTER TABLE "hero" DROP COLUMN "disciplines";
  ALTER TABLE "publication_items" DROP COLUMN "key_result";
  ALTER TABLE "site" DROP COLUMN "section_titles_expertise";`)
}
