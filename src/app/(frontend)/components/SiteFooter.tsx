import SocialIcon, { type Social } from "./SocialIcons";

/* Pied de page commun à l'accueil et aux pages Projets et Programmes : la
   marque, puis les réseaux en icônes, le nom restant lisible par les lecteurs
   d'écran. Un lien vide dans l'admin masque le réseau. */
export default function SiteFooter({ site, contact }: { site: any; contact: any }) {
  const socials = ([
    ["LinkedIn", contact.linkedin],
    ["GitHub", contact.github],
    ["Instagram", contact.instagram],
  ] as [Social, string | undefined][]).filter(([, href]) => href);

  return (
    <footer className="foot">
      <div className="wrap foot-inner">
        <span>© {site.brand} · {new Date().getFullYear()}</span>
        <div className="foot-links">
          {socials.map(([name, href]) => (
            <a className="foot-icon" key={name} href={href} target="_blank" rel="noopener" aria-label={name}>
              <SocialIcon name={name} />
            </a>
          ))}
          {site.footerNote && <span>{site.footerNote}</span>}
        </div>
      </div>
    </footer>
  );
}
