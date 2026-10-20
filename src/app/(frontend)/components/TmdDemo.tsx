"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fmt, type Dict } from "../lib/i18n";

/*
 * Principe de CIRÉ : un train franchit une travée, et un amortisseur à masse
 * accordée (AMA) réduit la vibration du tablier.
 *
 * Schéma de principe, sans aucune donnée du projet de fin d'études : tablier
 * simple sur deux appuis, premier mode seul, unités réduites. Les essieux sont
 * espacés de façon que leur passage tombe sur la fréquence propre — c'est la
 * résonance que l'AMA doit combattre. L'AMA est représenté par l'amortissement
 * équivalent qu'il apporte au mode (ξ passe de 1 % à 6 %) : suffisant pour
 * montrer l'effet, pas pour dimensionner.
 */
const F = 2; // fréquence propre réduite (Hz)
const OMEGA = 2 * Math.PI * F;
const AXLE_GAP = 0.25; // espacement des essieux, en longueur de travée
const AXLES = 14;
const SPEED = AXLE_GAP * F; // passage d'un essieu par période : résonance
const TRAIN_LEN = AXLE_GAP * (AXLES - 1);
const PASS = (1 + TRAIN_LEN) / SPEED; // temps pour que tout le train ait franchi
const END = 10; // durée totale : le passage (8,5 s), puis l'oscillation libre
const DT = 1 / 400;
const XI_BARE = 0.01;
const XI_TMD = 0.06;

/**
 * Réponse modale sous le convoi, par intégration semi-implicite. On garde la
 * seule partie vibratoire (l'écart à la flèche statique sous le poids des
 * essieux) : c'est elle que l'AMA réduit, et elle seule qui se voit osciller.
 */
function simulate(xi: number) {
  const n = Math.ceil(END / DT);
  const q = new Float32Array(n + 1);
  let x = 0;
  let v = 0;
  for (let i = 0; i < n; i++) {
    const t = i * DT;
    let f = 0;
    for (let a = 0; a < AXLES; a++) {
      const pos = SPEED * t - a * AXLE_GAP; // position de l'essieu sur la travée
      if (pos > 0 && pos < 1) f += Math.sin(Math.PI * pos);
    }
    const acc = f - 2 * xi * OMEGA * v - OMEGA * OMEGA * x;
    v += acc * DT;
    x += v * DT;
    q[i + 1] = x - f / (OMEGA * OMEGA);
  }
  return q;
}

const W = 300; // largeur d'un panneau
const DECK_Y = 70;
const SPAN_X0 = 30;
const SPAN_X1 = 270;

