import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Passage du site en bilingue fr / en.
 *
 * Payload déplace chaque champ traduit hors de sa table d'origine vers une table
 * « _locales » dédiée. La migration qu'il génère supprime les colonnes sources
 * SANS recopier leur contenu : appliquée telle quelle, elle effacerait tout le
 * texte français de la base. La phase 2 ci-dessous comble ce trou en versant
 * l'existant dans la locale « fr » avant que la phase 3 ne supprime les colonnes.
 *
 * 27 tables _locales, 81 colonnes déplacées.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Phase 1 — créer le type d'énumération, les tables _locales, leurs clés étrangères et index.
  await db.execute(sql`
    CREATE TYPE "public"."_locales" AS ENUM('fr', 'en');
    CREATE TABLE "projects_specs_locales" (
      	"k" varchar NOT NULL,
      	"v" varchar NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" varchar NOT NULL
      );
    CREATE TABLE "projects_tags_locales" (
      	"value" varchar NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" varchar NOT NULL
      );
    CREATE TABLE "projects_images_locales" (
      	"alt" varchar,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" varchar NOT NULL
      );
    CREATE TABLE "projects_locales" (
      	"type" varchar NOT NULL,
      	"field_label" varchar NOT NULL,
      	"desc" varchar NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" integer NOT NULL
      );
    CREATE TABLE "experience_points_locales" (
      	"value" varchar NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" varchar NOT NULL
      );
    CREATE TABLE "experience_key_points_locales" (
      	"value" varchar NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" varchar NOT NULL
      );
    CREATE TABLE "experience_locales" (
      	"when" varchar NOT NULL,
      	"role" varchar NOT NULL,
      	"city" varchar,
      	"summary" varchar,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" integer NOT NULL
      );
    CREATE TABLE "freelance_locales" (
      	"when" varchar NOT NULL,
      	"title" varchar NOT NULL,
      	"body" varchar NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" integer NOT NULL
      );
    CREATE TABLE "education_locales" (
      	"when" varchar NOT NULL,
      	"title" varchar NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" integer NOT NULL
      );
    CREATE TABLE "hero_locales" (
      	"folio_label" varchar DEFAULT 'Portfolio · Ingénieur Structures' NOT NULL,
      	"role" varchar,
      	"disciplines" varchar,
      	"sub" varchar NOT NULL,
      	"image_alt" varchar,
      	"image_caption" varchar,
      	"availability" varchar DEFAULT 'Disponible — stage 4 à 6 mois' NOT NULL,
      	"location" varchar DEFAULT 'Dakar, Sénégal' NOT NULL,
      	"domain" varchar DEFAULT 'Béton armé · Charpente métallique · Dynamique' NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" integer NOT NULL
      );
    CREATE TABLE "about_body_locales" (
      	"value" varchar NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" varchar NOT NULL
      );
    CREATE TABLE "about_facts_locales" (
      	"k" varchar NOT NULL,
      	"v" varchar NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" varchar NOT NULL
      );
    CREATE TABLE "about_locales" (
      	"lead" varchar NOT NULL,
      	"stat_years" varchar DEFAULT '4 expériences' NOT NULL,
      	"stat_years_text" varchar DEFAULT 'terrain & bureau d''études.' NOT NULL,
      	"stat_projects" varchar DEFAULT '5 projets' NOT NULL,
      	"stat_projects_text" varchar DEFAULT 'de conception, contrôle & recherche.' NOT NULL,
      	"stat_publication" varchar DEFAULT '1 publication' NOT NULL,
      	"stat_publication_text" varchar DEFAULT 'scientifique' NOT NULL,
      	"stat_note" varchar DEFAULT 'Zenodo, 2026' NOT NULL,
      	"portrait_alt" varchar DEFAULT 'Cheikh Oumar Sy, ingénieur en génie civil',
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" integer NOT NULL
      );
    CREATE TABLE "expertise_items_locales" (
      	"title" varchar NOT NULL,
      	"description" varchar NOT NULL,
      	"tools" varchar,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" varchar NOT NULL
      );
    CREATE TABLE "expertise_locales" (
      	"title" varchar DEFAULT 'Expertise',
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" integer NOT NULL
      );
    CREATE TABLE "publication_items_points_locales" (
      	"value" varchar NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" varchar NOT NULL
      );
    CREATE TABLE "publication_items_metrics_locales" (
      	"value" varchar NOT NULL,
      	"label" varchar NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" varchar NOT NULL
      );
    CREATE TABLE "publication_items_side_facts_locales" (
      	"k" varchar NOT NULL,
      	"v" varchar NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" varchar NOT NULL
      );
    CREATE TABLE "publication_items_locales" (
      	"title" varchar NOT NULL,
      	"sub" varchar NOT NULL,
      	"key_result" varchar,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" varchar NOT NULL
      );
    CREATE TABLE "skills_domains_locales" (
      	"title" varchar NOT NULL,
      	"items" varchar NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" varchar NOT NULL
      );
    CREATE TABLE "skills_technical_locales" (
      	"value" varchar NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" varchar NOT NULL
      );
    CREATE TABLE "skills_personal_locales" (
      	"value" varchar NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" varchar NOT NULL
      );
    CREATE TABLE "skills_locales" (
      	"technical_label" varchar DEFAULT 'Techniques' NOT NULL,
      	"tools_label" varchar DEFAULT 'Outils & logiciels' NOT NULL,
      	"tools_note" varchar DEFAULT 'En gras : maîtrise quotidienne' NOT NULL,
      	"personal_label" varchar DEFAULT 'Personnelles' NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" integer NOT NULL
      );
    CREATE TABLE "stats_items_locales" (
      	"label" varchar NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" varchar NOT NULL
      );
    CREATE TABLE "stats_locales" (
      	"title" varchar DEFAULT 'En chiffres' NOT NULL,
      	"lead" varchar,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" integer NOT NULL
      );
    CREATE TABLE "contact_locales" (
      	"title" varchar DEFAULT 'Disponible pour un stage de 4 à 6 mois.' NOT NULL,
      	"lead" varchar NOT NULL,
      	"location" varchar DEFAULT 'Dakar — Sénégal' NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" integer NOT NULL
      );
    CREATE TABLE "site_locales" (
      	"footer_note" varchar DEFAULT 'Conçu à Dakar.' NOT NULL,
      	"section_titles_home" varchar DEFAULT 'Accueil',
      	"section_titles_about" varchar DEFAULT 'À propos',
      	"section_titles_about_nav" varchar DEFAULT 'À propos',
      	"section_titles_expertise" varchar DEFAULT 'Expertise',
      	"section_titles_experience" varchar DEFAULT 'Expérience',
      	"section_titles_experience_lead" varchar DEFAULT 'Bureau de contrôle, conduite de travaux, chantier.',
      	"section_titles_research" varchar DEFAULT 'Recherche appliquée',
      	"section_titles_projects" varchar DEFAULT 'Projets',
      	"section_titles_projects_lead" varchar DEFAULT 'Conception, modélisation et calcul de bâtiments résidentiels — du volume à l''élément.',
      	"section_titles_projects_nav" varchar DEFAULT 'Projets',
      	"section_titles_contact_nav" varchar DEFAULT 'Contact',
      	"section_titles_freelance" varchar DEFAULT 'Freelance',
      	"section_titles_skills" varchar DEFAULT 'Compétences',
      	"section_titles_education" varchar DEFAULT 'Formation',
      	"section_titles_contact" varchar DEFAULT 'Contact',
      	"id" serial PRIMARY KEY NOT NULL,
      	"_locale" "_locales" NOT NULL,
      	"_parent_id" integer NOT NULL
      );
    ALTER TABLE "projects_specs_locales" ADD CONSTRAINT "projects_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_specs"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "projects_tags_locales" ADD CONSTRAINT "projects_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_tags"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "projects_images_locales" ADD CONSTRAINT "projects_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_images"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "experience_points_locales" ADD CONSTRAINT "experience_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experience_points"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "experience_key_points_locales" ADD CONSTRAINT "experience_key_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experience_key_points"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "experience_locales" ADD CONSTRAINT "experience_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experience"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "freelance_locales" ADD CONSTRAINT "freelance_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."freelance"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "education_locales" ADD CONSTRAINT "education_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "hero_locales" ADD CONSTRAINT "hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "about_body_locales" ADD CONSTRAINT "about_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_body"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "about_facts_locales" ADD CONSTRAINT "about_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_facts"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "about_locales" ADD CONSTRAINT "about_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "expertise_items_locales" ADD CONSTRAINT "expertise_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expertise_items"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "expertise_locales" ADD CONSTRAINT "expertise_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "publication_items_points_locales" ADD CONSTRAINT "publication_items_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."publication_items_points"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "publication_items_metrics_locales" ADD CONSTRAINT "publication_items_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."publication_items_metrics"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "publication_items_side_facts_locales" ADD CONSTRAINT "publication_items_side_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."publication_items_side_facts"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "publication_items_locales" ADD CONSTRAINT "publication_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."publication_items"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "skills_domains_locales" ADD CONSTRAINT "skills_domains_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."skills_domains"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "skills_technical_locales" ADD CONSTRAINT "skills_technical_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."skills_technical"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "skills_personal_locales" ADD CONSTRAINT "skills_personal_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."skills_personal"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "skills_locales" ADD CONSTRAINT "skills_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "stats_items_locales" ADD CONSTRAINT "stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stats_items"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "stats_locales" ADD CONSTRAINT "stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stats"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "contact_locales" ADD CONSTRAINT "contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_locales" ADD CONSTRAINT "site_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
    CREATE UNIQUE INDEX "projects_specs_locales_locale_parent_id_unique" ON "projects_specs_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "projects_tags_locales_locale_parent_id_unique" ON "projects_tags_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "projects_images_locales_locale_parent_id_unique" ON "projects_images_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "experience_points_locales_locale_parent_id_unique" ON "experience_points_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "experience_key_points_locales_locale_parent_id_unique" ON "experience_key_points_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "experience_locales_locale_parent_id_unique" ON "experience_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "freelance_locales_locale_parent_id_unique" ON "freelance_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "education_locales_locale_parent_id_unique" ON "education_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "hero_locales_locale_parent_id_unique" ON "hero_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "about_body_locales_locale_parent_id_unique" ON "about_body_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "about_facts_locales_locale_parent_id_unique" ON "about_facts_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "about_locales_locale_parent_id_unique" ON "about_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "expertise_items_locales_locale_parent_id_unique" ON "expertise_items_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "expertise_locales_locale_parent_id_unique" ON "expertise_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "publication_items_points_locales_locale_parent_id_unique" ON "publication_items_points_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "publication_items_metrics_locales_locale_parent_id_unique" ON "publication_items_metrics_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "publication_items_side_facts_locales_locale_parent_id_unique" ON "publication_items_side_facts_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "publication_items_locales_locale_parent_id_unique" ON "publication_items_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "skills_domains_locales_locale_parent_id_unique" ON "skills_domains_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "skills_technical_locales_locale_parent_id_unique" ON "skills_technical_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "skills_personal_locales_locale_parent_id_unique" ON "skills_personal_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "skills_locales_locale_parent_id_unique" ON "skills_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "stats_items_locales_locale_parent_id_unique" ON "stats_items_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "stats_locales_locale_parent_id_unique" ON "stats_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "contact_locales_locale_parent_id_unique" ON "contact_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "site_locales_locale_parent_id_unique" ON "site_locales" USING btree ("_locale","_parent_id");
  `)

  // Phase 2 — verser le contenu français existant dans la locale « fr ».
  // Doit impérativement précéder la phase 3, qui supprime les colonnes sources.
  await db.execute(sql`
    INSERT INTO "projects_specs_locales" ("_locale", "_parent_id", "k", "v")
      SELECT 'fr', "id", "k", "v" FROM "projects_specs";
    INSERT INTO "projects_tags_locales" ("_locale", "_parent_id", "value")
      SELECT 'fr', "id", "value" FROM "projects_tags";
    INSERT INTO "projects_images_locales" ("_locale", "_parent_id", "alt")
      SELECT 'fr', "id", "alt" FROM "projects_images";
    INSERT INTO "projects_locales" ("_locale", "_parent_id", "type", "field_label", "desc")
      SELECT 'fr', "id", "type", "field_label", "desc" FROM "projects";
    INSERT INTO "experience_points_locales" ("_locale", "_parent_id", "value")
      SELECT 'fr', "id", "value" FROM "experience_points";
    INSERT INTO "experience_key_points_locales" ("_locale", "_parent_id", "value")
      SELECT 'fr', "id", "value" FROM "experience_key_points";
    INSERT INTO "experience_locales" ("_locale", "_parent_id", "when", "role", "city", "summary")
      SELECT 'fr', "id", "when", "role", "city", "summary" FROM "experience";
    INSERT INTO "freelance_locales" ("_locale", "_parent_id", "when", "title", "body")
      SELECT 'fr', "id", "when", "title", "body" FROM "freelance";
    INSERT INTO "education_locales" ("_locale", "_parent_id", "when", "title")
      SELECT 'fr', "id", "when", "title" FROM "education";
    INSERT INTO "hero_locales" ("_locale", "_parent_id", "folio_label", "role", "disciplines", "sub", "image_alt", "image_caption", "availability", "location", "domain")
      SELECT 'fr', "id", "folio_label", "role", "disciplines", "sub", "image_alt", "image_caption", "availability", "location", "domain" FROM "hero";
    INSERT INTO "about_body_locales" ("_locale", "_parent_id", "value")
      SELECT 'fr', "id", "value" FROM "about_body";
    INSERT INTO "about_facts_locales" ("_locale", "_parent_id", "k", "v")
      SELECT 'fr', "id", "k", "v" FROM "about_facts";
    INSERT INTO "about_locales" ("_locale", "_parent_id", "lead", "stat_years", "stat_years_text", "stat_projects", "stat_projects_text", "stat_publication", "stat_publication_text", "stat_note", "portrait_alt")
      SELECT 'fr', "id", "lead", "stat_years", "stat_years_text", "stat_projects", "stat_projects_text", "stat_publication", "stat_publication_text", "stat_note", "portrait_alt" FROM "about";
    INSERT INTO "expertise_items_locales" ("_locale", "_parent_id", "title", "description", "tools")
      SELECT 'fr', "id", "title", "description", "tools" FROM "expertise_items";
    INSERT INTO "expertise_locales" ("_locale", "_parent_id", "title")
      SELECT 'fr', "id", "title" FROM "expertise";
    INSERT INTO "publication_items_points_locales" ("_locale", "_parent_id", "value")
      SELECT 'fr', "id", "value" FROM "publication_items_points";
    INSERT INTO "publication_items_metrics_locales" ("_locale", "_parent_id", "value", "label")
      SELECT 'fr', "id", "value", "label" FROM "publication_items_metrics";
    INSERT INTO "publication_items_side_facts_locales" ("_locale", "_parent_id", "k", "v")
      SELECT 'fr', "id", "k", "v" FROM "publication_items_side_facts";
    INSERT INTO "publication_items_locales" ("_locale", "_parent_id", "title", "sub", "key_result")
      SELECT 'fr', "id", "title", "sub", "key_result" FROM "publication_items";
    INSERT INTO "skills_domains_locales" ("_locale", "_parent_id", "title", "items")
      SELECT 'fr', "id", "title", "items" FROM "skills_domains";
    INSERT INTO "skills_technical_locales" ("_locale", "_parent_id", "value")
      SELECT 'fr', "id", "value" FROM "skills_technical";
    INSERT INTO "skills_personal_locales" ("_locale", "_parent_id", "value")
      SELECT 'fr', "id", "value" FROM "skills_personal";
    INSERT INTO "skills_locales" ("_locale", "_parent_id", "technical_label", "tools_label", "tools_note", "personal_label")
      SELECT 'fr', "id", "technical_label", "tools_label", "tools_note", "personal_label" FROM "skills";
    INSERT INTO "stats_items_locales" ("_locale", "_parent_id", "label")
      SELECT 'fr', "id", "label" FROM "stats_items";
    INSERT INTO "stats_locales" ("_locale", "_parent_id", "title", "lead")
      SELECT 'fr', "id", "title", "lead" FROM "stats";
    INSERT INTO "contact_locales" ("_locale", "_parent_id", "title", "lead", "location")
      SELECT 'fr', "id", "title", "lead", "location" FROM "contact";
    INSERT INTO "site_locales" ("_locale", "_parent_id", "footer_note", "section_titles_home", "section_titles_about", "section_titles_about_nav", "section_titles_expertise", "section_titles_experience", "section_titles_experience_lead", "section_titles_research", "section_titles_projects", "section_titles_projects_lead", "section_titles_projects_nav", "section_titles_contact_nav", "section_titles_freelance", "section_titles_skills", "section_titles_education", "section_titles_contact")
      SELECT 'fr', "id", "footer_note", "section_titles_home", "section_titles_about", "section_titles_about_nav", "section_titles_expertise", "section_titles_experience", "section_titles_experience_lead", "section_titles_research", "section_titles_projects", "section_titles_projects_lead", "section_titles_projects_nav", "section_titles_contact_nav", "section_titles_freelance", "section_titles_skills", "section_titles_education", "section_titles_contact" FROM "site";
  `)

  // Phase 3 — supprimer les colonnes d'origine, désormais recopiées.
  await db.execute(sql`
    ALTER TABLE "projects_specs" DROP COLUMN "k";
    ALTER TABLE "projects_specs" DROP COLUMN "v";
    ALTER TABLE "projects_tags" DROP COLUMN "value";
    ALTER TABLE "projects_images" DROP COLUMN "alt";
    ALTER TABLE "projects" DROP COLUMN "type";
    ALTER TABLE "projects" DROP COLUMN "field_label";
    ALTER TABLE "projects" DROP COLUMN "desc";
    ALTER TABLE "experience_points" DROP COLUMN "value";
    ALTER TABLE "experience_key_points" DROP COLUMN "value";
    ALTER TABLE "experience" DROP COLUMN "when";
    ALTER TABLE "experience" DROP COLUMN "role";
    ALTER TABLE "experience" DROP COLUMN "city";
    ALTER TABLE "experience" DROP COLUMN "summary";
    ALTER TABLE "freelance" DROP COLUMN "when";
    ALTER TABLE "freelance" DROP COLUMN "title";
    ALTER TABLE "freelance" DROP COLUMN "body";
    ALTER TABLE "education" DROP COLUMN "when";
    ALTER TABLE "education" DROP COLUMN "title";
    ALTER TABLE "hero" DROP COLUMN "folio_label";
    ALTER TABLE "hero" DROP COLUMN "role";
    ALTER TABLE "hero" DROP COLUMN "disciplines";
    ALTER TABLE "hero" DROP COLUMN "sub";
    ALTER TABLE "hero" DROP COLUMN "image_alt";
    ALTER TABLE "hero" DROP COLUMN "image_caption";
    ALTER TABLE "hero" DROP COLUMN "availability";
    ALTER TABLE "hero" DROP COLUMN "location";
    ALTER TABLE "hero" DROP COLUMN "domain";
    ALTER TABLE "about_body" DROP COLUMN "value";
    ALTER TABLE "about_facts" DROP COLUMN "k";
    ALTER TABLE "about_facts" DROP COLUMN "v";
    ALTER TABLE "about" DROP COLUMN "lead";
    ALTER TABLE "about" DROP COLUMN "stat_years";
    ALTER TABLE "about" DROP COLUMN "stat_years_text";
    ALTER TABLE "about" DROP COLUMN "stat_projects";
    ALTER TABLE "about" DROP COLUMN "stat_projects_text";
    ALTER TABLE "about" DROP COLUMN "stat_publication";
    ALTER TABLE "about" DROP COLUMN "stat_publication_text";
    ALTER TABLE "about" DROP COLUMN "stat_note";
    ALTER TABLE "about" DROP COLUMN "portrait_alt";
    ALTER TABLE "expertise_items" DROP COLUMN "title";
    ALTER TABLE "expertise_items" DROP COLUMN "description";
    ALTER TABLE "expertise_items" DROP COLUMN "tools";
    ALTER TABLE "expertise" DROP COLUMN "title";
    ALTER TABLE "publication_items_points" DROP COLUMN "value";
    ALTER TABLE "publication_items_metrics" DROP COLUMN "value";
    ALTER TABLE "publication_items_metrics" DROP COLUMN "label";
    ALTER TABLE "publication_items_side_facts" DROP COLUMN "k";
    ALTER TABLE "publication_items_side_facts" DROP COLUMN "v";
    ALTER TABLE "publication_items" DROP COLUMN "title";
    ALTER TABLE "publication_items" DROP COLUMN "sub";
    ALTER TABLE "publication_items" DROP COLUMN "key_result";
    ALTER TABLE "skills_domains" DROP COLUMN "title";
    ALTER TABLE "skills_domains" DROP COLUMN "items";
    ALTER TABLE "skills_technical" DROP COLUMN "value";
    ALTER TABLE "skills_personal" DROP COLUMN "value";
    ALTER TABLE "skills" DROP COLUMN "technical_label";
    ALTER TABLE "skills" DROP COLUMN "tools_label";
    ALTER TABLE "skills" DROP COLUMN "tools_note";
    ALTER TABLE "skills" DROP COLUMN "personal_label";
    ALTER TABLE "stats_items" DROP COLUMN "label";
    ALTER TABLE "stats" DROP COLUMN "title";
    ALTER TABLE "stats" DROP COLUMN "lead";
    ALTER TABLE "contact" DROP COLUMN "title";
    ALTER TABLE "contact" DROP COLUMN "lead";
    ALTER TABLE "contact" DROP COLUMN "location";
    ALTER TABLE "site" DROP COLUMN "footer_note";
    ALTER TABLE "site" DROP COLUMN "section_titles_home";
    ALTER TABLE "site" DROP COLUMN "section_titles_about";
    ALTER TABLE "site" DROP COLUMN "section_titles_about_nav";
    ALTER TABLE "site" DROP COLUMN "section_titles_expertise";
    ALTER TABLE "site" DROP COLUMN "section_titles_experience";
    ALTER TABLE "site" DROP COLUMN "section_titles_experience_lead";
    ALTER TABLE "site" DROP COLUMN "section_titles_research";
    ALTER TABLE "site" DROP COLUMN "section_titles_projects";
    ALTER TABLE "site" DROP COLUMN "section_titles_projects_lead";
    ALTER TABLE "site" DROP COLUMN "section_titles_projects_nav";
    ALTER TABLE "site" DROP COLUMN "section_titles_contact_nav";
    ALTER TABLE "site" DROP COLUMN "section_titles_freelance";
    ALTER TABLE "site" DROP COLUMN "section_titles_skills";
    ALTER TABLE "site" DROP COLUMN "section_titles_education";
    ALTER TABLE "site" DROP COLUMN "section_titles_contact";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Phase 1 — recréer les colonnes d'origine, en nullable : on ne peut pas poser
  // NOT NULL sur une table déjà peuplée avant d'avoir remis les valeurs.
  await db.execute(sql`
    ALTER TABLE "projects_specs" ADD COLUMN "k" varchar;
    ALTER TABLE "projects_specs" ADD COLUMN "v" varchar;
    ALTER TABLE "projects_tags" ADD COLUMN "value" varchar;
    ALTER TABLE "projects_images" ADD COLUMN "alt" varchar;
    ALTER TABLE "projects" ADD COLUMN "type" varchar;
    ALTER TABLE "projects" ADD COLUMN "field_label" varchar;
    ALTER TABLE "projects" ADD COLUMN "desc" varchar;
    ALTER TABLE "experience_points" ADD COLUMN "value" varchar;
    ALTER TABLE "experience_key_points" ADD COLUMN "value" varchar;
    ALTER TABLE "experience" ADD COLUMN "when" varchar;
    ALTER TABLE "experience" ADD COLUMN "role" varchar;
    ALTER TABLE "experience" ADD COLUMN "city" varchar;
    ALTER TABLE "experience" ADD COLUMN "summary" varchar;
    ALTER TABLE "freelance" ADD COLUMN "when" varchar;
    ALTER TABLE "freelance" ADD COLUMN "title" varchar;
    ALTER TABLE "freelance" ADD COLUMN "body" varchar;
    ALTER TABLE "education" ADD COLUMN "when" varchar;
    ALTER TABLE "education" ADD COLUMN "title" varchar;
    ALTER TABLE "hero" ADD COLUMN "folio_label" varchar DEFAULT 'Portfolio · Ingénieur Structures';
    ALTER TABLE "hero" ADD COLUMN "role" varchar;
    ALTER TABLE "hero" ADD COLUMN "disciplines" varchar;
    ALTER TABLE "hero" ADD COLUMN "sub" varchar;
    ALTER TABLE "hero" ADD COLUMN "image_alt" varchar;
    ALTER TABLE "hero" ADD COLUMN "image_caption" varchar;
    ALTER TABLE "hero" ADD COLUMN "availability" varchar DEFAULT 'Disponible — stage 4 à 6 mois';
    ALTER TABLE "hero" ADD COLUMN "location" varchar DEFAULT 'Dakar, Sénégal';
    ALTER TABLE "hero" ADD COLUMN "domain" varchar DEFAULT 'Béton armé · Charpente métallique · Dynamique';
    ALTER TABLE "about_body" ADD COLUMN "value" varchar;
    ALTER TABLE "about_facts" ADD COLUMN "k" varchar;
    ALTER TABLE "about_facts" ADD COLUMN "v" varchar;
    ALTER TABLE "about" ADD COLUMN "lead" varchar;
    ALTER TABLE "about" ADD COLUMN "stat_years" varchar DEFAULT '4 expériences';
    ALTER TABLE "about" ADD COLUMN "stat_years_text" varchar DEFAULT 'terrain & bureau d''études.';
    ALTER TABLE "about" ADD COLUMN "stat_projects" varchar DEFAULT '5 projets';
    ALTER TABLE "about" ADD COLUMN "stat_projects_text" varchar DEFAULT 'de conception, contrôle & recherche.';
    ALTER TABLE "about" ADD COLUMN "stat_publication" varchar DEFAULT '1 publication';
    ALTER TABLE "about" ADD COLUMN "stat_publication_text" varchar DEFAULT 'scientifique';
    ALTER TABLE "about" ADD COLUMN "stat_note" varchar DEFAULT 'Zenodo, 2026';
    ALTER TABLE "about" ADD COLUMN "portrait_alt" varchar DEFAULT 'Cheikh Oumar Sy, ingénieur en génie civil';
    ALTER TABLE "expertise_items" ADD COLUMN "title" varchar;
    ALTER TABLE "expertise_items" ADD COLUMN "description" varchar;
    ALTER TABLE "expertise_items" ADD COLUMN "tools" varchar;
    ALTER TABLE "expertise" ADD COLUMN "title" varchar DEFAULT 'Expertise';
    ALTER TABLE "publication_items_points" ADD COLUMN "value" varchar;
    ALTER TABLE "publication_items_metrics" ADD COLUMN "value" varchar;
    ALTER TABLE "publication_items_metrics" ADD COLUMN "label" varchar;
    ALTER TABLE "publication_items_side_facts" ADD COLUMN "k" varchar;
    ALTER TABLE "publication_items_side_facts" ADD COLUMN "v" varchar;
    ALTER TABLE "publication_items" ADD COLUMN "title" varchar;
    ALTER TABLE "publication_items" ADD COLUMN "sub" varchar;
    ALTER TABLE "publication_items" ADD COLUMN "key_result" varchar;
    ALTER TABLE "skills_domains" ADD COLUMN "title" varchar;
    ALTER TABLE "skills_domains" ADD COLUMN "items" varchar;
    ALTER TABLE "skills_technical" ADD COLUMN "value" varchar;
    ALTER TABLE "skills_personal" ADD COLUMN "value" varchar;
    ALTER TABLE "skills" ADD COLUMN "technical_label" varchar DEFAULT 'Techniques';
    ALTER TABLE "skills" ADD COLUMN "tools_label" varchar DEFAULT 'Outils & logiciels';
    ALTER TABLE "skills" ADD COLUMN "tools_note" varchar DEFAULT 'En gras : maîtrise quotidienne';
    ALTER TABLE "skills" ADD COLUMN "personal_label" varchar DEFAULT 'Personnelles';
    ALTER TABLE "stats_items" ADD COLUMN "label" varchar;
    ALTER TABLE "stats" ADD COLUMN "title" varchar DEFAULT 'En chiffres';
    ALTER TABLE "stats" ADD COLUMN "lead" varchar;
    ALTER TABLE "contact" ADD COLUMN "title" varchar DEFAULT 'Disponible pour un stage de 4 à 6 mois.';
    ALTER TABLE "contact" ADD COLUMN "lead" varchar;
    ALTER TABLE "contact" ADD COLUMN "location" varchar DEFAULT 'Dakar — Sénégal';
    ALTER TABLE "site" ADD COLUMN "footer_note" varchar DEFAULT 'Conçu à Dakar.';
    ALTER TABLE "site" ADD COLUMN "section_titles_home" varchar DEFAULT 'Accueil';
    ALTER TABLE "site" ADD COLUMN "section_titles_about" varchar DEFAULT 'À propos';
    ALTER TABLE "site" ADD COLUMN "section_titles_about_nav" varchar DEFAULT 'À propos';
    ALTER TABLE "site" ADD COLUMN "section_titles_expertise" varchar DEFAULT 'Expertise';
    ALTER TABLE "site" ADD COLUMN "section_titles_experience" varchar DEFAULT 'Expérience';
    ALTER TABLE "site" ADD COLUMN "section_titles_experience_lead" varchar DEFAULT 'Bureau de contrôle, conduite de travaux, chantier.';
    ALTER TABLE "site" ADD COLUMN "section_titles_research" varchar DEFAULT 'Recherche appliquée';
    ALTER TABLE "site" ADD COLUMN "section_titles_projects" varchar DEFAULT 'Projets';
    ALTER TABLE "site" ADD COLUMN "section_titles_projects_lead" varchar DEFAULT 'Conception, modélisation et calcul de bâtiments résidentiels — du volume à l''élément.';
    ALTER TABLE "site" ADD COLUMN "section_titles_projects_nav" varchar DEFAULT 'Projets';
    ALTER TABLE "site" ADD COLUMN "section_titles_contact_nav" varchar DEFAULT 'Contact';
    ALTER TABLE "site" ADD COLUMN "section_titles_freelance" varchar DEFAULT 'Freelance';
    ALTER TABLE "site" ADD COLUMN "section_titles_skills" varchar DEFAULT 'Compétences';
    ALTER TABLE "site" ADD COLUMN "section_titles_education" varchar DEFAULT 'Formation';
    ALTER TABLE "site" ADD COLUMN "section_titles_contact" varchar DEFAULT 'Contact';
  `)

  // Phase 2 — y remettre le français avant de perdre les tables _locales.
  await db.execute(sql`
    UPDATE "projects_specs" AS p SET "k" = l."k", "v" = l."v"
      FROM "projects_specs_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "projects_tags" AS p SET "value" = l."value"
      FROM "projects_tags_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "projects_images" AS p SET "alt" = l."alt"
      FROM "projects_images_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "projects" AS p SET "type" = l."type", "field_label" = l."field_label", "desc" = l."desc"
      FROM "projects_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "experience_points" AS p SET "value" = l."value"
      FROM "experience_points_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "experience_key_points" AS p SET "value" = l."value"
      FROM "experience_key_points_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "experience" AS p SET "when" = l."when", "role" = l."role", "city" = l."city", "summary" = l."summary"
      FROM "experience_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "freelance" AS p SET "when" = l."when", "title" = l."title", "body" = l."body"
      FROM "freelance_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "education" AS p SET "when" = l."when", "title" = l."title"
      FROM "education_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "hero" AS p SET "folio_label" = l."folio_label", "role" = l."role", "disciplines" = l."disciplines", "sub" = l."sub", "image_alt" = l."image_alt", "image_caption" = l."image_caption", "availability" = l."availability", "location" = l."location", "domain" = l."domain"
      FROM "hero_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "about_body" AS p SET "value" = l."value"
      FROM "about_body_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "about_facts" AS p SET "k" = l."k", "v" = l."v"
      FROM "about_facts_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "about" AS p SET "lead" = l."lead", "stat_years" = l."stat_years", "stat_years_text" = l."stat_years_text", "stat_projects" = l."stat_projects", "stat_projects_text" = l."stat_projects_text", "stat_publication" = l."stat_publication", "stat_publication_text" = l."stat_publication_text", "stat_note" = l."stat_note", "portrait_alt" = l."portrait_alt"
      FROM "about_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "expertise_items" AS p SET "title" = l."title", "description" = l."description", "tools" = l."tools"
      FROM "expertise_items_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "expertise" AS p SET "title" = l."title"
      FROM "expertise_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "publication_items_points" AS p SET "value" = l."value"
      FROM "publication_items_points_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "publication_items_metrics" AS p SET "value" = l."value", "label" = l."label"
      FROM "publication_items_metrics_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "publication_items_side_facts" AS p SET "k" = l."k", "v" = l."v"
      FROM "publication_items_side_facts_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "publication_items" AS p SET "title" = l."title", "sub" = l."sub", "key_result" = l."key_result"
      FROM "publication_items_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "skills_domains" AS p SET "title" = l."title", "items" = l."items"
      FROM "skills_domains_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "skills_technical" AS p SET "value" = l."value"
      FROM "skills_technical_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "skills_personal" AS p SET "value" = l."value"
      FROM "skills_personal_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "skills" AS p SET "technical_label" = l."technical_label", "tools_label" = l."tools_label", "tools_note" = l."tools_note", "personal_label" = l."personal_label"
      FROM "skills_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "stats_items" AS p SET "label" = l."label"
      FROM "stats_items_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "stats" AS p SET "title" = l."title", "lead" = l."lead"
      FROM "stats_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "contact" AS p SET "title" = l."title", "lead" = l."lead", "location" = l."location"
      FROM "contact_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
    UPDATE "site" AS p SET "footer_note" = l."footer_note", "section_titles_home" = l."section_titles_home", "section_titles_about" = l."section_titles_about", "section_titles_about_nav" = l."section_titles_about_nav", "section_titles_expertise" = l."section_titles_expertise", "section_titles_experience" = l."section_titles_experience", "section_titles_experience_lead" = l."section_titles_experience_lead", "section_titles_research" = l."section_titles_research", "section_titles_projects" = l."section_titles_projects", "section_titles_projects_lead" = l."section_titles_projects_lead", "section_titles_projects_nav" = l."section_titles_projects_nav", "section_titles_contact_nav" = l."section_titles_contact_nav", "section_titles_freelance" = l."section_titles_freelance", "section_titles_skills" = l."section_titles_skills", "section_titles_education" = l."section_titles_education", "section_titles_contact" = l."section_titles_contact"
      FROM "site_locales" AS l WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
  `)

  // Phase 2 bis — reposer les contraintes NOT NULL, une fois les valeurs restaurées.
  await db.execute(sql`
    ALTER TABLE "projects_specs" ALTER COLUMN "k" SET NOT NULL;
    ALTER TABLE "projects_specs" ALTER COLUMN "v" SET NOT NULL;
    ALTER TABLE "projects_tags" ALTER COLUMN "value" SET NOT NULL;
    ALTER TABLE "projects" ALTER COLUMN "type" SET NOT NULL;
    ALTER TABLE "projects" ALTER COLUMN "field_label" SET NOT NULL;
    ALTER TABLE "projects" ALTER COLUMN "desc" SET NOT NULL;
    ALTER TABLE "experience_points" ALTER COLUMN "value" SET NOT NULL;
    ALTER TABLE "experience_key_points" ALTER COLUMN "value" SET NOT NULL;
    ALTER TABLE "experience" ALTER COLUMN "when" SET NOT NULL;
    ALTER TABLE "experience" ALTER COLUMN "role" SET NOT NULL;
    ALTER TABLE "freelance" ALTER COLUMN "when" SET NOT NULL;
    ALTER TABLE "freelance" ALTER COLUMN "title" SET NOT NULL;
    ALTER TABLE "freelance" ALTER COLUMN "body" SET NOT NULL;
    ALTER TABLE "education" ALTER COLUMN "when" SET NOT NULL;
    ALTER TABLE "education" ALTER COLUMN "title" SET NOT NULL;
    ALTER TABLE "hero" ALTER COLUMN "folio_label" SET NOT NULL;
    ALTER TABLE "hero" ALTER COLUMN "sub" SET NOT NULL;
    ALTER TABLE "hero" ALTER COLUMN "availability" SET NOT NULL;
    ALTER TABLE "hero" ALTER COLUMN "location" SET NOT NULL;
    ALTER TABLE "hero" ALTER COLUMN "domain" SET NOT NULL;
    ALTER TABLE "about_body" ALTER COLUMN "value" SET NOT NULL;
    ALTER TABLE "about_facts" ALTER COLUMN "k" SET NOT NULL;
    ALTER TABLE "about_facts" ALTER COLUMN "v" SET NOT NULL;
    ALTER TABLE "about" ALTER COLUMN "lead" SET NOT NULL;
    ALTER TABLE "about" ALTER COLUMN "stat_years" SET NOT NULL;
    ALTER TABLE "about" ALTER COLUMN "stat_years_text" SET NOT NULL;
    ALTER TABLE "about" ALTER COLUMN "stat_projects" SET NOT NULL;
    ALTER TABLE "about" ALTER COLUMN "stat_projects_text" SET NOT NULL;
    ALTER TABLE "about" ALTER COLUMN "stat_publication" SET NOT NULL;
    ALTER TABLE "about" ALTER COLUMN "stat_publication_text" SET NOT NULL;
    ALTER TABLE "about" ALTER COLUMN "stat_note" SET NOT NULL;
    ALTER TABLE "expertise_items" ALTER COLUMN "title" SET NOT NULL;
    ALTER TABLE "expertise_items" ALTER COLUMN "description" SET NOT NULL;
    ALTER TABLE "publication_items_points" ALTER COLUMN "value" SET NOT NULL;
    ALTER TABLE "publication_items_metrics" ALTER COLUMN "value" SET NOT NULL;
    ALTER TABLE "publication_items_metrics" ALTER COLUMN "label" SET NOT NULL;
    ALTER TABLE "publication_items_side_facts" ALTER COLUMN "k" SET NOT NULL;
    ALTER TABLE "publication_items_side_facts" ALTER COLUMN "v" SET NOT NULL;
    ALTER TABLE "publication_items" ALTER COLUMN "title" SET NOT NULL;
    ALTER TABLE "publication_items" ALTER COLUMN "sub" SET NOT NULL;
    ALTER TABLE "skills_domains" ALTER COLUMN "title" SET NOT NULL;
    ALTER TABLE "skills_domains" ALTER COLUMN "items" SET NOT NULL;
    ALTER TABLE "skills_technical" ALTER COLUMN "value" SET NOT NULL;
    ALTER TABLE "skills_personal" ALTER COLUMN "value" SET NOT NULL;
    ALTER TABLE "skills" ALTER COLUMN "technical_label" SET NOT NULL;
    ALTER TABLE "skills" ALTER COLUMN "tools_label" SET NOT NULL;
    ALTER TABLE "skills" ALTER COLUMN "tools_note" SET NOT NULL;
    ALTER TABLE "skills" ALTER COLUMN "personal_label" SET NOT NULL;
    ALTER TABLE "stats_items" ALTER COLUMN "label" SET NOT NULL;
    ALTER TABLE "stats" ALTER COLUMN "title" SET NOT NULL;
    ALTER TABLE "contact" ALTER COLUMN "title" SET NOT NULL;
    ALTER TABLE "contact" ALTER COLUMN "lead" SET NOT NULL;
    ALTER TABLE "contact" ALTER COLUMN "location" SET NOT NULL;
    ALTER TABLE "site" ALTER COLUMN "footer_note" SET NOT NULL;
  `)

  // Phase 3 — supprimer les tables _locales et le type d'énumération.
  await db.execute(sql`
    DROP TABLE "projects_specs_locales" CASCADE;
    DROP TABLE "projects_tags_locales" CASCADE;
    DROP TABLE "projects_images_locales" CASCADE;
    DROP TABLE "projects_locales" CASCADE;
    DROP TABLE "experience_points_locales" CASCADE;
    DROP TABLE "experience_key_points_locales" CASCADE;
    DROP TABLE "experience_locales" CASCADE;
    DROP TABLE "freelance_locales" CASCADE;
    DROP TABLE "education_locales" CASCADE;
    DROP TABLE "hero_locales" CASCADE;
    DROP TABLE "about_body_locales" CASCADE;
    DROP TABLE "about_facts_locales" CASCADE;
    DROP TABLE "about_locales" CASCADE;
    DROP TABLE "expertise_items_locales" CASCADE;
    DROP TABLE "expertise_locales" CASCADE;
    DROP TABLE "publication_items_points_locales" CASCADE;
    DROP TABLE "publication_items_metrics_locales" CASCADE;
    DROP TABLE "publication_items_side_facts_locales" CASCADE;
    DROP TABLE "publication_items_locales" CASCADE;
    DROP TABLE "skills_domains_locales" CASCADE;
    DROP TABLE "skills_technical_locales" CASCADE;
    DROP TABLE "skills_personal_locales" CASCADE;
    DROP TABLE "skills_locales" CASCADE;
    DROP TABLE "stats_items_locales" CASCADE;
    DROP TABLE "stats_locales" CASCADE;
    DROP TABLE "contact_locales" CASCADE;
    DROP TABLE "site_locales" CASCADE;
    DROP TYPE "public"."_locales";
  `)
}
