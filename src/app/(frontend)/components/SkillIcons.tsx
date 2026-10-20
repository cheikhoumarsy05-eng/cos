/**
 * Petites icônes au trait des domaines de compétences, dans le style des
 * plans de `Blueprints` : un trait fin, sans remplissage, qui se dessine
 * quand le tableau apparaît (voir `.skills-ic` dans globals.css).
 *
 * Elles suivent l'ordre des domaines saisis dans le CMS : calcul, plans,
 * contrôle, analyse, numérique, économie. Un domaine ajouté au-delà n'a pas
 * d'icône plutôt qu'une icône qui ne lui correspondrait pas.
 */
const ICONS = [
  // Calcul et dimensionnement : un portique chargé.
  <>
    <line x1="3" y1="7" x2="21" y2="7" />
    <line x1="3" y1="11" x2="21" y2="11" />
    <line x1="6" y1="11" x2="6" y2="21" />
    <line x1="18" y1="11" x2="18" y2="21" />
    <polyline points="9,3 12,6 15,3" />
  </>,
  // Plans et documentation : une planche et son cartouche.
  <>
    <rect x="3" y="4" width="18" height="16" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="10" y1="4" x2="10" y2="20" />
    <line x1="14" y1="14" x2="18" y2="14" />
  </>,
  // Contrôle et vérification : une loupe et une coche.
  <>
    <circle cx="10" cy="10" r="6" />
    <line x1="14.5" y1="14.5" x2="21" y2="21" />
    <polyline points="7,10 9.5,12.5 13,8" />
  </>,
  // Analyse des structures : une oscillation amortie.
  <>
    <path d="M2 12 C5 4, 7 4, 9 12 S13 20, 16 12 S20 6, 22 12" />
  </>,
  // Calcul scientifique et numérique : du code.
  <>
    <polyline points="8,6 3,12 8,18" />
    <polyline points="16,6 21,12 16,18" />
    <line x1="13.5" y1="5" x2="10.5" y2="19" />
  </>,
  // Économie de la construction : une calculatrice.
  <>
    <rect x="5" y="3" width="14" height="18" />
    <line x1="8" y1="7" x2="16" y2="7" />
    <line x1="8" y1="12" x2="10" y2="12" />
    <line x1="14" y1="12" x2="16" y2="12" />
    <line x1="8" y1="16" x2="10" y2="16" />
    <line x1="14" y1="16" x2="16" y2="16" />
  </>,
];

export default function SkillIcon({ index }: { index: number }) {
  const shapes = ICONS[index];
  if (!shapes) return null;
  return (
    <span className="skills-ic" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22">{shapes}</svg>
    </span>
  );
}
