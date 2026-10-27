/**
 * Icônes au trait des cartes « Mes services », même famille que `SkillIcons`.
 *
 * Elles se choisissent d'après le titre saisi dans le CMS — un service
 * renommé garde son icône tant qu'il parle de la même chose. Un titre qui ne
 * correspond à rien reçoit l'icône du calcul plutôt qu'aucune.
 */
const ICONS = {
  // Formation : un tableau et son pied.
  formation: (
    <>
      <rect x="3" y="4" width="18" height="12" />
      <polyline points="6,12 9,9 12,11 17,7" />
      <line x1="12" y1="16" x2="12" y2="20" />
      <line x1="8" y1="21" x2="16" y2="21" />
    </>
  ),
  // Plans d'exécution : une planche, une poutre et ses armatures.
  plans: (
    <>
      <rect x="3" y="3" width="18" height="18" />
      <rect x="6" y="8" width="12" height="6" />
      <line x1="7.5" y1="12.5" x2="16.5" y2="12.5" />
      <line x1="9" y1="8" x2="9" y2="14" />
      <line x1="12" y1="8" x2="12" y2="14" />
      <line x1="15" y1="8" x2="15" y2="14" />
      <line x1="13" y1="18" x2="18" y2="18" />
    </>
  ),
  // Examen de plans : une planche sous la loupe.
  examen: (
    <>
      <polyline points="14,3 3,3 3,21 11,21" />
      <line x1="6" y1="8" x2="11" y2="8" />
      <line x1="6" y1="12" x2="9" y2="12" />
      <circle cx="16" cy="14" r="4.5" />
      <line x1="19.2" y1="17.2" x2="22" y2="20" />
      <polyline points="14,14 15.5,15.5 18,12.5" />
    </>
  ),
  // Contrôle et suivi de chantier : un casque.
  controle: (
    <>
      <path d="M4 16 a8 8 0 0 1 16 0" />
      <line x1="2.5" y1="16" x2="21.5" y2="16" />
      <path d="M10 8.5 V5 h4 v3.5" />
      <polyline points="9,19.5 11,21 15,18" />
    </>
  ),
  // Calcul : un portique chargé.
  calcul: (
    <>
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="11" x2="21" y2="11" />
      <line x1="6" y1="11" x2="6" y2="21" />
      <line x1="18" y1="11" x2="18" y2="21" />
      <polyline points="9,3 12,6 15,3" />
    </>
  ),
};

function choisir(titre: string): keyof typeof ICONS {
  const t = titre.toLowerCase();
  if (/forma|train|cours|enseign/.test(t)) return "formation";
  if (/examen|v[ée]rif|revue|review/.test(t)) return "examen";
  if (/contr[ôo]le|suivi|chantier|conformit|inspect|supervis/.test(t)) return "controle";
  if (/plan|ferraill|coffrage|dessin|drawing|concept|design/.test(t)) return "plans";
  return "calcul";
}

export default function ServiceIcon({ title }: { title: string }) {
  return (
    <span className="srv-ic" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="30" height="30">{ICONS[choisir(title)]}</svg>
    </span>
  );
}
