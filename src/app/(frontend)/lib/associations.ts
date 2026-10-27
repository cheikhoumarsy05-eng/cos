/**
 * Photo de bannière et site de chaque association de la section « Associatif ».
 *
 * Rangés ici plutôt que dans l'admin : ajouter ces champs à la collection
 * `volunteering` demanderait une migration de la base, partagée avec la
 * production. La clé est cherchée dans le nom de l'association saisi dans
 * l'admin (« Bien-Être Scolaire (Team BES) » → « team bes »), sans accents ni
 * majuscules.
 */
type Association = { url?: string; photo?: string; photoAlt?: string };

const ASSOCIATIONS: Record<string, Association> = {
  "team bes": {
    url: "https://teambes.org",
    photo: "/associatif/team-bes.jpg",
    photoAlt: "Bénévoles de la Team BÊS en gilet orange déblayant des troncs dans la cour d'une école",
  },
};

const normaliser = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function association(org: string): Association | undefined {
  const nom = normaliser(org ?? "");
  const cle = Object.keys(ASSOCIATIONS).find((k) => nom.includes(k));
  return cle ? ASSOCIATIONS[cle] : undefined;
}
