import {
  FEATURED_SCOPES,
  PROJECT_STATUSES,
  PROJECT_TYPES,
  VISIBILITIES,
  getCategoryLabel,
  isKnownCategory,
  isKnownService
} from "./taxonomy.js";

export const MEDIA_RENDERERS = Object.freeze(["studio-brand-worlds", "studio-campaign-worlds", "studio-digital-experiences"]);

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TYPE_LABELS = {
  client: "Client project",
  "internal-demo": "Internal demonstration",
  "capability-study": "Capability study",
  concept: "Concept",
  experiment: "Experiment",
  roadmap: "Roadmap"
};
const DELIVERY_TRUTH = {
  client: "delivered",
  "internal-demo": "delivered",
  "capability-study": "illustrative",
  concept: "not-delivered",
  experiment: "not-delivered",
  roadmap: "planned"
};
const DEFAULT_DISCLAIMERS = {
  "internal-demo": "Internal demonstration — not client work.",
  "capability-study": "Illustrative capability study — not a client case study or commissioned work.",
  concept: "Concept — exploratory work, not delivered client work.",
  experiment: "Experiment — exploratory work, not a client result.",
  roadmap: "Roadmap — planned work, not yet delivered."
};

export function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function add(issues, path, message) {
  issues.push(path + ": " + message);
}

function validateDate(value, path, issues) {
  if (value == null || value === "") return;
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    add(issues, path, "must be a valid date string or null");
  }
}

export function validateMedia(media, path = "media") {
  const issues = [];
  if (!isObject(media)) return [path + ": must be an object"];
  if (!["image", "video", "interactive"].includes(media.kind)) {
    add(issues, path + ".kind", "must be image, video or interactive");
  }
  if (typeof media.src !== "string" || !media.src.trim()) {
    add(issues, path + ".src", "is required");
  }
  if (media.renderer != null) {
    if (!MEDIA_RENDERERS.includes(media.renderer)) add(issues, path + ".renderer", "is not an approved local renderer");
    if (media.kind !== "image") add(issues, path + ".renderer", "is only supported for image media");
  }
  if (typeof media.alt !== "string") {
    add(issues, path + ".alt", "must be a string");
  } else if (media.decorative === true && media.alt !== "") {
    add(issues, path + ".alt", "decorative media must have empty alt text");
  } else if (media.decorative !== true && (!media.alt.trim() || /^image of\b/i.test(media.alt.trim()))) {
    add(issues, path + ".alt", "informative media needs meaningful alt text, not a generic image label");
  }

  if (media.kind === "image") {
    if (!Number.isInteger(media.width) || media.width <= 0) add(issues, path + ".width", "must be a positive integer");
    if (!Number.isInteger(media.height) || media.height <= 0) add(issues, path + ".height", "must be a positive integer");
  }
  if (media.kind === "video") {
    if (typeof media.poster !== "string" || !media.poster.trim()) add(issues, path + ".poster", "is required for video");
    if (typeof media.fallback !== "string" || !media.fallback.trim()) add(issues, path + ".fallback", "is required for video");
  }
  if (media.kind === "interactive" && (typeof media.fallback !== "string" || !media.fallback.trim())) {
    add(issues, path + ".fallback", "is required for interactive media");
  }

  if (!isObject(media.license)) {
    add(issues, path + ".license", "is required");
  } else {
    if (typeof media.license.kind !== "string" || !media.license.kind.trim()) add(issues, path + ".license.kind", "is required");
    if (media.license.kind === "unlicensed") add(issues, path + ".license.kind", "unlicensed media cannot be published");
    if (typeof media.license.source !== "string" || !media.license.source.trim()) add(issues, path + ".license.source", "is required");
    if (media.license.attributionRequired === true && (typeof media.license.attribution !== "string" || !media.license.attribution.trim())) {
      add(issues, path + ".license.attribution", "is required by this licence");
    }
  }

  if (media.responsive != null) {
    if (!isObject(media.responsive) || !Array.isArray(media.responsive.srcSet) || !media.responsive.srcSet.length) {
      add(issues, path + ".responsive.srcSet", "must be a non-empty array");
    } else {
      let previousWidth = 0;
      media.responsive.srcSet.forEach((entry, index) => {
        if (!isObject(entry) || typeof entry.url !== "string" || !entry.url.trim() || !Number.isInteger(entry.width) || entry.width <= previousWidth) {
          add(issues, path + ".responsive.srcSet[" + index + "]", "needs a URL and strictly increasing positive width");
        } else {
          previousWidth = entry.width;
        }
      });
    }
    if (!isObject(media.responsive) || typeof media.responsive.sizes !== "string" || !media.responsive.sizes.trim()) {
      add(issues, path + ".responsive.sizes", "is required when srcSet is provided");
    }
  }

  if (media.focalPoint != null) {
    if (!isObject(media.focalPoint) ||
      typeof media.focalPoint.x !== "number" || media.focalPoint.x < 0 || media.focalPoint.x > 1 ||
      typeof media.focalPoint.y !== "number" || media.focalPoint.y < 0 || media.focalPoint.y > 1) {
      add(issues, path + ".focalPoint", "x and y must be numbers from 0 to 1");
    }
  }
  return issues;
}

