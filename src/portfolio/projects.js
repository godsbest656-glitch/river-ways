import { deepFreeze } from "./schema.js";

const originalMedia = (src, alt, renderer = null) => ({
  kind: "image",
  src,
  alt,
  width: 1200,
  height: 900,
  decorative: false,
  license: {
    kind: "original",
    source: "River Ways original SVG artwork",
    attributionRequired: false
  },
  focalPoint: { x: 0.5, y: 0.5 },
  ...(renderer ? { renderer } : {})
});

export const projectRecords = deepFreeze([
  {
    id: "studio-brand-worlds",
    slug: "identity-with-a-point-of-view",
    title: "Identity with a point of view.",
    summary: "Positioning, visual identity, art direction and design systems that give a business a coherent way to show up.",
    order: 1, publishedAt: null, updatedAt: null,
    type: "capability-study",
    categories: ["brand-identity", "art-direction", "positioning"],
    services: ["brand-creative-systems", "creative-demand-engineering"],
    tags: ["identity", "brand systems", "art direction"],
    status: "published", visibility: "public",
    problem: null, approach: null, outcome: null, client: null,
    results: [], testimonials: [],
    media: { cover: originalMedia("/portfolio/studio-study-brand-worlds.svg", "Illustrative brand-system composition with FORM / FIELD typography, a rule and a circular mark.", "studio-brand-worlds"), gallery: [] },
    featured: ["studio"], disclaimer: null, deliverables: [], evidenceReferences: [], credits: [], seo: null
  },
  {
    id: "studio-campaign-worlds",
    slug: "ideas-built-to-travel",
    title: "Ideas built to travel.",
    summary: "Campaign concepts, graphic design, content and editorial systems shaped around one memorable message.",
    order: 2, publishedAt: null, updatedAt: null,
    type: "capability-study",
    categories: ["campaign-concepts", "graphic-design", "editorial-systems"],
    services: ["content-campaigns", "brand-creative-systems"],
    tags: ["campaigns", "creative systems", "editorial"],
    status: "published", visibility: "public",
    problem: null, approach: null, outcome: null, client: null,
    results: [], testimonials: [],
    media: { cover: originalMedia("/portfolio/studio-study-campaign-worlds.svg", "Illustrative campaign composition with the message MAKE IT MATTER and a campaign systems label.", "studio-campaign-worlds"), gallery: [] },
    featured: ["studio"], disclaimer: null, deliverables: [], evidenceReferences: [], credits: [], seo: null
  },
  {
    id: "studio-digital-experiences",
    slug: "experiences-with-dimension",
    title: "Experiences with dimension.",
    summary: "Web experiences, motion, video and 3D that make complex ideas easier to feel, explore and act on.",
    order: 3, publishedAt: null, updatedAt: null,
    type: "capability-study",
    categories: ["web-design", "motion-design", "3d-experiences"],
    services: ["websites-digital-experiences"],
    tags: ["digital", "interaction", "motion"],
    status: "published", visibility: "public",
    problem: null, approach: null, outcome: null, client: null,
    results: [], testimonials: [],
    media: { cover: originalMedia("/portfolio/studio-study-digital-experiences.svg", "Illustrative digital interface with orbiting forms and the words FROM SIGNAL TO MEANING.", "studio-digital-experiences"), gallery: [] },
    featured: ["studio"], disclaimer: null, deliverables: [], evidenceReferences: [], credits: [], seo: null
  },
  {
    id: "internal-demo-river-ways-website",
    slug: "river-ways-website",
    title: "River Ways website",
    summary: "The agency's own digital experience, built to explain Creative Demand Engineering and make the next step clear.",
    order: 4, publishedAt: null, updatedAt: null,
    type: "internal-demo",
    categories: ["web-design", "web-development", "digital-products"],
    services: ["creative-demand-engineering", "websites-digital-experiences"],
    tags: ["owned experience", "editorial", "conversion"],
    status: "published", visibility: "public",
    problem: null,
    approach: "An editorial agency experience that connects positioning, capabilities, method and a clear enquiry journey.",
    outcome: null, client: null,
    results: [], testimonials: [],
    media: { cover: originalMedia("/portfolio/internal-demo-river-ways.svg", "Original River Ways internal demonstration artwork showing the We engineer demand proposition and a flowing route."), gallery: [] },
    featured: ["work"], disclaimer: null, deliverables: [], evidenceReferences: [], credits: [], seo: null
  },
  {
    id: "internal-demo-growth-diagnostic",
    slug: "growth-diagnostic",
    title: "Growth Diagnostic",
    summary: "A guided self-assessment that helps visitors reflect on five areas of demand readiness and identify a useful next conversation.",
    order: 5, publishedAt: null, updatedAt: null,
    type: "internal-demo",
    categories: ["demand-generation", "lead-workflows", "market-listening"],
    services: ["creative-demand-engineering", "demand-intelligence"],
    tags: ["assessment", "demand readiness", "self-assessment"],
    status: "published", visibility: "public",
    problem: null,
    approach: "A guided, answer-grounded self-assessment. Answers are processed in the page and are not sent to the enquiry endpoint.",
    outcome: null, client: null,
    results: [], testimonials: [],
    media: { cover: originalMedia("/portfolio/internal-demo-growth-diagnostic.svg", "Original Growth Diagnostic internal demonstration artwork showing five assessment dimensions without fabricated scores."), gallery: [] },
    featured: ["work"], disclaimer: null, deliverables: [], evidenceReferences: [], credits: [], seo: null
  }
]);
