import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { resendAdapter } from "@payloadcms/email-resend";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Projects } from "./collections/Projects";
import { Articles } from "./collections/Articles";
import { Experience } from "./collections/Experience";
import { Freelance } from "./collections/Freelance";
import { Education } from "./collections/Education";
import { Messages } from "./collections/Messages";
import { Hero } from "./globals/Hero";
import { About } from "./globals/About";
import { Publication } from "./globals/Publication";
import { Skills } from "./globals/Skills";
import { Stats } from "./globals/Stats";
import { Expertise } from "./globals/Expertise";
import { Contact } from "./globals/Contact";
import { Site } from "./globals/Site";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Envoi des e-mails.
 *
 * Sert uniquement à te prévenir quand le formulaire de contact reçoit un
 * message. Tant que `RESEND_API_KEY` n'est pas renseignée — en local, par
 * exemple — aucun adaptateur n'est monté : Payload écrit alors les e-mails
 * dans la console au lieu de les envoyer, et rien ne casse.
 */
const email = process.env.RESEND_API_KEY
  ? resendAdapter({
      apiKey: process.env.RESEND_API_KEY,
      defaultFromName: "Portfolio Cheikh Oumar Sy",
      defaultFromAddress: process.env.MAIL_FROM ?? "onboarding@resend.dev",
    })
  : undefined;

export default buildConfig({
  email,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: "· Cheikh Oumar Sy" },
  },
  collections: [Projects, Articles, Experience, Freelance, Education, Messages, Media, Users],
  globals: [Hero, About, Expertise, Publication, Skills, Stats, Contact, Site],
  // Site bilingue : le français reste la langue par défaut, servie sur « / ».
  // `fallback` affiche le texte français tant qu'une traduction anglaise est vide,
  // ce qui évite les trous à l'écran pendant la relecture des traductions.
  localization: {
    locales: [
      { label: "Français", code: "fr" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "fr",
    fallback: true,
  },
  editor: lexicalEditor(),
  // Sharp powers upload image resizing (thumb/wide, webp conversion).
  sharp,
  // Persist media uploads on Vercel Blob (Vercel's filesystem is ephemeral).
  // Enabled only when a Blob token is present, so local dev keeps using the
  // local `staticDir` on disk with no token required.
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || "" },
    // Jamais de push automatique du schéma : cette base est celle de la
    // production. En mode dev, Payload compare le schéma du code à celui de la
    // base et pousse les différences directement, puis inscrit un marqueur
    // "dev" dans payload_migrations. `payload migrate` demande alors une
    // confirmation interactive — ce qui suspend indéfiniment le build Vercel,
    // où il n'y a pas de terminal. Toute évolution du schéma passe donc par
    // une migration explicite (pnpm migrate:create).
    push: false,
  }),
});
