import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "publication_items_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "publication_items_side_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"k" varchar NOT NULL,
  	"v" varchar NOT NULL,
  	"accent" boolean DEFAULT false
  );
  
  CREATE TABLE "publication_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"sub" varchar NOT NULL,
  	"doi" varchar NOT NULL,
  	"doi_url" varchar NOT NULL
  );
  
  CREATE TABLE "stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'En chiffres' NOT NULL,
  	"lead" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DROP TABLE "publication_points" CASCADE;
  DROP TABLE "publication_side_facts" CASCADE;
  ALTER TABLE "about" ADD COLUMN "stat_years_text" varchar DEFAULT 'terrain & bureau d''études.' NOT NULL;
  ALTER TABLE "about" ADD COLUMN "stat_projects_text" varchar DEFAULT 'de conception, contrôle & recherche.' NOT NULL;
  ALTER TABLE "about" ADD COLUMN "stat_publication_text" varchar DEFAULT 'scientifique' NOT NULL;
  ALTER TABLE "skills" ADD COLUMN "technical_label" varchar DEFAULT 'Techniques' NOT NULL;
  ALTER TABLE "skills" ADD COLUMN "tools_label" varchar DEFAULT 'Outils & logiciels' NOT NULL;
  ALTER TABLE "skills" ADD COLUMN "tools_note" varchar DEFAULT 'En gras : maîtrise quotidienne' NOT NULL;
  ALTER TABLE "skills" ADD COLUMN "personal_label" varchar DEFAULT 'Personnelles' NOT NULL;
  ALTER TABLE "publication_items_points" ADD CONSTRAINT "publication_items_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."publication_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publication_items_side_facts" ADD CONSTRAINT "publication_items_side_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."publication_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publication_items" ADD CONSTRAINT "publication_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stats_items" ADD CONSTRAINT "stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stats"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "publication_items_points_order_idx" ON "publication_items_points" USING btree ("_order");
  CREATE INDEX "publication_items_points_parent_id_idx" ON "publication_items_points" USING btree ("_parent_id");
  CREATE INDEX "publication_items_side_facts_order_idx" ON "publication_items_side_facts" USING btree ("_order");
  CREATE INDEX "publication_items_side_facts_parent_id_idx" ON "publication_items_side_facts" USING btree ("_parent_id");
  CREATE INDEX "publication_items_order_idx" ON "publication_items" USING btree ("_order");
  CREATE INDEX "publication_items_parent_id_idx" ON "publication_items" USING btree ("_parent_id");
  CREATE INDEX "stats_items_order_idx" ON "stats_items" USING btree ("_order");
  CREATE INDEX "stats_items_parent_id_idx" ON "stats_items" USING btree ("_parent_id");
  ALTER TABLE "publication" DROP COLUMN "title";
  ALTER TABLE "publication" DROP COLUMN "sub";
  ALTER TABLE "publication" DROP COLUMN "doi";
  ALTER TABLE "publication" DROP COLUMN "doi_url";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "publication_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "publication_side_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"k" varchar NOT NULL,
  	"v" varchar NOT NULL,
  	"accent" boolean DEFAULT false
  );
  
  DROP TABLE "publication_items_points" CASCADE;
  DROP TABLE "publication_items_side_facts" CASCADE;
  DROP TABLE "publication_items" CASCADE;
  DROP TABLE "stats_items" CASCADE;
  DROP TABLE "stats" CASCADE;
  ALTER TABLE "publication" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "publication" ADD COLUMN "sub" varchar NOT NULL;
  ALTER TABLE "publication" ADD COLUMN "doi" varchar NOT NULL;
  ALTER TABLE "publication" ADD COLUMN "doi_url" varchar NOT NULL;
  ALTER TABLE "publication_points" ADD CONSTRAINT "publication_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publication_side_facts" ADD CONSTRAINT "publication_side_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "publication_points_order_idx" ON "publication_points" USING btree ("_order");
  CREATE INDEX "publication_points_parent_id_idx" ON "publication_points" USING btree ("_parent_id");
  CREATE INDEX "publication_side_facts_order_idx" ON "publication_side_facts" USING btree ("_order");
  CREATE INDEX "publication_side_facts_parent_id_idx" ON "publication_side_facts" USING btree ("_parent_id");
  ALTER TABLE "about" DROP COLUMN "stat_years_text";
  ALTER TABLE "about" DROP COLUMN "stat_projects_text";
  ALTER TABLE "about" DROP COLUMN "stat_publication_text";
  ALTER TABLE "skills" DROP COLUMN "technical_label";
  ALTER TABLE "skills" DROP COLUMN "tools_label";
  ALTER TABLE "skills" DROP COLUMN "tools_note";
  ALTER TABLE "skills" DROP COLUMN "personal_label";`)
}
