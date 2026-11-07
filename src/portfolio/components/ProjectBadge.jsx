const TRUTH_LABELS = {
  delivered: "Delivered",
  illustrative: "Illustrative",
  "not-delivered": "Not delivered",
  planned: "Planned"
};

export function ProjectBadge({ project }) {
  if (!project) return null;
  const truth = TRUTH_LABELS[project.deliveryTruth] || "Project";
  return (
    <div className="rw-project-badges" role="group" aria-label="Project classification">
      <span className="rw-project-badge rw-project-type">{project.typeLabel}</span>
      <span className="rw-project-badge rw-project-truth">{truth}</span>
    </div>
  );
}
