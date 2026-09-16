import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Compteurs de lecture d'un article : vues et « j'aime ».
 *
 * Servis hors de `/api`, entièrement réservé à Payload : une route posée là
 * serait captée par son routeur avant d'arriver ici.
 *
 * Ces chiffres bougent en permanence alors que les pages d'articles sont
 * prégénérées et gardées une heure. Ils ne peuvent donc pas être rendus avec
 * la page : le navigateur vient les chercher après coup, ce qui laisse le
 * texte arriver en statique — immédiat — et les compteurs suivre.
 *
 * Aucune donnée personnelle n'est conservée : ni adresse, ni empreinte, ni
 * identifiant. Deux totaux par article, rien de plus. Le garde-fou contre les
 * rafraîchissements répétés vit donc dans le navigateur du lecteur, seul
 * endroit où l'on puisse le tenir sans le suivre.
 */

/** Réponse commune, jamais mise en cache : ces nombres changent sans cesse. */
function repondre(donnees: unknown, statut = 200) {
  return Response.json(donnees, {
    status: statut,
    headers: { "Cache-Control": "no-store" },
  });
}

/** La ligne de statistiques d'un article, créée au premier passage. */
async function ligneStats(slug: string) {
  const payload = await getPayload({ config });
  const trouve = await payload.find({
    collection: "article-stats",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  if (trouve.docs[0]) return { payload, doc: trouve.docs[0] as any };

  const cree = await payload.create({
    collection: "article-stats",
    data: { slug, views: 0, likes: 0 },
  });
  return { payload, doc: cree as any };
}

export async function GET(_requete: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const { doc } = await ligneStats(slug);
    return repondre({ views: doc.views ?? 0, likes: doc.likes ?? 0 });
  } catch (e) {
    console.error("Statistiques illisibles :", e);
    // Un compteur indisponible ne doit pas casser la lecture : on renvoie zéro.
    return repondre({ views: 0, likes: 0 });
  }
}

/**
 * Enregistre une vue ou un « j'aime ».
 *
 * Le corps porte l'action : `{ action: "vue" | "jaime" | "retirer-jaime" }`.
 * Les totaux sont relus juste avant d'être écrits, ce qui suffit à l'échelle
 * d'un portfolio — deux lectures simultanées du même article resteraient
 * comptées une fois, et c'est sans conséquence.
 */
export async function POST(requete: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const corps = (await requete.json().catch(() => ({}))) as { action?: string };
    const action = corps.action;
    if (action !== "vue" && action !== "jaime" && action !== "retirer-jaime") {
      return repondre({ erreur: "action inconnue" }, 400);
    }

    const { payload, doc } = await ligneStats(slug);
    const vues = Number(doc.views ?? 0);
    const jaime = Number(doc.likes ?? 0);

    const data =
      action === "vue"
        ? { views: vues + 1 }
        : action === "jaime"
          ? { likes: jaime + 1 }
          : { likes: Math.max(0, jaime - 1) };

    const maj = (await payload.update({
      collection: "article-stats",
      id: doc.id,
      data,
    })) as any;

    return repondre({ views: maj.views ?? 0, likes: maj.likes ?? 0 });
  } catch (e) {
    console.error("Compteur non enregistré :", e);
    return repondre({ erreur: "indisponible" }, 500);
  }
}
