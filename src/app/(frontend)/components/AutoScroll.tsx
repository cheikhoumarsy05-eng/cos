"use client";

import { useEffect } from "react";

/**
 * Bandeau continu des rangées qui défilent sur le côté (projets, programmes,
 * travaux de recherche, journal), comme le ruban d'informations en bas d'un
 * écran de télévision : les cartes avancent sans arrêt, à vitesse constante.
 *
 * Pour que la boucle n'ait pas de couture, les cartes sont recopiées une fois
 * à la suite des originales ; quand la première copie atteint le bord, on
 * revient d'une longueur en arrière, ce qui ne se voit pas. Un appui sur une
 * copie est renvoyé à la carte d'origine.
 *
 * Seulement quand la rangée déborde vraiment (téléphone) : sur ordinateur, les
 * cartes sont en grille et rien ne bouge. Le doigt posé sur la rangée la tient,
 * le temps de la faire glisser ou de toucher une carte ; elle repart aussitôt
 * relâchée. Rien ne bouge si l'appareil demande moins d'animations.
 */
const SELECTEUR = ".hscroll .proj-grid, .hscroll .pub-rest, .art-wrap";
const VITESSE = 32; // pixels par seconde
const REPRISE_MS = 1200;

/* Chemin d'un élément depuis la racine d'une carte : rangs successifs parmi les enfants. */
function chemin(racine: Element, el: Element): number[] {
  const rangs: number[] = [];
  let n: Element | null = el;
  while (n && n !== racine) {
    const parent: Element | null = n.parentElement;
    if (!parent) break;
    rangs.unshift(Array.prototype.indexOf.call(parent.children, n));
    n = parent;
  }
  return rangs;
}

function suivre(racine: Element, rangs: number[]): Element | null {
  let n: Element | null = racine;
  for (const r of rangs) n = n?.children[r] ?? null;
  return n;
}

export default function AutoScroll() {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    type Bandeau = { rangee: HTMLElement; originaux: HTMLElement[]; copies: HTMLElement[]; pos: number; tenuJusqua: number; touche: boolean };
    const bandeaux: Bandeau[] = [];
    const nettoyages: (() => void)[] = [];

    const installer = (rangee: HTMLElement): Bandeau | null => {
      const originaux = Array.from(rangee.children) as HTMLElement[];
      if (originaux.length < 2) return null;
      const copies = originaux.map((o) => {
        const c = o.cloneNode(true) as HTMLElement;
        c.setAttribute("aria-hidden", "true");
        c.dataset.copie = "";
        c.querySelectorAll("a, button").forEach((x) => x.setAttribute("tabindex", "-1"));
        rangee.appendChild(c);
        return c;
      });
      rangee.classList.add("is-marquee");
      const b: Bandeau = { rangee, originaux, copies, pos: rangee.scrollLeft, tenuJusqua: 0, touche: false };

      // Un appui sur une copie ouvre la carte d'origine.
      const renvoyer = (e: MouseEvent) => {
        const cible = (e.target as Element).closest("a, button");
        const copie = (e.target as Element).closest("[data-copie]");
        if (!cible || !copie) return;
        e.preventDefault();
        e.stopPropagation();
        const i = copies.indexOf(copie as HTMLElement);
        const origine = suivre(originaux[i], chemin(copie, cible)) as HTMLElement | null;
        origine?.click();
      };
      const tenir = () => { b.touche = true; };
      const lacher = () => { b.touche = false; b.tenuJusqua = performance.now() + REPRISE_MS; b.pos = rangee.scrollLeft; };
      rangee.addEventListener("click", renvoyer, true);
      rangee.addEventListener("pointerdown", tenir, { passive: true });
      rangee.addEventListener("touchstart", tenir, { passive: true });
      window.addEventListener("pointerup", lacher, { passive: true });
      rangee.addEventListener("touchend", lacher, { passive: true });
      rangee.addEventListener("wheel", lacher, { passive: true });
      nettoyages.push(() => {
        rangee.removeEventListener("click", renvoyer, true);
        rangee.removeEventListener("pointerdown", tenir);
        rangee.removeEventListener("touchstart", tenir);
        window.removeEventListener("pointerup", lacher);
        rangee.removeEventListener("touchend", lacher);
        rangee.removeEventListener("wheel", lacher);
        copies.forEach((c) => c.remove());
        rangee.classList.remove("is-marquee");
      });
      return b;
    };

    // Les rangées ne débordent que sur téléphone ; on attend la mise en page.
    document.querySelectorAll<HTMLElement>(SELECTEUR).forEach((r) => {
      if (r.scrollWidth - r.clientWidth > 4) {
        const b = installer(r);
        if (b) bandeaux.push(b);
      }
    });
    if (bandeaux.length === 0) return () => nettoyages.forEach((f) => f());

    let precedent = performance.now();
    let image = 0;
    const tourner = (t: number) => {
      const dt = Math.min(t - precedent, 100) / 1000;
      precedent = t;
      bandeaux.forEach((b) => {
        const { rangee, originaux, copies } = b;
        // Longueur d'un tour : de la première carte à sa copie.
        const tour = copies[0].offsetLeft - originaux[0].offsetLeft;
        if (tour <= 0) return;
        if (b.touche || t < b.tenuJusqua) { b.pos = rangee.scrollLeft; return; }
        b.pos += VITESSE * dt;
        if (b.pos >= tour) b.pos -= tour;
        rangee.scrollLeft = b.pos;
      });
      image = requestAnimationFrame(tourner);
    };
    image = requestAnimationFrame(tourner);

    return () => {
      cancelAnimationFrame(image);
      nettoyages.forEach((f) => f());
    };
  }, []);

  return null;
}