export function validateProject(record, { strict = false } = {}) {
  const issues = [];
  if (!isObject(record)) return ["project: must be an object"];

  if (typeof record.id !== "string" || !SLUG_RE.test(record.id)) add(issues, "id", "must be a stable kebab-case identifier");
  if (typeof record.slug !== "string" || !SLUG_RE.test(record.slug)) add(issues, "slug", "must be kebab-case");
  if (typeof record.title !== "string" || !record.title.trim() || record.title.length > 160) add(issues, "title", "is required and must be at most 160 characters");
  if (typeof record.summary !== "string" || !record.summary.trim() || record.summary.length > 320) add(issues, "summary", "is required and must be at most 320 characters");

  if (!Array.isArray(record.categories) || record.categories.length === 0) {
    add(issues, "categories", "at least one controlled category is required");
  } else {
    record.categories.forEach((category) => {
      if (!isKnownCategory(category)) add(issues, "categories", "unknown category: " + category);
    });
  }

  if (!Array.isArray(record.services) || record.services.length === 0) {
    add(issues, "services", "at least one controlled service is required");
  } else {
    record.services.forEach((service) => {
      if (!isKnownService(service)) add(issues, "services", "unknown service: " + service);
    });
  }

  if (!PROJECT_TYPES.includes(record.type)) add(issues, "type", "is not a supported project type");
  if (!PROJECT_STATUSES.includes(record.status)) add(issues, "status", "is not a supported status");
  if (!VISIBILITIES.includes(record.visibility)) add(issues, "visibility", "is not a supported visibility");
  if (!Number.isInteger(record.order) || record.order < 0) add(issues, "order", "must be a non-negative integer");

  if (record.visibility === "public" && record.status !== "published") add(issues, "visibility", "public records must have published status");
  if (record.visibility === "public" && record.status === "archived") add(issues, "status", "archived records cannot be public");
  if (record.visibility === "draft" && record.status !== "draft") add(issues, "status", "draft visibility requires draft status");

  const featured = record.featured == null ? [] : record.featured;
  if (!Array.isArray(featured)) {
    add(issues, "featured", "must be an array of scopes");
  } else {
    featured.forEach((scope) => {
      if (!FEATURED_SCOPES.includes(scope)) add(issues, "featured", "unknown scope: " + scope);
    });
    if (featured.length && (record.visibility !== "public" || record.status !== "published")) {
      add(issues, "featured", "only published public records may be featured");
    }
    if (record.type === "roadmap" && featured.length) add(issues, "featured", "roadmap records can never be featured");
  }

  if (record.type === "client") {
    if (!isObject(record.client)) {
      add(issues, "client", "client records require a client object");
    } else {
      if (!["granted", "pending", "denied"].includes(record.client.permission)) add(issues, "client.permission", "must be granted, pending or denied");
      if (record.client.permission === "granted" && (!record.client.publicName || typeof record.client.publicName !== "string")) {
        add(issues, "client.publicName", "is required when public permission is granted");
      }
      if (strict && record.visibility === "public" && record.client.permission !== "granted") {
        add(issues, "client.permission", "public client work requires granted permission in strict mode");
      }
    }
  } else if (record.client != null) {
    add(issues, "client", "must be null for non-client project types");
  }

  if (record.problem != null && typeof record.problem !== "string") add(issues, "problem", "must be a string or null");
  if (record.approach != null && typeof record.approach !== "string") add(issues, "approach", "must be a string or null");
  if (record.outcome != null && typeof record.outcome !== "string") add(issues, "outcome", "must be a string or null");

  if (!Array.isArray(record.results)) add(issues, "results", "must be an array");
  else record.results.forEach((result, index) => {
    const path = "results[" + index + "]";
    if (!isObject(result)) return add(issues, path, "must be an object");
    if (typeof result.label !== "string" || !result.label.trim()) add(issues, path + ".label", "is required");
    if (typeof result.value !== "string" && typeof result.value !== "number") add(issues, path + ".value", "must be a string or number");
    if (typeof result.verified !== "boolean") add(issues, path + ".verified", "must be explicit true or false");
    if (result.verified === true && (!result.evidence || !result.source)) add(issues, path, "verified results require evidence and source references");
    if (strict && record.visibility === "public" && result.verified !== true) add(issues, path, "public results must be verified in strict mode");
  });

  if (record.outcome && strict && !(record.results || []).some((result) => result && result.verified === true && result.evidence && result.source)) {
    add(issues, "outcome", "public outcomes require at least one verified result with evidence and source");
  }

  if (!Array.isArray(record.testimonials)) add(issues, "testimonials", "must be an array");
  else record.testimonials.forEach((testimonial, index) => {
    const path = "testimonials[" + index + "]";
    if (!isObject(testimonial)) return add(issues, path, "must be an object");
    if (typeof testimonial.quote !== "string" || !testimonial.quote.trim()) add(issues, path + ".quote", "is required");
    if (!["granted", "pending", "denied"].includes(testimonial.permission)) add(issues, path + ".permission", "must be granted, pending or denied");
    if (testimonial.permission === "granted" && (!testimonial.attribution || typeof testimonial.attribution !== "string")) {
      add(issues, path + ".attribution", "is required for a permitted testimonial");
    }
  });

  if (!isObject(record.media)) {
    add(issues, "media", "is required");
  } else {
    issues.push(...validateMedia(record.media.cover, "media.cover"));
    if (!Array.isArray(record.media.gallery)) add(issues, "media.gallery", "must be an array");
    else record.media.gallery.forEach((item, index) => issues.push(...validateMedia(item, "media.gallery[" + index + "]")));
  }

  if (record.tags != null && (!Array.isArray(record.tags) || record.tags.some((tag) => typeof tag !== "string"))) add(issues, "tags", "must be an array of strings");
  if (record.deliverables != null && (!Array.isArray(record.deliverables) || record.deliverables.some((item) => typeof item !== "string"))) add(issues, "deliverables", "must be an array of strings");
  if (record.evidenceReferences != null && !Array.isArray(record.evidenceReferences)) add(issues, "evidenceReferences", "must be an array");
  if (record.credits != null && !Array.isArray(record.credits)) add(issues, "credits", "must be an array");
  if (record.disclaimer != null && typeof record.disclaimer !== "string") add(issues, "disclaimer", "must be a string or null");
  validateDate(record.publishedAt, "publishedAt", issues);
  validateDate(record.updatedAt, "updatedAt", issues);

  return issues;
}

