"use client";

import { useFormFields } from "@payloadcms/ui";
import "./bouton-apercu.css";

/**
 * Bouton « Aperçu », posé juste avant « Enregistrer le brouillon ».
 *
 * Payload place déjà un lien d'aperçu dans la colonne de droite, loin des
 * boutons d'action : on écrit, on veut voir, et on cherche. Celui-ci se tient
 * là où se prennent les décisions — à côté des boutons d'enregistrement.
 *
 * L'article s'ouvre dans un onglet séparé pour ne pas perdre la rédaction en
 * cours, et le bouton reste inerte tant qu'aucun identifiant n'existe : sans
 * lui, l'adresse ne mène nulle part.
 */
export default function BoutonApercu() {
  const slug = useFormFields(([fields]) => fields?.slug?.value as string | undefined);

  const pret = Boolean(slug && String(slug).trim());
  const adresse = pret ? `/articles/${slug}` : undefined;

  return (
    <a
      className={"bouton-apercu" + (pret ? "" : " bouton-apercu--inerte")}
      href={adresse}
      target="_blank"
      rel="noopener"
      aria-disabled={!pret}
      title={pret ? "Ouvrir l'article dans un nouvel onglet" : "Renseignez d'abord un titre ou un identifiant d'URL"}
      onClick={(e) => {
        if (!pret) e.preventDefault();
      }}
    >
      Aperçu
    </a>
  );
}
