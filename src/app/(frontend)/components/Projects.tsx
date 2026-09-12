"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { type Project } from "@/data/projects";
import { fmt, type Dict } from "../lib/i18n";
import { Blueprint } from "./Blueprints";

/* Optimized render via next/image (fill + responsive sizes). */
function Render({ src, alt, priority, sizes }: { src: string; alt: string; priority?: boolean; sizes?: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 820px) 100vw, 50vw"}
      priority={priority}
      style={{ objectFit: "cover" }}
    />
  );
}

function MediaField({ project, priority, t }: { project: Project; priority?: boolean; t: Dict }) {
  const has = project.images.length > 0;
  return (
    <div className={"proj-frame" + (has ? "" : " blueprint-field")} role="img" aria-label={has ? project.images[0].alt : project.fieldLabel}>
      {has ? <Render src={project.images[0].src} alt={project.images[0].alt} priority={priority} /> : <Blueprint id={project.id} />}
      {has && <span className="badge">{String(project.images.length).padStart(2, "0")} {t.views}</span>}
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
              <Render key={project.images[active].src} src={project.images[active].src} alt={project.images[active].alt} priority sizes="(max-width: 1160px) 100vw, 1120px" />
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
            <div className="thumbs" role="tablist" aria-label={t.projectViews}>
              {project.images.map((img, i) => (
                <button key={img.src} className={"thumb" + (i === active ? " active" : "")} role="tab" aria-selected={i === active} aria-label={fmt(t.viewLabel, { n: i + 1, alt: img.alt })} onClick={() => setActive(i)}>
                  <Render src={img.src} alt="" sizes="120px" />
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
          <p className="detail-desc">{project.desc}</p>
          <div>
            <div className="detail-specs">
              {project.specs.map((s) => (
                <div className="dspec" key={s.k}><span className="dk">{s.k}</span><span className="dv">{s.v}</span></div>
              ))}
            </div>
            <div className="tag-list">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
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

export default function Projects({ projects, t }: { projects: Project[]; t: Dict }) {
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
                <div className="tag-list">{project.tags.slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
                <button className="proj-open arrow" onClick={(e) => handleOpen(project.id, e.currentTarget)} aria-haspopup="dialog">
                  {project.images.length > 0 ? t.seeRenders : t.seeProject}
                </button>
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
