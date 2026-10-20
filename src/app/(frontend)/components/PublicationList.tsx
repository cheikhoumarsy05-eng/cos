import type { Dict } from "../lib/i18n";

type SideFact = { id?: string; k: string; v: string; accent?: boolean | null };
type Point = { id?: string; value: string };
type Metric = { id?: string; value: string; label: string };
export type PublicationItem = {
  id?: string;
  title: string;
  sub: string;
  points?: Point[] | null;
  metrics?: Metric[] | null;
  keyResult?: string | null;
  doi: string;
  doiUrl: string;
  sideFacts?: SideFact[] | null;
};

/* `compact` : carte — titre, source, résultat clé et DOI, sans les chiffres
   ni le détail de la démarche. */
function Publication({ item, t, compact }: { item: PublicationItem; t: Dict; compact?: boolean }) {
  return (
    <div className="pub">
      <div>
        <h3 className="pub-title">{item.title}</h3>
        <p className="pub-sub">{item.sub}</p>
        {!compact && (item.metrics ?? []).length > 0 && (
          <dl className="pub-metrics">
            {(item.metrics ?? []).map((m) => (
              <div className="pub-metric" key={m.id ?? m.label}>
                <dt className="pub-metric-v">{m.value}</dt>
                <dd className="pub-metric-k">{m.label}</dd>
              </div>
            ))}
          </dl>
        )}
        {!compact && (
          <ul className="pub-points">
            {(item.points ?? []).map((pt) => (
              <li key={pt.id ?? pt.value}>{pt.value}</li>
            ))}
          </ul>
        )}
        {item.keyResult && (
          <p className="pub-keyresult">
            <span className="pub-keyresult-k">{t.keyResult}</span>
            {item.keyResult}
          </p>
        )}
        <div className="pub-actions">
          <a className="btn btn-primary arrow" href={item.doiUrl} target="_blank" rel="noopener">
            {t.readPublication}
          </a>
          <span className="pub-doi">DOI · {item.doi}</span>
        </div>
      </div>
      {(item.sideFacts ?? []).length > 0 && (
        <div className="pub-side">
          {(item.sideFacts ?? []).map((f) => (
            <div className="row" key={f.id ?? f.k}>
              <div className="k">{f.k}</div>
              <div className={"v" + (f.accent ? " accent" : "")}>{f.v}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Les travaux publiés, tous visibles au scroll, en cartes côte à côte.
 *
 * Ils étaient auparavant derrière un carrousel : deux des trois publications
 * n'étaient alors atteintes que par un clic sur une flèche ou un point, donc
 * vues par une minorité de visiteurs. Les cartes gardent l'essentiel : le
 * résultat clé et le DOI, seule preuve vérifiable par un tiers.
 *
 * Sans état ni écouteur, le composant reste rendu sur le serveur.
 */
export default function PublicationList({ items, t }: { items: PublicationItem[]; t: Dict }) {
  if (items.length === 0) return null;

  return (
    <div className="pub-list">
      <div className="pub-rest">
        {items.map((item, i) => (
          <div className="pub-item pub-card reveal" key={item.id ?? item.title}>
            <p className="pub-head"><span className="pub-num">{String(i + 1).padStart(2, "0")}</span></p>
            <Publication item={item} t={t} compact />
          </div>
        ))}
      </div>
    </div>
  );
}
