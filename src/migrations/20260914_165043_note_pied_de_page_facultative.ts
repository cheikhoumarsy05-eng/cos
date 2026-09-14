import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * La note de pied de page devient facultative, et la mention « Conçu à Dakar »
 * est retirée du site.
 *
 * Vider la colonne fait partie de la migration plutôt que d'être laissé à une
 * visite dans l'admin : sans cela, le déploiement suivant accepterait le champ
 * vide mais continuerait d'afficher l'ancienne valeur, déjà écrite en base.
 * Le `down` remet le texte des deux langues avant de rétablir la contrainte,
 * sans quoi `SET NOT NULL` échouerait sur des lignes nulles.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_locales" ALTER COLUMN "footer_note" DROP DEFAULT;
  ALTER TABLE "site_locales" ALTER COLUMN "footer_note" DROP NOT NULL;
  UPDATE "site_locales" SET "footer_note" = NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "site_locales" SET "footer_note" = 'Conçu à Dakar.' WHERE "_locale" = 'fr' AND "footer_note" IS NULL;
  UPDATE "site_locales" SET "footer_note" = 'Designed in Dakar.' WHERE "_locale" = 'en' AND "footer_note" IS NULL;
  ALTER TABLE "site_locales" ALTER COLUMN "footer_note" SET DEFAULT 'Conçu à Dakar.';
  ALTER TABLE "site_locales" ALTER COLUMN "footer_note" SET NOT NULL;`)
}
