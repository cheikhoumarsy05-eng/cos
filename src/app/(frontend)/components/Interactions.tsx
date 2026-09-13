"use client";

import { useEffect } from "react";

export default function Interactions() {
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasIO = "IntersectionObserver" in window;
    const timers: number[] = [];
    let revealObserver: IntersectionObserver | null = null;
    let spyObserver: IntersectionObserver | null = null;

    /* reveals */
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (reduce || !hasIO) {
      reveals.forEach((el) => el.classList.add("in"));
    } else {
      revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const sibs = Array.from(el.parentElement!.querySelectorAll<HTMLElement>(":scope > .reveal"));
            const idx = sibs.indexOf(el);
            const delay = idx > 0 ? Math.min(idx, 5) * 90 : 0;
            timers.push(window.setTimeout(() => el.classList.add("in"), delay));
            obs.unobserve(el);
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
      );
      reveals.forEach((el) => revealObserver!.observe(el));
    }

    /* sticky nav */
    const nav = document.getElementById("topnav");
    const onScroll = () => { if (nav) nav.classList.toggle("scrolled", window.scrollY > 16); };
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
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeydown);
      openBtn?.removeEventListener("click", toggleMenu);
      menuLinks.forEach((a) => a.removeEventListener("click", fermerDepuisLien));
      document.removeEventListener("click", onClicAilleurs);
    };
  }, []);

  return null;
}
