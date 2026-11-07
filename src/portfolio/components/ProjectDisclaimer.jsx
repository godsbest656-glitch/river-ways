export function ProjectDisclaimer({ project, className = "" }) {
  if (!project?.disclaimer) return null;
  return (
    <p className={["rw-project-disclaimer", className].filter(Boolean).join(" ")} role="note">
      {project.disclaimer}
    </p>
  );
}
