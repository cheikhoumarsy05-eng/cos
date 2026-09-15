import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Brouillons sur les articles.
 *
 * La colonne de statut arrive avec « draft » pour valeur par défaut : les
 * articles déjà en ligne basculeraient donc en brouillon, et disparaîtraient
 * du site dès que les lectures publiques filtrent sur « published ». On les
 * repasse explicitement en publié, dernière instruction de la migration.
 *
 * Les colonnes obligatoires deviennent facultatives : c'est voulu et c'est
 * Payload qui le demande — un brouillon doit pouvoir être enregistré avec
 * seulement un titre, avant que le reste soit écrit.
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_published_locale" AS ENUM('fr', 'en');
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_author" varchar DEFAULT 'Cheikh Oumar Sy',
  	"version_cover_id" integer,
  	"version_cover_src" varchar,
  	"version_linkedin_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__articles_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_articles_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_cover_alt" varchar,
  	"version_category" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "articles" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "date" DROP NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "author" DROP NOT NULL;
  ALTER TABLE "articles_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "articles_locales" ALTER COLUMN "category" DROP NOT NULL;
  ALTER TABLE "articles_locales" ALTER COLUMN "excerpt" DROP NOT NULL;
  ALTER TABLE "articles_locales" ALTER COLUMN "content" DROP NOT NULL;
  ALTER TABLE "articles" ADD COLUMN "_status" "enum_articles_status" DEFAULT 'draft';
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_cover_idx" ON "_articles_v" USING btree ("version_cover_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_snapshot_idx" ON "_articles_v" USING btree ("snapshot");
  CREATE INDEX "_articles_v_published_locale_idx" ON "_articles_v" USING btree ("published_locale");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_articles_v_locales_locale_parent_id_unique" ON "_articles_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  UPDATE "articles" SET "_status" = 'published';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_articles_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_locales" CASCADE;
  DROP INDEX "articles__status_idx";
  ALTER TABLE "articles" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "date" SET NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "author" SET NOT NULL;
  ALTER TABLE "articles_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "articles_locales" ALTER COLUMN "excerpt" SET NOT NULL;
  ALTER TABLE "articles_locales" ALTER COLUMN "content" SET NOT NULL;
  ALTER TABLE "articles_locales" ALTER COLUMN "category" SET NOT NULL;
  ALTER TABLE "articles" DROP COLUMN "_status";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum__articles_v_published_locale";`)
}
