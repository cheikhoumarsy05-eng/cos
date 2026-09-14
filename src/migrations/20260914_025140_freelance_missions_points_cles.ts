import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "freelance_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "freelance_points_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "freelance_key_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"strong" boolean DEFAULT false
  );
  
  CREATE TABLE "freelance_key_points_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "freelance_points" ADD CONSTRAINT "freelance_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."freelance"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "freelance_points_locales" ADD CONSTRAINT "freelance_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."freelance_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "freelance_key_points" ADD CONSTRAINT "freelance_key_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."freelance"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "freelance_key_points_locales" ADD CONSTRAINT "freelance_key_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."freelance_key_points"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "freelance_points_order_idx" ON "freelance_points" USING btree ("_order");
  CREATE INDEX "freelance_points_parent_id_idx" ON "freelance_points" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "freelance_points_locales_locale_parent_id_unique" ON "freelance_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "freelance_key_points_order_idx" ON "freelance_key_points" USING btree ("_order");
  CREATE INDEX "freelance_key_points_parent_id_idx" ON "freelance_key_points" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "freelance_key_points_locales_locale_parent_id_unique" ON "freelance_key_points_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "freelance_points" CASCADE;
  DROP TABLE "freelance_points_locales" CASCADE;
  DROP TABLE "freelance_key_points" CASCADE;
  DROP TABLE "freelance_key_points_locales" CASCADE;`)
}
