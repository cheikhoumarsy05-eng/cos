import { getPayload } from "payload";
import config from "./payload.config";

const run = async () => {
  const payload = await getPayload({ config });
  const existing = await payload.find({ collection: "experience", limit: 100 });
  await Promise.all(existing.docs.map((doc) =>
    payload.delete({ collection: "experience", id: doc.id })
  ));
  const xp = [
    { when: "Juin–Août 2026 · Août–Oct 2025", role: "Stagiaire Ingénieur — Bureau de Contrôle Technique", org: "SEATEC Sénégal", points: ["Vérification des plans de coffrage et de ferraillage selon le BAEL.", "Vérification des notes de calcul.", "Contrôle qualité sur chantier et rédaction de rapports techniques."] },
    { when: "Août–Sept 2024", role: "Stagiaire Conducteur de Travaux — Plomberie", org: "SENTRA BTP SA", points: ["Suivi des travaux de plomberie sur un programme de 222 villas.", "Supervision des travaux du gros œuvre d'une villa R+3.", "Gestion des approvisionnements et établissement des attachements."] },
    { when: "Juin–Juil 2023", role: "Stagiaire Conducteur de Travaux", org: "SENTRA BTP SA", points: ["Suivi des travaux de fondation d'un immeuble R+7 avec sous-sol.", "Supervision et coordination des équipes sur chantier.", "Gestion des stocks et approvisionnement en matériaux."] },
  ];
  await Promise.all(xp.map((e, order) =>
    payload.create({ collection: "experience", data: { order, when: e.when, role: e.role, org: e.org, points: e.points.map((value) => ({ value })) } })
  ));
  payload.logger.info("Expériences mises à jour.");
  process.exit(0);
};
run().catch((e) => { console.error(e); process.exit(1); });
