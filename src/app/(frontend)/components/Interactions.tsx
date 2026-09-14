"use client";

import { useEffect } from "react";

export default function Interactions() {
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasIO = "IntersectionObserver" in window;
    const timers: number[] = [];
    let revealObserver: IntersectionObserver | null = null;
    let spyObserver: IntersectionObserver | null = null;
    let sectionObserver: IntersectionObserver | null = null;

    /* Sens de défilement : un bloc entre par le bord d'où il arrive. Le faire
       toujours monter donnerait un mouvement à contresens du geste quand on
       remonte la page. */
    let dernierY = window.scrollY;
    let versLeBas = true;

    /* Apparition des blocs.
       Deux seuils, et non un seul : on révèle à 14 % de visibilité, mais on ne
       réarme qu'une fois le bloc entièrement sorti. Avec un seuil unique, un
       arrêt pile sur la limite ferait clignoter le bloc indéfiniment. */
    const SEUIL_ENTREE = 0.14;
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const attentes = new Map<HTMLElement, number>();

    /* Un saut instantané — un lien d'ancre, la restauration de position au
       rechargement — fait arriver les notifications de l'observateur après
       coup, décrivant un état déjà dépassé. S'y fier aveuglément masquerait
       une section pourtant à l'écran, titre découpé compris. On revérifie
       donc la position réelle avant d'agir. */
    const estAEcran = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };

    if (reduce || !hasIO) {
      reveals.forEach((el) => el.classList.add("in"));
    } else {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target as HTMLElement;

            if (entry.intersectionRatio >= SEUIL_ENTREE) {
              if (el.classList.contains("in") || attentes.has(el)) return;
              el.style.setProperty("--dy", versLeBas ? "24px" : "-24px");
              const voisins = Array.from(el.parentElement!.querySelectorAll<HTMLElement>(":scope > .reveal"));
              const rang = voisins.indexOf(el);
              const retard = rang > 0 ? Math.min(rang, 4) * 60 : 0;
              const t = window.setTimeout(() => {
                attentes.delete(el);
                if (estAEcran(el)) el.classList.add("in");
              }, retard);
              attentes.set(el, t);
              timers.push(t);
              return;
            }

            // Sorti de l'écran : on remet le bloc à son état d'attente pour que
            // le passage suivant rejoue l'animation.
            if (!entry.isIntersecting && !estAEcran(el)) {
              const t = attentes.get(el);
              if (t !== undefined) {
                clearTimeout(t);
                attentes.delete(el);
              }
              el.classList.remove("in");
            }
          });
        },
        { threshold: [0, SEUIL_ENTREE], rootMargin: "0px 0px -8% 0px" }
      );
      reveals.forEach((el) => revealObserver!.observe(el));

      /* Section traversée : son numéro s'allume. La marge resserre la zone au
         centre de l'écran, là où se porte la lecture. */
      sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.classList.toggle("section-active", entry.isIntersecting);
          });
        },
        { rootMargin: "-25% 0px -25% 0px" }
      );
      document.querySelectorAll<HTMLElement>("section[id]").forEach((s) => sectionObserver!.observe(s));
    }

    /* sticky nav */
    const nav = document.getElementById("topnav");
    const onScroll = () => {
      const y = window.scrollY;
      if (y !== dernierY) {
        versLeBas = y > dernierY;
        dernierY = y;
      }
      if (nav) nav.classList.toggle("scrolled", y > 16);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* scrollspy */
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav-links a"));
    const map: Record<string, HTMLAnchorElement> = {};
    links.forEach((a) => {
      const id = (a.getAttribute("href") || "").replace("#", "");
      if (document.getElementById(id)) map[id] = a;
    });
    if (hasIO) {
      spyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const id = entry.target.getAttribute("id") || "";
            if (entry.isIntersecting && map[id]) {
              links.forEach((a) => a.classList.remove("active"));
              map[id].classList.add("active");
            }
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      Object.keys(map).forEach((id) => {
        const s = document.getElementById(id);
        if (s) spyObserver!.observe(s);
      });
    }

    /* Menu déroulant de l'en-tête.
       Ce n'est plus une fenêtre modale mais un simple panneau : la page reste
       lisible et défilable derrière, on ne piège donc pas le focus et on ne
       bloque pas le défilement du corps. Il se referme à l'Échap, au clic à
       côté, et en suivant l'un de ses liens. */
    const menu = document.getElementById("overlay-menu");
    const openBtn = document.getElementById("menu-open");
    const estOuvert = () => !!menu?.classList.contains("open");
    const openMenu = () => {
      menu?.classList.add("open");
      menu?.removeAttribute("inert");
      openBtn?.setAttribute("aria-expanded", "true");
      menu?.querySelector<HTMLElement>("a[href]")?.focus();
    };
    const closeMenu = (rendreLeFocus = true) => {
      menu?.classList.remove("open");
      menu?.setAttribute("inert", "");
      openBtn?.setAttribute("aria-expanded", "false");
      if (rendreLeFocus) (openBtn as HTMLElement | null)?.focus();
    };
    const toggleMenu = () => (estOuvert() ? closeMenu() : openMenu());
    const fermerDepuisLien = () => closeMenu(false);
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && estOuvert()) closeMenu();
    };
    // Clic en dehors : ni dans le panneau, ni sur le bouton qui l'a ouvert.
    const onClicAilleurs = (e: MouseEvent) => {
      if (!estOuvert()) return;
      const cible = e.target as Node;
      if (menu?.contains(cible) || openBtn?.contains(cible)) return;
      closeMenu(false);
    };
    const menuLinks = menu ? Array.from(menu.querySelectorAll("a")) : [];
    openBtn?.addEventListener("click", toggleMenu);
    menuLinks.forEach((a) => a.addEventListener("click", fermerDepuisLien));
    window.addEventListener("keydown", onKeydown);
    document.addEventListener("click", onClicAilleurs);

    return () => {
      timers.forEach(clearTimeout);
      revealObserver?.disconnect();
      spyObserver?.disconnect();
      sectionObserver?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeydown);
      openBtn?.removeEventListener("click", toggleMenu);
      menuLinks.forEach((a) => a.removeEventListener("click", fermerDepuisLien));
      document.removeEventListener("click", onClicAilleurs);
    };
  }, []);

  return null;
}
