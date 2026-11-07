import { useId, useMemo, useState } from "react";
import { CATEGORIES, SERVICES } from "../taxonomy.js";
import { selectFiltered, selectGalleryProjects } from "../selectors.js";
import { stableShuffle } from "../shuffle.js";
import { ProjectCard } from "./ProjectCard.jsx";

export function ShuffleGallery({
  source,
  heading = "Explore the work",
  limit = Infinity,
  onFilterChange,
  onProjectSelect,
  emptyMessage = "No projects match these filters."
}) {
  const headingId = useId();
  const categoryId = useId();
  const serviceId = useId();
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const [seed, setSeed] = useState(0);

  const available = useMemo(() => selectGalleryProjects(source), [source]);
  const categories = CATEGORIES.filter((item) => available.some((project) => project.categories.includes(item.id)));
  const services = SERVICES.filter((item) => available.some((project) => project.services.includes(item.id)));
  const filtered = useMemo(() => selectFiltered(source, {
    category: category || null,
    service: service || null
  }), [source, category, service]);
  const projects = useMemo(() => {
    if (limit !== Infinity && (!Number.isInteger(limit) || limit < 0)) {
      throw new RangeError("limit must be a non-negative integer or Infinity");
    }
    return stableShuffle(filtered, seed).slice(0, limit);
  }, [filtered, seed, limit]);

  const updateCategory = (value) => {
    setCategory(value);
    if (typeof onFilterChange === "function") onFilterChange({ category: value || null, service: service || null });
  };
  const updateService = (value) => {
    setService(value);
    if (typeof onFilterChange === "function") onFilterChange({ category: category || null, service: value || null });
  };
  const clearFilters = () => {
    setCategory("");
    setService("");
    setSeed(0);
    if (typeof onFilterChange === "function") onFilterChange({ category: null, service: null });
  };

  return (
    <section className="rw-shuffle-gallery" aria-labelledby={headingId}>
      <h2 className="rw-shuffle-heading" id={headingId}>{heading}</h2>
      <div className="rw-shuffle-controls">
        <div className="rw-shuffle-filter">
          <label htmlFor={categoryId}>Filter by category</label>
          <select id={categoryId} value={category} onChange={(event) => updateCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
          </select>
        </div>
        <div className="rw-shuffle-filter">
          <label htmlFor={serviceId}>Filter by service</label>
          <select id={serviceId} value={service} onChange={(event) => updateService(event.target.value)}>
            <option value="">All services</option>
            {services.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
          </select>
        </div>
        <button className="rw-shuffle-button" type="button" onClick={() => setSeed((current) => current + 1)}>
          Shuffle order
        </button>
        {(category || service) && <button className="rw-shuffle-clear" type="button" onClick={clearFilters}>Clear filters</button>}
      </div>
      <p className="rw-shuffle-status" role="status" aria-live="polite">{projects.length} projects shown</p>
      {projects.length ? (
        <div className="rw-shuffle-results">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onProjectSelect={onProjectSelect} surface="shuffle-gallery" showServices />
          ))}
        </div>
      ) : <p className="rw-gallery-empty">{emptyMessage}</p>}
    </section>
  );
}
