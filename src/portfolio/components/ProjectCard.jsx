import { getServiceLabel } from "../taxonomy.js";
import { ProjectMedia } from "./ProjectMedia.jsx";
import { ProjectBadge } from "./ProjectBadge.jsx";
import { ProjectDisclaimer } from "./ProjectDisclaimer.jsx";

export function ProjectCard({
  project,
  onProjectSelect,
  surface = "portfolio",
  className = "",
  copyClassName = "",
  disclaimerClassName = "",
  showServices = false
}) {
  if (!project) return null;
  const services = (project.services || []).map(getServiceLabel).filter(Boolean);
  return (
    <article className={["rw-project-card", className].filter(Boolean).join(" ")}>
      <ProjectMedia media={project.media?.cover} />
      <div className={["rw-project-card-copy", copyClassName].filter(Boolean).join(" ")}>
        <ProjectBadge project={project} />
        <h3 className="rw-project-card-title">{project.title}</h3>
        <p className="rw-project-card-summary">{project.summary}</p>
        {showServices && services.length > 0 && (
          <ul className="rw-project-services" aria-label="Related services">
            {services.map((service) => <li className="rw-project-service" key={service}>{service}</li>)}
          </ul>
        )}
        <ProjectDisclaimer project={project} className={disclaimerClassName} />
        {typeof onProjectSelect === "function" && (
          <button
            className="rw-project-action"
            type="button"
            aria-label={"Explore " + project.title}
            onClick={() => onProjectSelect({ projectId: project.id, slug: project.slug, surface })}
          >
            Explore project
          </button>
        )}
      </div>
    </article>
  );
}
