import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/** Quitte le mode brouillon et revient au site public. */
export async function GET(requete: Request) {
  const { searchParams } = new URL(requete.url);
  const retour = searchParams.get("retour");
  const draft = await draftMode();
  draft.disable();
  // On ne suit que des chemins internes : une adresse venue de l'extérieur
  // ferait de cette route un tremplin vers n'importe quel site.
  redirect(retour && retour.startsWith("/") ? retour : "/");
}
