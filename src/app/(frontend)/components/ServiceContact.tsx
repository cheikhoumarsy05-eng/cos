"use client";

import { useRef } from "react";
import SocialIcon from "./SocialIcons";
import type { Dict } from "../lib/i18n";

/**
 * Bouton « Demander un service », sous les cartes de la section Mes services.
 *
 * Il ouvre une petite fenêtre (élément <dialog> natif, comme la visionneuse
 * des projets) qui propose les deux canaux : WhatsApp, avec un message déjà
 * amorcé, ou l'e-mail, avec l'objet déjà rempli. Échap, la croix ou un appui
 * sur le fond la referment.
 */
export default function ServiceContact({ phone, email, t }: { phone: string; email: string; t: Dict }) {
  const ref = useRef<HTMLDialogElement>(null);
  const wa = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(t.serviceWaIntro)}`;
  const mail = `mailto:${email}?subject=${encodeURIComponent(t.serviceEmailSubject)}`;

  return (
    <>
      <p className="srv-cta reveal">
        <button type="button" className="btn btn-primary arrow" onClick={() => ref.current?.showModal()}>
          {t.serviceAsk}
        </button>
      </p>
      <dialog
        ref={ref}
        className="srv-dialog"
        aria-labelledby="srv-dialog-titre"
        onClick={(e) => { if (e.target === e.currentTarget) ref.current?.close(); }}
      >
        <div className="srv-dialog-in">
          <button type="button" className="srv-dialog-close" aria-label={t.serviceClose} onClick={() => ref.current?.close()}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <h3 id="srv-dialog-titre" className="srv-dialog-titre">{t.serviceAsk}</h3>
          <p className="srv-dialog-texte">{t.serviceChoose}</p>
          <div className="srv-dialog-choix">
            <a className="srv-choix is-wa" href={wa} target="_blank" rel="noopener">
              <SocialIcon name="WhatsApp" size={26} />
              <span><strong>WhatsApp</strong><small>{t.serviceViaWhatsapp}</small></span>
            </a>
            <a className="srv-choix" href={mail}>
              <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><rect x="3" y="5" width="18" height="14" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M3 6 L12 13 L21 6" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
              <span><strong>{t.serviceEmailLabel}</strong><small>{email}</small></span>
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
