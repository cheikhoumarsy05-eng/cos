import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Projects } from "./collections/Projects";
import { Experience } from "./collections/Experience";
import { Freelance } from "./collections/Freelance";
import { Education } from "./collections/Education";
import { Hero } from "./globals/Hero";
import { About } from "./globals/About";
import { Publication } from "./globals/Publication";
import { Skills } from "./globals/Skills";
import { Stats } from "./globals/Stats";
import { Contact } from "./globals/Contact";
import { Site } from "./globals/Site";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: "· Cheikh Oumar Sy" },
  },
  collections: [Projects, Experience, Freelance, Education, Media, Users],
  globals: [Hero, About, Publication, Skills, Stats, Contact, Site],
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
