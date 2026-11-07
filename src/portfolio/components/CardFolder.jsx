import { useId, useMemo, useState } from "react";
import { selectHomeShowcase } from "../selectors.js";
import { ProjectCard } from "./ProjectCard.jsx";

export function CardFolder({
  source,
  limit = 3,
  onProjectSelect,
  heading = "Selected work",
  emptyMessage = "No public projects are available yet."
}) {
  const headingId = useId();
  const panelId = useId();
  const [activeSlug, setActiveSlug] = useState(null);
  const projects = useMemo(() => selectHomeShowcase(source, { limit }), [source, limit]);
  const activeProject = projects.find((project) => project.slug === activeSlug) || null;

  if (!projects.length) return <p className="rw-gallery-empty">{emptyMessage}</p>;

  const chooseProject = (project) => {
    const nextSlug = activeSlug === project.slug ? null : project.slug;
    setActiveSlug(nextSlug);
    if (nextSlug && typeof onProjectSelect === "function") {
      onProjectSelect({ projectId: project.id, slug: project.slug, surface: "card-folder" });
    }
  };

  return (
    <section className="rw-card-folder" aria-labelledby={headingId}>
      <h2 className="rw-card-folder-heading" id={headingId}>{heading}</h2>
      <div className="rw-card-folder-layout">
        <div className="rw-card-folder-tabs" role="group" aria-label="Choose a project">
          {projects.map((project) => {
            const active = project.slug === activeSlug;
            return (
              <button
                key={project.id}
                className="rw-card-folder-tab"
                type="button"
                aria-expanded={active}
                aria-controls={panelId}
                onClick={() => chooseProject(project)}
              >
                <span>{project.title}</span>
                <small>{project.typeLabel}</small>
              </button>
            );
          })}
        </div>
        <div className="rw-card-folder-panel" id={panelId} aria-live="polite">
          {activeProject
            ? <ProjectCard key={activeProject.id} project={activeProject} showServices />
            : <p className="rw-card-folder-empty">Choose a project to open its details.</p>}
        </div>
      </div>
    </section>
  );
}
