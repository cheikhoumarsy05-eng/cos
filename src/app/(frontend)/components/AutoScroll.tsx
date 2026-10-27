"use client";

import { useEffect } from "react";

/**
 * Carrousel des rangées qui défilent sur le côté (projets, programmes,
 * travaux de recherche, journal) : toutes les 3 secondes, la rangée glisse
 * d'une carte vers la gauche, puis marque l'arrêt. Deux petites flèches, à
 * mi-hauteur des cartes sur les bords, montrent le sens et permettent
 * d'avancer ou de reculer à la main ; le compte des 3 secondes repart après
 * chaque appui.
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
const PAUSE_MS = 3000;   // arrêt sur chaque carte
const GLISSE_MS = 600;   // durée du glissement d'une carte à la suivante
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

    type Bandeau = {
      rangee: HTMLElement; originaux: HTMLElement[]; copies: HTMLElement[];
      pos: number; tenuJusqua: number; touche: boolean;
      // Glissement en cours : de `depart` à `cible`, commencé à `debut`.
      depart: number; cible: number; debut: number; prochain: number;
      demande: -1 | 0 | 1; // flèche appuyée, traitée à l'image suivante
    };
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
      const b: Bandeau = {
        rangee, originaux, copies, pos: rangee.scrollLeft, tenuJusqua: 0, touche: false,
        depart: 0, cible: -1, debut: 0, prochain: performance.now() + PAUSE_MS, demande: 0,
      };

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
      const lacher = () => {
        if (!b.touche) return; // un appui ailleurs sur la page ne concerne pas cette rangée
        b.touche = false; b.cible = -1; b.pos = rangee.scrollLeft;
        b.tenuJusqua = performance.now() + REPRISE_MS;
        b.prochain = b.tenuJusqua + PAUSE_MS;
      };
      /* Flèches gauche / droite. Elles vivent dans un ruban de hauteur nulle
         posé juste après la rangée (sans toucher aux nœuds de React), et
         remontent de la moitié de sa hauteur, tenue à jour par l'observateur. */
      const en = document.documentElement.lang === "en";
      const nav = document.createElement("div");
      nav.className = "rangee-nav";
      const fleche = (dir: -1 | 1) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "rangee-fleche " + (dir < 0 ? "prev" : "next");
        btn.setAttribute("aria-label", dir < 0 ? (en ? "Previous" : "Précédent") : (en ? "Next" : "Suivant"));
        btn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${dir < 0 ? "M15 5 L8 12 L15 19" : "M9 5 L16 12 L9 19"}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
        btn.addEventListener("click", () => { b.demande = dir; });
        nav.appendChild(btn);
      };
      fleche(-1);
      fleche(1);
      rangee.after(nav);
      const mesurer = () => nav.style.setProperty("--mi", `${rangee.offsetHeight / 2}px`);
      mesurer();
      const obs = new ResizeObserver(mesurer);
      obs.observe(rangee);
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
        obs.disconnect();
        nav.remove();
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

    /* Positions d'arrêt : le bord gauche de chaque colonne de cartes, copies
       comprises. Les cartes d'une grille sur plusieurs rangs partagent leur
       abscisse, d'où le dédoublonnage. */
    const arrets = (b: Bandeau) => {
      const x0 = b.originaux[0].offsetLeft;
      const xs = Array.from(b.rangee.children as HTMLCollectionOf<HTMLElement>).map((c) => c.offsetLeft - x0);
      return Array.from(new Set(xs)).sort((a, c) => a - c);
    };
    const adoucir = (x: number) => 1 - Math.pow(1 - x, 3);

    let image = 0;
    const tourner = (t: number) => {
      bandeaux.forEach((b) => {
        const { rangee, originaux, copies } = b;
        // Longueur d'un tour : de la première carte à sa copie.
        const tour = copies[0].offsetLeft - originaux[0].offsetLeft;
        if (tour <= 0) return;
        if (b.touche) { b.pos = rangee.scrollLeft; return; }

        // Une flèche appuyée l'emporte sur l'attente, et sur un glissement en cours.
        let dir: -1 | 0 | 1 = 0;
        if (b.demande) { dir = b.demande; b.demande = 0; b.tenuJusqua = 0; if (b.cible >= 0) b.pos = b.cible; b.cible = -1; }
        else if (t < b.tenuJusqua) { b.pos = rangee.scrollLeft; return; }
        else if (b.cible < 0 && t >= b.prochain) dir = 1;

        if (dir) {
          // On se ramène dans le premier tour : au bord pour avancer, une
          // longueur plus loin pour reculer depuis la première carte.
          if (b.pos >= tour) b.pos -= tour;
          if (dir < 0 && b.pos < 2) b.pos += tour;
          rangee.scrollLeft = b.pos;
          const xs = arrets(b);
          const vise = dir > 0 ? xs.find((x) => x > b.pos + 2) : xs.reverse().find((x) => x < b.pos - 2);
          if (vise === undefined) return;
          b.depart = b.pos; b.cible = vise; b.debut = t;
        }
        if (b.cible < 0) return;

        const k = Math.min((t - b.debut) / GLISSE_MS, 1);
        b.pos = b.depart + (b.cible - b.depart) * adoucir(k);
        if (k >= 1) {
          b.pos = b.cible; b.cible = -1; b.prochain = t + PAUSE_MS;
          if (b.pos >= tour) b.pos -= tour; // la copie atteint le bord : retour invisible
        }
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
