import { useMemo } from "react";
import { selectFeatured, selectGalleryProjects } from "../selectors.js";
import { ProjectCard } from "./ProjectCard.jsx";

export function ScrollGallery({
  source,
  scope,
  limit = Infinity,
  className = "",
  ariaLabel = "Portfolio projects",
  emptyMessage = "No public projects are available yet.",
  cardClassName = "",
  copyClassName = "",
  disclaimerClassName = "",
  showServices = false,
  onProjectSelect
}) {
  const projects = useMemo(() => {
    if (limit !== Infinity && (!Number.isInteger(limit) || limit < 0)) {
      throw new RangeError("limit must be a non-negative integer or Infinity");
    }
    const selected = scope ? selectFeatured(source, scope) : selectGalleryProjects(source);
    return selected.slice(0, limit);
  }, [source, scope, limit]);

  if (!projects.length) return <p className="rw-gallery-empty">{emptyMessage}</p>;

  return (
    <div className={["rw-scroll-gallery", className].filter(Boolean).join(" ")}>
      <div className="rw-scroll-gallery-region" role="region" aria-label={ariaLabel} tabIndex={0}>
        <ul className="rw-scroll-gallery-list">
          {projects.map((project) => (
            <li className="rw-scroll-gallery-item" key={project.id}>
              <ProjectCard
                project={project}
                onProjectSelect={onProjectSelect}
                surface="scroll-gallery"
                className={cardClassName}
                copyClassName={copyClassName}
                disclaimerClassName={disclaimerClassName}
                showServices={showServices}
              />
            </li>
          ))}
        </ul>
      </div>
      <p className="rw-sr-only" aria-live="polite">Showing {projects.length} projects.</p>
    </div>
  );
}
