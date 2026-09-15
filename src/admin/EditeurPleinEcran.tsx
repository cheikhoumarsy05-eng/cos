"use client";

import { useEffect, type ReactNode } from "react";
import "./editeur-plein-ecran.css";

/**
 * Bouton « Plein écran » posé au-dessus du champ de rédaction.
 *
 * L'éditeur de l'admin occupe une colonne étroite, ce qui convient à une
 * légende mais pas à un article de plusieurs milliers de signes. Ce bouton
 * bascule le champ en pleine page, sur une largeur de lecture confortable :
 * on retrouve la sensation d'un traitement de texte sans quitter l'admin.
 *
 * Le composant s'injecte à la racine de l'admin plutôt que dans le champ
 * lui-même : remplacer un champ `richText` obligerait à réimplémenter tout
 * l'éditeur. On se contente donc d'observer l'arrivée du champ à l'écran et
 * d'y accrocher un bouton.
 *
 * Monté comme « provider », il enveloppe l'interface entière : il doit donc
 * rendre ses enfants. Retourner `null` vide l'admin de tout son contenu.
 */
export default function EditeurPleinEcran({ children }: { children?: ReactNode }) {
  useEffect(() => {
    const ID_BOUTON = "bouton-plein-ecran";
    const CLASSE = "champ-plein-ecran";

    /** Le conteneur du champ « Contenu », quand il est monté. */
    const trouverChamp = () =>
      document.querySelector<HTMLElement>('.field-type.rich-text, [id$="field-content"]');

    const quitter = () => {
      document.querySelector("." + CLASSE)?.classList.remove(CLASSE);
      document.body.classList.remove("a-un-champ-plein-ecran");
      const b = document.getElementById(ID_BOUTON);
      if (b) b.textContent = "Plein écran";
    };

    const basculer = () => {
      const champ = trouverChamp();
      if (!champ) return;
      const ouvert = champ.classList.toggle(CLASSE);
      document.body.classList.toggle("a-un-champ-plein-ecran", ouvert);
      const b = document.getElementById(ID_BOUTON);
      if (b) b.textContent = ouvert ? "Quitter le plein écran (Échap)" : "Plein écran";
      if (ouvert) champ.querySelector<HTMLElement>('[contenteditable="true"]')?.focus();
    };

    const poserBouton = () => {
      const champ = trouverChamp();
      if (!champ || document.getElementById(ID_BOUTON)) return;
      const bouton = document.createElement("button");
      bouton.id = ID_BOUTON;
      bouton.type = "button"; // sans cela, le bouton soumettrait le formulaire
      bouton.className = "bouton-plein-ecran";
      bouton.textContent = "Plein écran";
      bouton.addEventListener("click", basculer);
      champ.prepend(bouton);
    };

    // L'admin monte ses champs après coup, et les remonte en changeant
    // d'onglet ou de langue : on surveille le document plutôt que de poser le
    // bouton une seule fois.
    const observateur = new MutationObserver(poserBouton);
    observateur.observe(document.body, { childList: true, subtree: true });
    poserBouton();

    const surEchap = (e: KeyboardEvent) => {
      if (e.key === "Escape" && document.body.classList.contains("a-un-champ-plein-ecran")) quitter();
    };
    window.addEventListener("keydown", surEchap);

    return () => {
      observateur.disconnect();
      window.removeEventListener("keydown", surEchap);
      document.getElementById(ID_BOUTON)?.removeEventListener("click", basculer);
      quitter();
    };
  }, []);

  return <>{children}</>;
}
