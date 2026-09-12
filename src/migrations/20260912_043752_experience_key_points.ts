import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "experience_key_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"strong" boolean DEFAULT false
  );
  
  ALTER TABLE "experience" ADD COLUMN "city" varchar;
  ALTER TABLE "experience" ADD COLUMN "summary" varchar;
  ALTER TABLE "experience_key_points" ADD CONSTRAINT "experience_key_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experience"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "experience_key_points_order_idx" ON "experience_key_points" USING btree ("_order");
  CREATE INDEX "experience_key_points_parent_id_idx" ON "experience_key_points" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "experience_key_points" CASCADE;
  ALTER TABLE "experience" DROP COLUMN "city";
  ALTER TABLE "experience" DROP COLUMN "summary";`)
}
