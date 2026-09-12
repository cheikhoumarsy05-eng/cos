"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SideFact = { id?: string; k: string; v: string; accent?: boolean | null };
type Point = { id?: string; value: string };
export type PublicationItem = {
  id?: string;
  title: string;
  sub: string;
  points?: Point[] | null;
  doi: string;
  doiUrl: string;
  sideFacts?: SideFact[] | null;
};

function Article({ item }: { item: PublicationItem }) {
  return (
    <div className="pub">
      <div>
        <h3 className="pub-title">{item.title}</h3>
        <p className="pub-sub">{item.sub}</p>
        <ul className="pub-points">
          {(item.points ?? []).map((pt) => (
            <li key={pt.id ?? pt.value}>{pt.value}</li>
          ))}
        </ul>
        <div className="pub-actions">
          <a className="btn btn-primary arrow" href={item.doiUrl} target="_blank" rel="noopener">
            Lire la publication
          </a>
          <span className="pub-doi">DOI · {item.doi}</span>
        </div>
      </div>
      <div className="pub-side">
        {(item.sideFacts ?? []).map((f) => (
          <div className="row" key={f.id ?? f.k}>
            <div className="k">{f.k}</div>
            <div className={"v" + (f.accent ? " accent" : "")}>{f.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PublicationCarousel({ items }: { items: PublicationItem[] }) {
  const [active, setActive] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const count = items.length;
  const multiple = count > 1;

  const go = useCallback(
    (d: number) => setActive((i) => (i + d + count) % count),
    [count],
  );

  // Height the viewport to the active slide so shorter slides leave no blank gap.
  useEffect(() => {
    if (!multiple) return;
    const viewport = viewportRef.current;
    const measure = () => {
      const slide = slideRefs.current[active];
      if (viewport && slide) viewport.style.height = `${slide.offsetHeight}px`;
    };
    measure();
    const ro = new ResizeObserver(measure);
    slideRefs.current.forEach((s: HTMLDivElement | null) => s && ro.observe(s));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [active, multiple]);

  useEffect(() => {
    if (!multiple) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, multiple]);

  if (count === 0) return null;
  if (!multiple) {
    return (
      <div className="pub-carousel reveal">
        <Article item={items[0]} />
      </div>
    );
  }

  return (
    <div className="pub-carousel reveal" role="group" aria-roledescription="carrousel" aria-label="Publications">
      <div className="pub-viewport" ref={viewportRef}>
        <div className="pub-track" style={{ transform: `translateX(-${active * 100}%)` }}>
          {items.map((item, i) => (
            <div
              className="pub-slide"
              key={item.id ?? item.title}
              ref={(el) => { slideRefs.current[i] = el; }}
              aria-hidden={i !== active}
              inert={i !== active ? true : undefined}
            >
              <Article item={item} />
            </div>
          ))}
        </div>
      </div>

      <div className="pub-nav">
        <button className="pub-arrow" aria-label="Publication précédente" onClick={() => go(-1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
        <div className="pub-dots" role="tablist" aria-label="Choisir une publication">
          {items.map((item, i) => (
            <button
              key={item.id ?? item.title}
              className={"pub-dot" + (i === active ? " active" : "")}
              role="tab"
              aria-selected={i === active}
              aria-label={`Publication ${i + 1} : ${item.title}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
        <span className="pub-count" aria-live="polite">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <button className="pub-arrow" aria-label="Publication suivante" onClick={() => go(1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