export function isPublishableAsProof(record) {
  if (!record || typeof record !== "object") return false;
  if (record.type === "internal-demo") return true;
  if (record.type === "client") return record.client?.permission === "granted";
  return false;
}

export function normalizeProject(record) {
  const project = clone(record);
  if (project.featured == null) project.featured = [];
  const permissionGranted = project.type !== "client" || project.client?.permission === "granted";
  const verifiedResults = (project.results || []).filter((result) => result && result.verified === true && result.evidence && result.source);
  project.results = verifiedResults;
  project.testimonials = (project.testimonials || []).filter((testimonial) => testimonial && testimonial.permission === "granted");
  if (project.type === "client" && !permissionGranted) {
    project.client = { ...project.client, name: null, publicName: null };
  }
  if (!verifiedResults.length) project.outcome = null;
  project.primaryCategory = project.categories?.[0] || null;
  project.primaryCategoryLabel = getCategoryLabel(project.primaryCategory);
  project.typeLabel = TYPE_LABELS[project.type] || "Project";
  project.deliveryTruth = DELIVERY_TRUTH[project.type] || "unknown";
  project.publishableAsProof = isPublishableAsProof(project);
  project.disclaimer = project.disclaimer || (
    project.type === "client" && !permissionGranted
      ? "Client identity and proof are not approved for public use."
      : DEFAULT_DISCLAIMERS[project.type] || null
  );
  return deepFreeze(project);
}

export function buildProjectCollection(records, { requirePublishable = false } = {}) {
  if (!Array.isArray(records)) {
    return deepFreeze({
      projects: [],
      errors: [{ index: -1, id: null, slug: null, issues: ["records: must be an array"] }]
    });
  }

  const idCounts = new Map();
  const slugCounts = new Map();
  records.forEach((record) => {
    if (record && typeof record.id === "string") idCounts.set(record.id, (idCounts.get(record.id) || 0) + 1);
    if (record && typeof record.slug === "string") slugCounts.set(record.slug, (slugCounts.get(record.slug) || 0) + 1);
  });

  const projects = [];
  const errors = [];
  records.forEach((record, index) => {
    const issues = validateProject(record, { strict: requirePublishable });
    if (record && typeof record.id === "string" && idCounts.get(record.id) > 1) add(issues, "id", "must be unique in the collection");
    if (record && typeof record.slug === "string" && slugCounts.get(record.slug) > 1) add(issues, "slug", "must be unique in the collection");
    if (requirePublishable && record && (record.visibility !== "public" || record.status !== "published")) {
      add(issues, "visibility", "strict collection requires published public records");
    }
    if (issues.length) {
      errors.push({ index, id: record?.id || null, slug: record?.slug || null, issues });
      return;
    }
    projects.push(normalizeProject(record));
  });

  projects.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  return deepFreeze({ projects, errors });
}