export default function TmdDemo({ t }: { t: Dict }) {
  const bare = useMemo(() => simulate(XI_BARE), []);
  const tmd = useMemo(() => simulate(XI_TMD), []);
  const peak = useMemo(() => bare.reduce((m, v) => Math.max(m, Math.abs(v)), 0), [bare]);
  const peakTmd = useMemo(() => tmd.reduce((m, v) => Math.max(m, Math.abs(v)), 0), [tmd]);
  const reduction = Math.round((1 - peakTmd / peak) * 100);

  const [time, setTime] = useState(0);
  const raf = useRef<number | null>(null);

  const play = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    let t0: number | null = null;
    const step = (now: number) => {
      if (t0 === null) t0 = now;
      const s = (now - t0) / 1000;
      setTime(Math.min(s, END));
      if (s < END) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setTime(PASS * 0.8); return; }
    play();
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [play]);

  const i = Math.min(Math.round(time / DT), bare.length - 1);

  // Trace des deux réponses jusqu'à l'instant courant.
  const PW = 620;
  const PH = 150;
  const trace = (q: Float32Array) => {
    const pts: string[] = [];
    const stepI = 8;
    for (let k = 0; k <= i; k += stepI) {
      const x = ((k * DT) / END) * PW;
      pts.push(`${x.toFixed(1)},${(PH / 2 - (q[k] / peak) * (PH / 2 - 8)).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  return (
    <div className="tmd">
      <p className="osc-lead">{t.tmdLead}</p>
      <div className="tmd-panels">
        {[
          { key: "bare", q: bare, label: t.tmdWithout, withTmd: false },
          { key: "tmd", q: tmd, label: t.tmdWith, withTmd: true },
        ].map(({ key, q, label, withTmd }) => {
          // Flèche à mi-travée, en px : quelques pixels au plus, à l'échelle d'un
          // tablier réel ; c'est la courbe en dessous qui grossit l'écart.
          const amp = (q[i] / peak) * 5;
          const deck = `M ${SPAN_X0} ${DECK_Y} Q ${(SPAN_X0 + SPAN_X1) / 2} ${DECK_Y + 2 * amp} ${SPAN_X1} ${DECK_Y}`;
          const head = SPAN_X0 + (SPEED * time) * (SPAN_X1 - SPAN_X0); // essieu de tête
          return (
            <figure className={"tmd-panel" + (withTmd ? " is-tmd" : "")} key={key}>
              <figcaption className="tmd-label">{label}</figcaption>
              <svg viewBox={`0 0 ${W} 150`} role="img" aria-label={label}>
                <rect x="0" y={DECK_Y + 4} width={SPAN_X0} height="40" className="tmd-abut" />
                <rect x={SPAN_X1} y={DECK_Y + 4} width={W - SPAN_X1} height="40" className="tmd-abut" />
                <line x1="0" y1={DECK_Y} x2={SPAN_X0} y2={DECK_Y} className="tmd-deck" />
                <line x1={SPAN_X1} y1={DECK_Y} x2={W} y2={DECK_Y} className="tmd-deck" />
                <path d={deck} className="tmd-deck" />
                <polygon points={`${SPAN_X0},${DECK_Y + 4} ${SPAN_X0 - 6},${DECK_Y + 14} ${SPAN_X0 + 6},${DECK_Y + 14}`} className="tmd-support" />
                <polygon points={`${SPAN_X1},${DECK_Y + 4} ${SPAN_X1 - 6},${DECK_Y + 14} ${SPAN_X1 + 6},${DECK_Y + 14}`} className="tmd-support" />
                {/* Le train : des voitures dont les essieux suivent le tablier. */}
                {Array.from({ length: AXLES / 2 }, (_, c) => {
                  const xFront = head - c * 2 * AXLE_GAP * (SPAN_X1 - SPAN_X0);
                  const xBack = xFront - AXLE_GAP * (SPAN_X1 - SPAN_X0);
                  const yAt = (x: number) => {
                    if (x < SPAN_X0 || x > SPAN_X1) return DECK_Y;
                    const r = (x - SPAN_X0) / (SPAN_X1 - SPAN_X0);
                    return DECK_Y + 2 * amp * 2 * r * (1 - r);
                  };
                  const yF = yAt(xFront), yB = yAt(xBack);
                  return (
                    <g key={c} className="tmd-car">
                      <polygon points={`${xBack - 6},${yB - 6} ${xFront + 6},${yF - 6} ${xFront + 6},${yF - 22} ${xBack - 6},${yB - 22}`} />
                      <circle cx={xBack} cy={yB - 3} r="3" />
                      <circle cx={xFront} cy={yF - 3} r="3" />
                    </g>
                  );
                })}
                {withTmd && (() => {
                  const mid = (SPAN_X0 + SPAN_X1) / 2;
                  const yDeck = DECK_Y + amp;
                  const yMass = yDeck + 30 - amp * 3; // la masse, plus mobile que le tablier, part en opposition
                  const coils = Array.from({ length: 6 }, (_, k) => `${mid + (k % 2 ? 6 : -6)},${yDeck + 4 + ((yMass - yDeck - 8) * (k + 1)) / 7}`).join(" ");
                  return (
                    <g className="tmd-ama">
                      <polyline points={`${mid},${yDeck + 2} ${coils} ${mid},${yMass - 6}`} />
                      <rect x={mid - 16} y={yMass - 6} width="32" height="16" />
                      <text x={mid} y={yMass + 6} textAnchor="middle">{t.tmdShort}</text>
                    </g>
                  );
                })()}
              </svg>
              <div className="tmd-meter" aria-hidden="true"><span style={{ width: `${Math.min(100, (Math.abs(q[i]) / peak) * 100)}%` }} /></div>
            </figure>
          );
        })}
      </div>
      <svg className="tmd-plot" viewBox={`0 0 ${PW} ${PH}`} role="img" aria-label={t.tmdPlotLabel}>
        <line x1="0" y1={PH / 2} x2={PW} y2={PH / 2} className="osc-axis" />
        <line x1={(PASS / END) * PW} y1="0" x2={(PASS / END) * PW} y2={PH} className="osc-env" />
        <polyline points={trace(bare)} className="tmd-trace-bare" />
        <polyline points={trace(tmd)} className="tmd-trace-tmd" />
      </svg>
      <div className="tmd-legend">
        <span className="tmd-key tmd-key-bare">{t.tmdWithout}</span>
        <span className="tmd-key tmd-key-tmd">{t.tmdWith}</span>
        <button type="button" className="btn btn-outline osc-replay" onClick={play}>{t.demoReplay}</button>
      </div>
      <p className="osc-readout">{fmt(t.tmdReadout, { r: reduction })}</p>
    </div>
  );
}
