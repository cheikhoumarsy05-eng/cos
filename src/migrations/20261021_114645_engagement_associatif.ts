import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "volunteering_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "volunteering_points_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "volunteering" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"org" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "volunteering_locales" (
  	"when" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"city" varchar,
  	"summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "volunteering_id" integer;
  ALTER TABLE "volunteering_points" ADD CONSTRAINT "volunteering_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."volunteering"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "volunteering_points_locales" ADD CONSTRAINT "volunteering_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."volunteering_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "volunteering_locales" ADD CONSTRAINT "volunteering_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."volunteering"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "volunteering_points_order_idx" ON "volunteering_points" USING btree ("_order");
  CREATE INDEX "volunteering_points_parent_id_idx" ON "volunteering_points" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "volunteering_points_locales_locale_parent_id_unique" ON "volunteering_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "volunteering_updated_at_idx" ON "volunteering" USING btree ("updated_at");
  CREATE INDEX "volunteering_created_at_idx" ON "volunteering" USING btree ("created_at");
  CREATE UNIQUE INDEX "volunteering_locales_locale_parent_id_unique" ON "volunteering_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_volunteering_fk" FOREIGN KEY ("volunteering_id") REFERENCES "public"."volunteering"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_volunteering_id_idx" ON "payload_locked_documents_rels" USING btree ("volunteering_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "volunteering_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "volunteering_points_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "volunteering" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "volunteering_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "volunteering_points" CASCADE;
  DROP TABLE "volunteering_points_locales" CASCADE;
  DROP TABLE "volunteering" CASCADE;
  DROP TABLE "volunteering_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_volunteering_fk";
  
  DROP INDEX "payload_locked_documents_rels_volunteering_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "volunteering_id";`)
}
