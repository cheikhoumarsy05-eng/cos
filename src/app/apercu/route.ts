import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { headers as entetes } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Ouvre un article en mode brouillon, depuis le bouton « Aperçu » de l'admin.
 *
 * Sans elle, l'aperçu d'un article non publié tombait sur une page introuvable :
 * le site ne lit que les articles publiés, et c'est précisément ce qu'on veut
 * relire avant de publier.
 *
 * L'accès est gardé par la session Payload plutôt que par un jeton partagé
 * dans l'adresse : un jeton se recopie, se colle dans une conversation et
 * finit par circuler. Ici, seul quelqu'un déjà connecté à l'admin peut lire
 * un brouillon, et il n'y a aucun secret à gérer ni à renouveler.
 *
 * Le mode s'arrête à `/apercu/sortie`, pour ne pas rester à lire des
 * brouillons en croyant voir le site public.
 */
export async function GET(requete: Request) {
  const { searchParams } = new URL(requete.url);
  const slug = searchParams.get("slug");
  const langue = searchParams.get("langue") === "en" ? "en" : "fr";

  if (!slug) return new Response("Identifiant d'article manquant.", { status: 400 });

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await entetes() });
  if (!user) {
    return new Response("Aperçu réservé à l'administration. Connectez-vous, puis réessayez.", {
      status: 401,
    });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(langue === "en" ? `/en/articles/${slug}` : `/articles/${slug}`);
}
