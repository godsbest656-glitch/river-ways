const freezeGroup = (group) => Object.freeze({
  ...group,
  categories: Object.freeze(group.categories.map((category) => Object.freeze(category)))
});

export const CATEGORY_GROUPS = Object.freeze([
  freezeGroup({ id: "brand", label: "Brand", categories: [
    { id: "brand-strategy", label: "Brand strategy" },
    { id: "positioning", label: "Positioning" },
    { id: "brand-identity", label: "Brand identity" },
    { id: "art-direction", label: "Art direction" }
  ]}),
  freezeGroup({ id: "creative", label: "Creative", categories: [
    { id: "campaign-concepts", label: "Campaign concepts" },
    { id: "graphic-design", label: "Graphic design" },
    { id: "content-production", label: "Content production" },
    { id: "editorial-systems", label: "Editorial systems" }
  ]}),
  freezeGroup({ id: "digital", label: "Digital", categories: [
    { id: "web-design", label: "Web design" },
    { id: "web-development", label: "Web development" },
    { id: "digital-products", label: "Digital products" },
    { id: "conversion-optimization", label: "Conversion optimisation" }
  ]}),
  freezeGroup({ id: "motion", label: "Motion", categories: [
    { id: "motion-design", label: "Motion design" },
    { id: "video-production", label: "Video production" },
    { id: "3d-experiences", label: "3D experiences" }
  ]}),
  freezeGroup({ id: "growth", label: "Growth", categories: [
    { id: "demand-generation", label: "Demand generation" },
    { id: "performance-marketing", label: "Performance marketing" },
    { id: "go-to-market", label: "Go-to-market" },
    { id: "lead-workflows", label: "Lead workflows" }
  ]}),
  freezeGroup({ id: "intelligence", label: "Intelligence", categories: [
    { id: "search-discovery", label: "Search and AI discovery" },
    { id: "market-listening", label: "Market listening" }
  ]})
]);

export const CATEGORIES = Object.freeze(CATEGORY_GROUPS.flatMap((group) => group.categories));
export const CATEGORY_IDS = Object.freeze(CATEGORIES.map((category) => category.id));

export const SERVICES = Object.freeze([
  { id: "creative-demand-engineering", label: "Creative Demand Engineering" },
  { id: "websites-digital-experiences", label: "Websites & Digital Experiences" },
  { id: "search-ai-discovery", label: "Search & AI Discovery" },
  { id: "brand-creative-systems", label: "Brand & Creative Systems" },
  { id: "performance-marketing", label: "Performance Marketing" },
  { id: "content-campaigns", label: "Content & Campaigns" },
  { id: "demand-intelligence", label: "Demand Intelligence" }
].map((service) => Object.freeze(service)));

export const SERVICE_IDS = Object.freeze(SERVICES.map((service) => service.id));
export const FEATURED_SCOPES = Object.freeze(["homepage", "studio", "work"]);
export const PROJECT_TYPES = Object.freeze(["client", "internal-demo", "capability-study", "concept", "experiment", "roadmap"]);
export const VISIBILITIES = Object.freeze(["public", "unlisted", "internal", "draft"]);
export const PROJECT_STATUSES = Object.freeze(["draft", "published", "archived"]);

const categoryLabels = new Map(CATEGORIES.map((category) => [category.id, category.label]));
const serviceLabels = new Map(SERVICES.map((service) => [service.id, service.label]));

export const isKnownCategory = (id) => categoryLabels.has(id);
export const isKnownService = (id) => serviceLabels.has(id);
export const getCategoryLabel = (id) => categoryLabels.get(id) || null;
export const getServiceLabel = (id) => serviceLabels.get(id) || null;
