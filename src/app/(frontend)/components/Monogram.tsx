/**
 * Monogramme « COS » de l'en-tête, même dessin que l'icône d'onglet
 * (app/(frontend)/icon.svg) : carré d'encre, initiales claires, le S en
 * orange, et la barre orange du bas — le filet d'accent du site.
 */
export default function Monogram() {
  return (
    <svg className="monogram" viewBox="0 0 64 64" width="34" height="34" aria-hidden="true">
      <rect width="64" height="64" className="monogram-bg" />
      <rect x="0" y="54" width="64" height="10" className="monogram-bar" />
      <text x="32" y="41" textAnchor="middle" className="monogram-txt">
        CO<tspan className="monogram-s">S</tspan>
      </text>
    </svg>
  );
}
