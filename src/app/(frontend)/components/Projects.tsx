"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { type Project } from "@/data/projects";
import { fmt, type Dict } from "../lib/i18n";
import { Blueprint } from "./Blueprints";

/* Optimized render via next/image (fill + responsive sizes). */
function Render({ src, alt, priority, sizes, contain }: { src: string; alt: string; priority?: boolean; sizes?: string; contain?: boolean }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 820px) 100vw, 50vw"}
      priority={priority}
      style={{ objectFit: contain ? "contain" : "cover" }}
    />
  );
}

/* Le logo GitHub (marque officielle, simplifiée à un seul tracé). */
function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function MediaField({ project, priority, t }: { project: Project; priority?: boolean; t: Dict }) {
  const has = project.images.length > 0;
  return (
    <div className={"proj-frame" + (has ? "" : " blueprint-field")} role="img" aria-label={has ? project.images[0].alt : project.fieldLabel}>
      {has ? <Render src={project.images[0].src} alt={project.images[0].alt} priority={priority} contain={project.program} /> : <Blueprint id={project.id} />}
      {has && <span className="badge">{String(project.images.length).padStart(2, "0")} {project.program ? t.visuals : project.drawings ? t.sheets : t.views}</span>}
      <span className="caption">{project.fieldLabel}</span>
    </div>
  );
}


