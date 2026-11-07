import { FEATURED_SCOPES } from "./taxonomy.js";

function publicProjects(source) {
  if (source && typeof source.listPublic === "function") return source.listPublic();
  if (Array.isArray(source)) {
    return source.filter((project) => project.visibility === "public" && project.status === "published");
  }
  return [];
}

function values(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function validateLimit(limit) {
  if (limit !== Infinity && (!Number.isInteger(limit) || limit < 0)) {
    throw new RangeError("limit must be a non-negative integer or Infinity");
  }
  return limit;
}

export function selectGalleryProjects(source, { limit = Infinity, excludeIds = [] } = {}) {
  validateLimit(limit);
  const excluded = new Set(excludeIds);
  return publicProjects(source)
    .filter((project) => !excluded.has(project.id))
    .slice()
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
    .slice(0, limit);
}

export function selectFiltered(source, filters = {}) {
  const categories = values(filters.categories ?? filters.category);
  const services = values(filters.services ?? filters.service);
  const types = values(filters.types ?? filters.type);
  const tags = values(filters.tags ?? filters.tag);

  return selectGalleryProjects(source).filter((project) => {
    if (categories.length && !categories.some((value) => project.categories.includes(value))) return false;
    if (services.length && !services.some((value) => project.services.includes(value))) return false;
    if (types.length && !types.includes(project.type)) return false;
    if (tags.length && !tags.some((value) => (project.tags || []).includes(value))) return false;
    return true;
  });
}

export function selectFeatured(source, scope) {
  if (!FEATURED_SCOPES.includes(scope)) throw new Error("Unknown featured scope: " + scope);
  return selectGalleryProjects(source).filter((project) => project.featured.includes(scope));
}

export function selectHomeShowcase(source, { limit = 3 } = {}) {
  validateLimit(limit);
  const all = selectGalleryProjects(source);
  const featured = all.filter((project) => project.featured.includes("homepage"));
  const featuredIds = new Set(featured.map((project) => project.id));
  return [...featured, ...all.filter((project) => !featuredIds.has(project.id))].slice(0, limit);
}
