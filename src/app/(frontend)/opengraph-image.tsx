import { ImageResponse } from "next/og";

export const alt = "Cheikh Oumar Sy — Ingénieur Génie Civil, spécialisation structures";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Charte du site (globals.css) : papier crème, encre quasi noire, un seul accent.
const PAPER = "#F2F0EC";
const INK = "#141414";
const ACCENT = "#F0512A";
const STONE = "#615D53";
const ON_INK = "#F2F0EC";
const ON_INK_MUTED = "#B4AEA2";

/**
 * Récupère Archivo (la police d'affichage du site) depuis Google Fonts au
 * moment du build. Satori ne lit pas le woff2 : on demande la feuille de style
 * avec un user-agent ancien pour obtenir une URL TrueType.
 *
 * En cas d'échec on renvoie null et l'image est composée avec la police par
 * défaut — l'image reste correcte, et surtout le build ne casse pas.
 */
async function archivo(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Archivo:wght@${weight}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36" },
    }).then((r) => r.text());
    const url = css.match(/src:\s*url\((https:\/\/[^)]+)\)\s*format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const [black, bold] = await Promise.all([archivo(900), archivo(700)]);
  const fonts = [
    black && { name: "Archivo", data: black, weight: 900 as const, style: "normal" as const },
    bold && { name: "Archivo", data: bold, weight: 700 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 900 | 700; style: "normal" }[];

  const display = fonts.length ? "Archivo" : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          fontFamily: display,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", padding: "64px 72px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: STONE,
            }}
          >
            <span style={{ width: 56, height: 6, background: ACCENT }} />
            Portfolio · Ingénieur Structures
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 28,
              fontSize: 126,
              fontWeight: 900,
              lineHeight: 0.86,
              letterSpacing: -5,
              color: INK,
            }}
          >
            <span>CHEIKH</span>
            <span>OUMAR</span>
            <span style={{ color: ACCENT }}>SY</span>
          </div>
        </div>

        {/* Bande d'encre — reprise des bandeaux pleine largeur du site */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            background: INK,
            padding: "30px 72px 34px",
          }}
        >
          <div style={{ display: "flex", fontSize: 27, fontWeight: 700, color: ON_INK }}>
            Béton armé · Charpente métallique · Dynamique des structures
          </div>
          <div style={{ display: "flex", fontSize: 22, fontWeight: 700, color: ON_INK_MUTED }}>
            Eurocodes &amp; BAEL — Dakar, Sénégal
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
