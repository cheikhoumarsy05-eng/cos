import HomePage from "./components/HomePage";

// La page d'accueil est pré-rendue statiquement pour un temps de réponse court.
// Les modifications du CMS apparaissent immédiatement : chaque collection et
// chaque global a un hook afterChange/afterDelete (src/hooks/revalidateHome.ts)
// qui appelle revalidatePath sur les deux langues à l'enregistrement.
// `revalidate` n'est qu'un filet de sécurité si une écriture contournait ces hooks.
export const revalidate = 3600;

export default function Page() {
  return <HomePage locale="fr" />;
}