function ProjectDetail({ project, onClose, t }: { project: Project; onClose: () => void; t: Dict }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const has = project.images.length > 0;
  const count = project.images.length;

  const go = useCallback((d: number) => setActive((i) => Math.min(Math.max(i + d, 0), count - 1)), [count]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && has) go(1);
      if (e.key === "ArrowLeft" && has) go(-1);
    };
    // backdrop click closes (attached imperatively so it stays off non-interactive JSX)
    const onClick = (e: MouseEvent) => { if (e.target === dialog) dialog?.close(); };
    window.addEventListener("keydown", onKey);
    dialog?.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      dialog?.removeEventListener("click", onClick);
      document.body.style.overflow = prev;
    };
  }, [go, has]);

  return (
    <dialog
      className="proj-dialog"
      ref={dialogRef}
      aria-label={fmt(t.projectDialog, { title: project.title })}
      onClose={onClose}
    >
      <div className="proj-detail">
        <div className="detail-head">
          <div>
            <span className="detail-num">{project.index}</span>
            <p className="detail-kind">{project.type}</p>
            <h3 className="detail-title">{project.title}</h3>
          </div>
          <button className="detail-close" onClick={() => dialogRef.current?.close()} aria-label={t.close}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>
        </div>

        {has ? (
          <>
            <div className="stage">
              <Render key={project.images[active].src} src={project.images[active].src} alt={project.images[active].alt} priority sizes="(max-width: 1160px) 100vw, 1120px" contain={project.program} />
              {count > 1 && (
                <>
                  <button className="stage-arrow prev" aria-label={t.previousView} onClick={() => go(-1)} disabled={active === 0}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                  </button>
                  <button className="stage-arrow next" aria-label={t.nextView} onClick={() => go(1)} disabled={active === count - 1}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                  </button>
                </>
              )}
              <span className="stage-count" aria-live="polite">{String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
            </div>
            <div className="thumbs" role="tablist" aria-label={project.drawings ? t.projectSheets : t.projectViews}>
              {project.images.map((img, i) => (
                <button key={img.src} className={"thumb" + (i === active ? " active" : "")} role="tab" aria-selected={i === active} aria-label={fmt(t.viewLabel, { n: i + 1, alt: img.alt })} onClick={() => setActive(i)}>
                  <Render src={img.src} alt="" sizes="120px" contain={project.program} />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="stage stage-blueprint">
            {<Blueprint id={project.id} />}
            <span className="stage-note">{t.onRequest}</span>
          </div>
        )}

        <div className="detail-body">
          <div>
            <p className="detail-desc">{project.desc}</p>
            {(project.features ?? []).length > 0 && (
              <ul className="detail-features" aria-label={t.programFeatures}>
                {project.features!.map((f) => <li key={f}>{f}</li>)}
              </ul>
            )}
          </div>
          <div>
            <div className="detail-specs">
              {project.specs.map((s) => (
                <div className="dspec" key={s.k}><span className="dk">{s.k}</span><span className="dv">{s.v}</span></div>
              ))}
            </div>
            <div className="tag-list">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
            {project.url && (
              <div className="detail-cta">
                <a className="btn btn-outline proj-git-detail" href={project.url} target="_blank" rel="noopener"><GitHubMark />{t.programLink}</a>
              </div>
            )}
            {!has && (
              <div className="detail-cta">
                <a className="btn btn-outline arrow" href={`mailto:cheikhoumarsy05@gmail.com?subject=${encodeURIComponent(fmt(t.requestSubject, { title: project.title }))}`}>{t.requestDrawings}</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}

/* Carte serrée : l'image au-dessus, le type, le titre et le bouton. Sert aux
   projets et programmes secondaires, rangés en grille sous les grandes rangées. */
function CompactCard({ project, onOpen, rowRef, t }: { project: Project; onOpen: (id: string, trigger: HTMLElement) => void; rowRef: (el: HTMLElement | null) => void; t: Dict }) {
  return (
    <article className="proj-card reveal" ref={rowRef}>
      <button className="proj-media proj-media-btn" onClick={(e) => onOpen(project.id, e.currentTarget)} aria-label={fmt(t.openProject, { title: project.title })}>
        <MediaField project={project} t={t} />
      </button>
      <span className="proj-kind">{project.type}</span>
      <button className="proj-title-btn" onClick={(e) => onOpen(project.id, e.currentTarget)} aria-haspopup="dialog">
        <h4>{project.title}</h4>
      </button>
      {project.program && (
        <>
          <p className="proj-card-desc">{project.desc}</p>
          <div className="tag-list">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
        </>
      )}
      <div className="proj-actions">
        <button className="proj-open arrow" onClick={(e) => onOpen(project.id, e.currentTarget)} aria-haspopup="dialog">
          {project.images.length === 0 ? t.seeProject : project.program ? t.seeVisuals : project.drawings ? t.seeDrawings : t.seeRenders}
        </button>
        {project.url && (
          <a className="proj-git" href={project.url} target="_blank" rel="noopener" aria-label={t.programLink}>
            <GitHubMark />
            GitHub
          </a>
        )}
      </div>
    </article>
  );
}

export default function Projects({ projects, t, compact }: { projects: Project[]; t: Dict; compact?: boolean }) {
  const cols = Math.min(projects.length, 3);
  const [openId, setOpenId] = useState<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLElement | null>>({});
  const triggerRef = useRef<HTMLElement | null>(null);
  const open = openId ? projects.find((p) => p.id === openId) ?? null : null;

  const handleOpen = useCallback((id: string, trigger: HTMLElement) => { triggerRef.current = trigger; setOpenId(id); }, []);
  const handleClose = useCallback(() => { setOpenId(null); triggerRef.current?.focus(); }, []);

  useEffect(() => {
    if (!open) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const detail = document.querySelector<HTMLElement>(".proj-detail");
    const fieldRect = rowRefs.current[open.id]?.querySelector(".proj-frame")?.getBoundingClientRect();
    if (!detail || !fieldRect) return;
    const to = detail.getBoundingClientRect();
    const dx = fieldRect.left - to.left, dy = fieldRect.top - to.top;
    const sx = fieldRect.width / to.width, sy = fieldRect.height / to.height;
    detail.animate(
      [{ transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})`, opacity: 0.5 }, { transform: "none", opacity: 1 }],
      { duration: 480, easing: "cubic-bezier(0.16,1,0.3,1)" }
    );
  }, [open]);

  if (compact) {
    return (
      <>
        <div className={"proj-grid proj-grid-" + cols}>
          {projects.map((project) => (
            <CompactCard key={project.id} project={project} onOpen={handleOpen} rowRef={(el) => { rowRefs.current[project.id] = el; }} t={t} />
          ))}
        </div>
        {open && <ProjectDetail project={open} onClose={handleClose} t={t} />}
      </>
    );
  }

  return (
    <>
      <div className="proj-index">
        {projects.map((project, i) => (
          <article className={"proj-row reveal" + (project.featured ? " is-featured" : "")} key={project.id} ref={(el) => { rowRefs.current[project.id] = el; }}>
            <div className="proj-main">
              <div className="proj-head">
                <span className="proj-num">{project.index}</span>
                <span className="proj-kind">{project.type}</span>
              </div>
              <button className="proj-title-btn" onClick={(e) => handleOpen(project.id, e.currentTarget)} aria-haspopup="dialog">
                <h3>{project.title}</h3>
              </button>
              <div className="proj-specs">
                {project.specs.slice(0, 2).map((s) => (
                  <span className="spec" key={s.k}><span className="sk">{s.k}</span><span className="sv">{s.v}</span></span>
                ))}
              </div>
              <p className="proj-desc">{project.desc}</p>
              <div className="proj-foot">
                {/* Les bulles ne restent qu'aux programmes, où elles disent les outils ;
                    sur les projets, le type et les caractéristiques suffisent. */}
                {project.program && <div className="tag-list">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>}
                <div className="proj-actions">
                  <button className="proj-open arrow" onClick={(e) => handleOpen(project.id, e.currentTarget)} aria-haspopup="dialog">
                    {project.images.length === 0 ? t.seeProject : project.program ? t.seeVisuals : project.drawings ? t.seeDrawings : t.seeRenders}
                  </button>
                  {project.url && (
                    <a className="proj-git" href={project.url} target="_blank" rel="noopener" aria-label={t.programLink}>
                      <GitHubMark />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
            <button className="proj-media proj-media-btn" onClick={(e) => handleOpen(project.id, e.currentTarget)} aria-label={fmt(t.openProject, { title: project.title })}>
              <MediaField project={project} priority={i === 0} t={t} />
            </button>
          </article>
        ))}
      </div>
      {open && <ProjectDetail project={open} onClose={handleClose} t={t} />}
    </>
  );
}
