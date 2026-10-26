"use client";

// Le portfolio n'a pas de service worker. Mais une autre appli servie à la
// même adresse (FitTrack lancé avec `npm run start` sur localhost:3000) en a
// installé un, qui garde les fichiers /_next/static « une fois pour toutes ».
// En développement, il resservirait d'anciennes feuilles de style au portfolio :
// on le retire, avec son cache. En production, rien à faire.

import { useEffect } from "react";

async function removeLeftover() {
  const registrations = await navigator.serviceWorker.getRegistrations();

  if (registrations.length === 0) return;

  await Promise.all(registrations.map((item) => item.unregister()));

  const keys = await caches.keys();

  await Promise.all(keys.map((key) => caches.delete(key)));

  // La page en cours vient peut-être du cache : on la relit, une fois.
  window.location.reload();
}

export default function ServiceWorkerCleanup() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !("serviceWorker" in navigator)) return;

    removeLeftover().catch(() => {
      // Rien à retirer, ou pas le droit : le développement continue.
    });
  }, []);

  return null;
}
