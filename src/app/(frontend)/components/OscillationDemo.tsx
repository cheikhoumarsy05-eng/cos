"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fmt, type Dict } from "../lib/i18n";

/*
 * Oscillation libre d'un portique en béton armé, sur son premier mode.
 *
 * Le déplacement du dernier niveau suit u(t) = u0·e^(−ξωt)·cos(ω_d·t), et chaque
 * niveau k se déplace de u·k/N (déformée du premier mode prise linéaire). La
 * période vient de la formule forfaitaire T ≈ 0,1·N s, suffisante pour une
 * démonstration : ce n'est pas le programme lui-même, seulement son principe.
 *
 * L'animation est ralentie (facteur SLOW) pour que l'œil suive les cycles.
 */
const SLOW = 6;
const DURATION = 4; // secondes de temps physique tracées
const W = 560;
const H = 240;

export default function OscillationDemo({ t }: { t: Dict }) {
  const num = (v: number, d = 1) => v.toLocaleString(t.numLocale, { maximumFractionDigits: d });
  const [xi, setXi] = useState(2); // amortissement en %
  const [levels, setLevels] = useState(2); // R+1 … R+4 → 2 à 5 niveaux de planchers
  const [time, setTime] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef<number | null>(null);

  const T = 0.1 * levels;
  const w = (2 * Math.PI) / T;
  const z = xi / 100;
  const wd = w * Math.sqrt(1 - z * z);
  const u = useCallback((s: number) => Math.exp(-z * w * s) * Math.cos(wd * s), [z, w, wd]);

  const play = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    start.current = null;
    const step = (now: number) => {
      if (start.current === null) start.current = now;
      const s = (now - start.current) / 1000 / SLOW;
      setTime(Math.min(s, DURATION));
      if (s < DURATION) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, []);

  // Relance à chaque réglage ; sans animation si le visiteur l'a demandé.
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setTime(0); return; }
    play();
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [xi, levels, play]);

  // Courbe u(t) sur toute la durée, et son enveloppe.
  const curve = useMemo(() => {
    const pts: string[] = [];
    const env: string[] = [];
    for (let i = 0; i <= 400; i++) {
      const s = (i / 400) * DURATION;
      const x = (s / DURATION) * W;
      pts.push(`${x.toFixed(1)},${(H / 2 - u(s) * (H / 2 - 12)).toFixed(1)}`);
      env.push(`${x.toFixed(1)},${(H / 2 - Math.exp(-z * w * s) * (H / 2 - 12)).toFixed(1)}`);
    }
    return { pts: pts.join(" "), env: env.join(" "), envLow: env.map((p) => { const [x, y] = p.split(","); return `${x},${(H - Number(y)).toFixed(1)}`; }).join(" ") };
  }, [u, z, w]);

  // Portique : N niveaux de 34 px, deux travées.
  const storey = 44;
  const frameH = levels * storey;
  const amp = 26 * u(time);
  const base = 230;
  const cols = [40, 110, 180];
  const floors = Array.from({ length: levels }, (_, k) => k + 1);
  const dx = (k: number) => (amp * k) / levels;

  const cycles = Math.round(Math.log(10) / (z * w) / T * 10) / 10; // cycles pour décroître de 90 %

  return (
    <div className="osc">
      <p className="osc-lead">{t.demoLead}</p>
      <div className="osc-body">
        <svg className="osc-frame" viewBox={`0 ${base - frameH - 16} 220 ${frameH + 26}`} role="img" aria-label={fmt(t.demoFrameLabel, { n: levels - 1 })}>
          <line x1="20" y1={base} x2="200" y2={base} className="osc-ground" />
          {cols.map((x) => (
            <g key={x}>
              {floors.map((k) => (
                <line key={k} x1={x + dx(k - 1)} y1={base - (k - 1) * storey} x2={x + dx(k)} y2={base - k * storey} className="osc-col" />
              ))}
            </g>
          ))}
          {floors.map((k) => (
            <line key={k} x1={cols[0] + dx(k) - 6} y1={base - k * storey} x2={cols[2] + dx(k) + 6} y2={base - k * storey} className="osc-beam" />
          ))}
          <line x1={cols[2] + 16} y1={base - frameH} x2={cols[2] + 16 + dx(levels)} y2={base - frameH} className="osc-arrow" />
        </svg>
        <svg className="osc-plot" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.demoPlotLabel}>
          <line x1="0" y1={H / 2} x2={W} y2={H / 2} className="osc-axis" />
          <polyline points={curve.env} className="osc-env" />
          <polyline points={curve.envLow} className="osc-env" />
          <polyline points={curve.pts} className="osc-curve" />
          <circle cx={(time / DURATION) * W} cy={H / 2 - u(time) * (H / 2 - 12)} r="5" className="osc-dot" />
        </svg>
      </div>
      <div className="osc-controls">
        <label className="osc-ctrl">
          <span>{t.demoDamping} <i className="osc-sym">ξ</i> <b>{num(xi)} %</b></span>
          <input type="range" aria-label={`${t.demoDamping} ξ`} min="0.5" max="10" step="0.5" value={xi} onChange={(e) => setXi(Number(e.target.value))} />
        </label>
        <label className="osc-ctrl">
          <span>{t.demoStoreys} <b>R+{levels - 1}</b></span>
          <input type="range" aria-label={t.demoStoreys} aria-valuetext={`R+${levels - 1}`} min="2" max="5" step="1" value={levels} onChange={(e) => setLevels(Number(e.target.value))} />
        </label>
        <button type="button" className="btn btn-outline osc-replay" onClick={play}>{t.demoReplay}</button>
      </div>
      <p className="osc-readout">{fmt(t.demoReadout, { T: num(T), n: num(cycles) })}</p>
    </div>
  );
}
