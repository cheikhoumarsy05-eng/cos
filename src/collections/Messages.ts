import type { CollectionConfig } from "payload";

/**
 * Prévient le propriétaire du site qu'un message vient d'arriver.
 *
 * L'adresse de l'expéditeur est placée en `replyTo` : répondre depuis sa
 * boîte écrit donc directement au visiteur, sans repasser par l'admin.
 *
 * Un échec d'envoi ne doit jamais faire échouer l'enregistrement — le
 * message est déjà en base, et le perdre parce que la notification n'est
 * pas partie serait le pire des deux mondes. On journalise et on continue.
 */
const prevenir: CollectionConfig["hooks"] = {
  afterChange: [
    async ({ doc, operation, req }) => {
      if (operation !== "create") return doc;
      const destinataire = process.env.CONTACT_NOTIFY_TO;
      if (!destinataire) {
        req.payload.logger.warn("CONTACT_NOTIFY_TO absente : notification non envoyée.");
        return doc;
      }
      // Sans RESEND_API_KEY, Payload monte son adaptateur « console » : il
      // journalise l'e-mail au lieu de l'envoyer, et ne lève jamais d'erreur.
      // Sans ce garde-fou, la ligne « Notification envoyée » plus bas
      // annoncerait un envoi qui n'a jamais eu lieu.
      if (req.payload.email?.name === "console") {
        req.payload.logger.warn(
          `RESEND_API_KEY absente : aucun e-mail envoyé pour le message #${doc.id}. ` +
            "Le message reste lisible dans l'admin, section Messages.",
        );
        return doc;
      }
      try {
        await req.payload.sendEmail({
          to: destinataire,
          replyTo: `${doc.name} <${doc.email}>`,
          subject: `Portfolio — message de ${doc.name}`,
          text: [
            `Nom    : ${doc.name}`,
            `E-mail : ${doc.email}`,
            `Langue : ${doc.locale ?? "—"}`,
            "",
            doc.message,
          ].join("\n"),
        });
        req.payload.logger.info(`Notification envoyée à ${destinataire} (message #${doc.id}).`);
      } catch (e) {
        req.payload.logger.error({ err: e }, "Échec de la notification par e-mail.");
      }
      return doc;
    },
  ],
};

/**
 * Messages reçus par le formulaire de contact.
 *
 * `create` est ouvert : c'est un formulaire public, il faut bien que le
 * visiteur puisse écrire. En revanche la lecture, la modification et la
 * suppression restent réservées aux comptes connectés — sans quoi n'importe
 * qui pourrait relire les messages adressés au propriétaire du site.
 */
export const Messages: CollectionConfig = {
  slug: "messages",
  labels: { singular: "Message", plural: "Messages" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "createdAt"],
    group: "Contenu",
    description: "Reçus par le formulaire de la section Contact.",
  },
  hooks: prevenir,
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 120, label: "Nom complet" },
    { name: "email", type: "email", required: true, label: "E-mail" },
    { name: "message", type: "textarea", required: true, maxLength: 4000, label: "Message" },
    {
      name: "locale",
      type: "text",
      label: "Langue de la page",
      admin: { readOnly: true, description: "Langue depuis laquelle le message a été envoyé." },
    },
  ],
};
