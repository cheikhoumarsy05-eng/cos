import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "programs_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "programs_features_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"upload_id" integer,
  	"src" varchar
  );
  
  CREATE TABLE "programs_images_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"name" varchar NOT NULL,
  	"stack" varchar NOT NULL,
  	"url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "programs_locales" (
  	"category" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "programs_id" integer;
  ALTER TABLE "site_locales" ADD COLUMN "section_titles_programs" varchar DEFAULT 'Programmes';
  ALTER TABLE "site_locales" ADD COLUMN "section_titles_programs_lead" varchar DEFAULT 'Les outils de calcul que j''ai écrits moi-même, du modèle dynamique à l''application.';
  ALTER TABLE "programs_features" ADD CONSTRAINT "programs_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_features_locales" ADD CONSTRAINT "programs_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_images" ADD CONSTRAINT "programs_images_upload_id_media_id_fk" FOREIGN KEY ("upload_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_images" ADD CONSTRAINT "programs_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_images_locales" ADD CONSTRAINT "programs_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_locales" ADD CONSTRAINT "programs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "programs_features_order_idx" ON "programs_features" USING btree ("_order");
  CREATE INDEX "programs_features_parent_id_idx" ON "programs_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_features_locales_locale_parent_id_unique" ON "programs_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_images_order_idx" ON "programs_images" USING btree ("_order");
  CREATE INDEX "programs_images_parent_id_idx" ON "programs_images" USING btree ("_parent_id");
  CREATE INDEX "programs_images_upload_idx" ON "programs_images" USING btree ("upload_id");
  CREATE UNIQUE INDEX "programs_images_locales_locale_parent_id_unique" ON "programs_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_updated_at_idx" ON "programs" USING btree ("updated_at");
  CREATE INDEX "programs_created_at_idx" ON "programs" USING btree ("created_at");
  CREATE UNIQUE INDEX "programs_locales_locale_parent_id_unique" ON "programs_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_programs_id_idx" ON "payload_locked_documents_rels" USING btree ("programs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "programs_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs_features_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs_images_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "programs_features" CASCADE;
  DROP TABLE "programs_features_locales" CASCADE;
  DROP TABLE "programs_images" CASCADE;
  DROP TABLE "programs_images_locales" CASCADE;
  DROP TABLE "programs" CASCADE;
  DROP TABLE "programs_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_programs_fk";
  
  DROP INDEX "payload_locked_documents_rels_programs_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "programs_id";
  ALTER TABLE "site_locales" DROP COLUMN "section_titles_programs";
  ALTER TABLE "site_locales" DROP COLUMN "section_titles_programs_lead";`)
}
