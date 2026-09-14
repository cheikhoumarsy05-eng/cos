"use client";

import { useState } from "react";
import type { Dict, Locale } from "../lib/i18n";

type Etat = "repos" | "envoi" | "envoye";

/**
 * Formulaire de contact — nom, e-mail, message.
 *
 * Il écrit dans la collection `messages` par l'API REST de Payload, dont la
 * création est ouverte au public ; la lecture, elle, reste réservée aux
 * comptes connectés. Les messages arrivent donc dans l'admin, sans service
 * tiers ni dépendance supplémentaire.
 *
 * Le champ « website » est un piège : invisible et hors du parcours clavier,
 * seul un robot le remplit. S'il est rempli, on fait comme si tout allait
 * bien sans rien enregistrer.
 */
export default function ContactForm({ locale, t }: { locale: Locale; t: Dict }) {
  const [etat, setEtat] = useState<Etat>("repos");
  const [erreur, setErreur] = useState<string | null>(null);

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;           // `currentTarget` est nul après un await
    const f = new FormData(form);
    if (String(f.get("website") ?? "")) { setEtat("envoye"); return; }

    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const message = String(f.get("message") ?? "").trim();
    if (!name || !email || !message) { setErreur(t.formRequired); return; }

    setEtat("envoi"); setErreur(null);
    try {
      const r = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, locale }),
      });
      if (!r.ok) throw new Error(String(r.status));
      form.reset();
      setEtat("envoye");
    } catch {
      setErreur(t.formError);
      setEtat("repos");
    }
  }

  if (etat === "envoye") {
    return (
      <div className="cform">
        <p className="cform-note ok" role="status">{t.formSent}</p>
      </div>
    );
  }

  return (
    <form className="cform" onSubmit={envoyer} noValidate>
      <h3 className="cform-title">{t.formTitle}</h3>

      <div className="cform-field">
        <label className="cform-label" htmlFor="cf-name">{t.formName}</label>
        <input id="cf-name" name="name" type="text" autoComplete="name" maxLength={120} placeholder={t.formNamePlaceholder} required />
      </div>
      <div className="cform-field">
        <label className="cform-label" htmlFor="cf-email">{t.formEmail}</label>
        <input id="cf-email" name="email" type="email" autoComplete="email" placeholder={t.formEmailPlaceholder} required />
      </div>
      <div className="cform-field">
        <label className="cform-label" htmlFor="cf-message">{t.formMessage}</label>
        <textarea id="cf-message" name="message" rows={6} maxLength={4000} placeholder={t.formMessagePlaceholder} required />
      </div>

      <div className="cform-piege" aria-hidden="true">
        <label htmlFor="cf-website">Ne pas remplir</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="cform-actions">
        <button className="btn btn-primary arrow" type="submit" disabled={etat === "envoi"}>
          {etat === "envoi" ? t.formSending : t.formSend}
        </button>
        {erreur && <p className="cform-note ko" role="alert">{erreur}</p>}
      </div>
    </form>
  );
}
