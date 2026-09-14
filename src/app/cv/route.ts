import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Compte une ouverture du CV, puis renvoie vers le PDF.
 *
 * Tous les liens vers le CV passent par la valeur `cvUrl` du CMS, réglée sur
 * « /cv » : cette route est donc le seul chemin vers le fichier, et le
 * compteur ne rate ni le bouton de l'en-tête, ni celui du hero, ni un lien
 * partagé par message.
 *
 * Les Route Handlers ne sont pas mis en cache par défaut — c'est ce qui rend
 * le comptage possible. Une réponse mise en cache ne serait calculée qu'une
 * fois et le compteur resterait figé ; la redirection porte en plus un
 * `Cache-Control: no-store`, pour qu'aucun intermédiaire ne prenne
 * l'initiative de la garder.
 *
 * L'écriture ne doit jamais empêcher la lecture du CV : si la base est
 * injoignable, on journalise et on redirige quand même. Un CV qu'on ne peut
 * pas ouvrir coûterait bien plus cher qu'un compteur incomplet.
 */

/** Le fichier servi. Les liens publics pointent sur « /cv », plus sur ce nom. */
const FICHIER_CV = "/cv-cheikh-oumar-sy.pdf";

/**
 * Robots connus, à ne pas compter. La liste est volontairement courte : elle
 * écarte l'essentiel du bruit — moteurs de recherche et déplieurs de liens des
 * messageries — sans prétendre à l'exhaustivité, impossible à tenir.
 */
const ROBOTS = /bot|crawler|spider|crawling|slurp|facebookexternalhit|preview|headless|monitor|curl|wget|python-requests/i;

export async function GET(request: Request): Promise<Response> {
  const destination = new URL(FICHIER_CV, request.url).toString();
  const redirection = new Response(null, {
    status: 307,
    headers: { Location: destination, "Cache-Control": "no-store" },
  });

  const agent = request.headers.get("user-agent") ?? "";
  if (ROBOTS.test(agent)) return redirection;

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "cv-downloads",
      data: {
        referer: request.headers.get("referer") ?? null,
        country: request.headers.get("x-vercel-ip-country") ?? null,
      },
    });
  } catch (e) {
    console.error("Téléchargement du CV non enregistré :", e);
  }

  return redirection;
}
