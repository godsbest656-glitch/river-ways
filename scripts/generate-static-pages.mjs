import fs from "node:fs/promises";
import path from "node:path";
import { createProjectSource, projectRecords, CATEGORIES, SERVICES, getServiceLabel } from "../src/portfolio/index.js";

const outputDirectory = path.resolve("dist");
const baseUrl = "https://riverwayse.com";
const source = createProjectSource(projectRecords);
const projects = source.listPublic();

const escapeHtml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");


const organizationDescription = "River Ways connects commercial strategy, creative direction, digital experiences and demand systems to help businesses move from market attention to meaningful action.";
const organizationId = baseUrl + "/#organization";
const websiteId = baseUrl + "/#website";

function structuredData(title, description, route) {
  const canonical = baseUrl + route;
  const segments = route.split("/").filter(Boolean);
  const breadcrumbs = [{ name: "Home", item: baseUrl + "/" }];
  if (segments[0] === "work" && segments.length > 1) {
    breadcrumbs.push({ name: "Work", item: baseUrl + "/work/" });
  }
  if (route !== "/") breadcrumbs.push({ name: title, item: canonical });

  const graph = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "River Ways",
      url: baseUrl + "/",
      email: "akinsify0511@gmail.com",
      description: organizationDescription,
      knowsAbout: [
        "Creative Demand Engineering",
        "Demand generation",
        "Brand strategy and creative direction",
        "Search engine optimization",
        "AI search visibility",
        "Website design and conversion optimization",
        "Performance marketing",
        "Content systems",
        "Demand intelligence"
      ]
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: "River Ways",
      url: baseUrl + "/",
      publisher: { "@id": organizationId }
    },
    {
      "@type": "WebPage",
      "@id": canonical + "#webpage",
      name: title,
      description,
      url: canonical,
      isPartOf: { "@id": websiteId },
      publisher: { "@id": organizationId },
      breadcrumb: { "@id": canonical + "#breadcrumb" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": canonical + "#breadcrumb",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.item
      }))
    }
  ];

  return '<script type="application/ld+json">' +
    JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") +
    "</script>";
}

const navItems = [
  { key: "about", label: "About", href: "/about/" },
  { key: "services", label: "Services", href: "/services/" },
  { key: "work", label: "Work", href: "/work/" },
  { key: "field-guide", label: "Field Guide", href: "/field-guide/" },
  { key: "insights", label: "Insights", href: "/insights/" },
  { key: "contact", label: "Contact", href: "/contact/" }
];

function header(activeNav) {
  const links = navItems.map((item) =>
    '<a href="' + item.href + '"' + (activeNav === item.key ? ' aria-current="page"' : "") + '>' + item.label + "</a>"
  ).join("");
  return '<header class="rw-site-header"><div class="rw-site-header-inner">' +
    '<a class="rw-brand" href="/" aria-label="River Ways home"><svg class="rw-brand-symbol" viewBox="0 0 36 36" aria-hidden="true"><path d="M3 7H13L23 18H33"></path><path d="M3 18H13L23 18"></path><path d="M3 29H13L23 18"></path><path d="M23 18L31 10"></path><path d="M23 18L31 26"></path></svg><span>River Ways</span></a>' +
    '<button class="rw-menu-toggle" type="button" data-rw-menu-toggle aria-expanded="false" aria-controls="rw-site-nav" aria-label="Open navigation"><span></span><span></span><span class="rw-sr-only">Toggle navigation</span></button>' +
    '<nav class="rw-site-nav" id="rw-site-nav" data-rw-site-nav aria-label="Primary navigation">' + links + "</nav>" +
    '<a class="rw-header-cta" href="/contact/">Start a conversation <span aria-hidden="true">↗</span></a>' +
    "</div></header>";
}

function footer() {
  const links = [
    ["About", "/about/"], ["Services", "/services/"], ["Work", "/work/"],
    ["Field Guide", "/field-guide/"], ["Insights", "/insights/"],
    ["Growth Diagnostic", "/growth-diagnostic/"], ["Contact", "/contact/"],
    ["Privacy", "/privacy/"], ["Terms", "/terms/"]
  ].map(([label, href]) => '<a href="' + href + '">' + label + "</a>").join("");
  return '<footer class="rw-site-footer"><div class="rw-footer-inner">' +
    '<div class="rw-footer-main"><div><p class="rw-footer-brand">River Ways</p><p class="rw-footer-description">Creative Demand Engineering. We connect strategy, creative, digital experiences and demand systems around meaningful business movement.</p></div>' +
    '<nav class="rw-footer-links" aria-label="Footer navigation">' + links + "</nav></div>" +
    '<div class="rw-footer-bottom"><span>© <span data-current-year>2026</span> River Ways</span><span>Shaped by the current. Built for what follows.</span></div>' +
    "</div></footer>";
}

function shell({ title, description, route, activeNav, content, robots = "index,follow" }) {
  const canonical = baseUrl + route;
  const safeTitle = escapeHtml(title + " — River Ways");
  const safeDescription = escapeHtml(description);
  return '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<meta name="theme-color" content="#06243a">' +
    '<meta name="description" content="' + safeDescription + '">' +
    '<meta name="robots" content="' + robots + '">' +
    '<link rel="canonical" href="' + canonical + '">' +
    '<meta property="og:type" content="website"><meta property="og:title" content="' + safeTitle + '">' +
    '<meta property="og:description" content="' + safeDescription + '"><meta property="og:url" content="' + canonical + '"><meta property="og:site_name" content="River Ways">' +
    '<meta name="twitter:card" content="summary"><meta name="twitter:title" content="' + safeTitle + '"><meta name="twitter:description" content="' + safeDescription + '">' +
    structuredData(title, description, route) + '<title>' + safeTitle + "</title>" +
    '<link rel="icon" type="image/svg+xml" href="/favicon.svg">' +
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
    '<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&display=swap" rel="stylesheet">' +
    '<link rel="stylesheet" href="/site-pages.css"><script src="/site-pages.js" defer></script></head>' +
    '<body><a class="rw-sr-only" href="#main-content">Skip to content</a>' + header(activeNav) +
    '<main class="rw-page" id="main-content">' + content + "</main>" + footer() + "</body></html>";
}

function hero(eyebrow, title, lede) {
  return '<section class="rw-page-hero"><div class="rw-wrap"><p class="rw-eyebrow">' + eyebrow + '</p><h1>' + title + '</h1><p class="rw-lede">' + lede + '</p></div></section>';
}

function ctaBand(title, description, href = "/contact/", label = "Start a conversation") {
  return '<section class="rw-wrap rw-cta-band"><div><h2>' + title + "</h2><p>" + description + '</p></div><a class="rw-cta-link" href="' + href + '">' + label + ' <span aria-hidden="true">↗</span></a></section>';
}

const aboutContent =
  hero("River Ways / About", "A river has a way.<br><em>So should a business.</em>", "River Ways is a Creative Demand Engineering studio. We help businesses find a clearer direction and connect the work that moves them forward.") +
  '<section class="rw-page-section"><div class="rw-wrap rw-two-column"><div><p class="rw-section-kicker">The philosophy</p><h2>The River is never separate from its environment.</h2></div><div class="rw-body-copy"><p>A river has a life, a way, an environment and seasons. It moves with the world around it. It supports life, responds to changing conditions and keeps moving toward the ocean.</p><p>Businesses move through changing markets too. Their audiences, pressures, opportunities and channels form an ecosystem. We believe growth works better when the parts are understood together.</p></div></div></section>' +
  '<section class="rw-page-section"><div class="rw-wrap rw-two-column"><div><p class="rw-section-kicker">What we bring together</p><h2>One connected system. Not a pile of disconnected activities.</h2></div><div class="rw-body-copy"><p>We connect business understanding, positioning, creative direction, digital experiences, demand channels and measurement around a clear commercial objective.</p><p>That means looking beyond the next campaign or website. We look at the journey from the first signal a buyer encounters to the action they take, the experience they have and what the business learns next.</p></div></div></section>' +
  '<section class="rw-page-section"><div class="rw-wrap"><p class="rw-section-kicker">How we move</p><div class="rw-service-grid">' +
  '<article class="rw-service-card"><span class="rw-service-number">01 / DISCOVER</span><h3>Find the signal.</h3><p>Understand the audience, the market, the friction and the opportunity before deciding what to make.</p></article>' +
  '<article class="rw-service-card"><span class="rw-service-number">02 / SHAPE</span><h3>Give it direction.</h3><p>Connect positioning, creative, experience and channel choices into a coherent route.</p></article>' +
  '<article class="rw-service-card"><span class="rw-service-number">03 / ACTIVATE</span><h3>Make the work move.</h3><p>Build, launch, measure and learn. Improve the system through evidence, not guesswork.</p></article>' +
  "</div></div></section>" +
  ctaBand("Find the next useful move.", "Tell us what is changing in your business and where you want to create movement.");

const serviceDescriptions = {
  "creative-demand-engineering": "Connect business understanding, positioning, creative, digital experience, channels and measurement around a clear growth objective.",
  "websites-digital-experiences": "Build digital environments that make value easier to understand, experiences easier to navigate and the next action easier to take.",
  "search-ai-discovery": "Make your expertise easier to discover through search, useful answers, structured content and clear information architecture.",
  "brand-creative-systems": "Bring positioning, identity, art direction and reusable design systems into one recognisable language.",
  "performance-marketing": "Plan and improve paid and performance activity around audience intent, meaningful outcomes and disciplined learning.",
  "content-campaigns": "Develop campaign ideas and content systems that carry a consistent message across formats and channels.",
  "demand-intelligence": "Listen for market signals, buyer questions and intent patterns that help teams make better decisions."
};

const serviceCards = SERVICES.map((service, index) =>
  '<article class="rw-service-card"><span class="rw-service-number">' + String(index + 1).padStart(2, "0") + " / CAPABILITY</span><h3>" +
  escapeHtml(service.label) + "</h3><p>" + escapeHtml(serviceDescriptions[service.id]) + "</p></article>"
).join("");

const servicesContent =
  hero("River Ways / Services", "Creative demand,<br><em>engineered as a system.</em>", "The work is connected by design. We bring the right strategic, creative, digital and demand capabilities together around the problem that matters.") +
  '<section class="rw-page-section"><div class="rw-wrap"><div class="rw-work-intro"><div><p class="rw-section-kicker">Capabilities</p><h2>Different disciplines. One commercial direction.</h2></div><p>Engagements can begin with one clear need or combine several capabilities into a connected programme. The scope follows the problem, not a fixed package.</p></div><div class="rw-service-grid">' + serviceCards + "</div></div></section>" +
  ctaBand("Start with the challenge, not a package.", "Share the outcome you are working toward. We can help shape the right route.");

const truthLabels = { delivered: "Delivered", illustrative: "Illustrative", "not-delivered": "Not delivered", planned: "Planned" };

function projectCard(project) {
  const cover = project.media.cover;
  const categoryTokens = (project.categories || []).join(" ");
  const serviceTokens = (project.services || []).join(" ");
  const serviceLabels = (project.services || []).map(getServiceLabel).filter(Boolean);
  return '<article class="rw-project-card" data-project-card data-project-id="' + escapeHtml(project.id) + '" data-categories="' + escapeHtml(categoryTokens) + '" data-services="' + escapeHtml(serviceTokens) + '" data-type="' + escapeHtml(project.type) + '">' +
    '<a class="rw-project-card-link" href="/work/' + escapeHtml(project.slug) + '/">' +
    '<div class="rw-project-card-media"><img src="' + escapeHtml(cover.src) + '" alt="' + escapeHtml(cover.alt) + '" width="' + cover.width + '" height="' + cover.height + '" loading="lazy" decoding="async"></div>' +
    '<div class="rw-project-card-body"><div class="rw-project-badges"><span class="rw-project-badge">' + escapeHtml(project.typeLabel) + '</span><span class="rw-project-badge rw-project-truth">' + escapeHtml(truthLabels[project.deliveryTruth] || "Project") + "</span></div>" +
    "<h3>" + escapeHtml(project.title) + '</h3><p class="rw-project-card-summary">' + escapeHtml(project.summary) + "</p>" +
    (serviceLabels.length ? '<div class="rw-project-detail-meta">' + serviceLabels.map((label) => "<span>" + escapeHtml(label) + "</span>").join("") + "</div>" : "") +
    (project.disclaimer ? '<p class="rw-project-disclaimer">' + escapeHtml(project.disclaimer) + "</p>" : "") +
    '<span class="rw-project-link-label">Explore this project <span aria-hidden="true">↗</span></span></div></a></article>';
}

const usedCategories = CATEGORIES.filter((category) => projects.some((project) => project.categories.includes(category.id)));
const usedServices = SERVICES.filter((service) => projects.some((project) => project.services.includes(service.id)));

const filterMarkup =
  '<div class="rw-work-filters" role="group" aria-label="Filter portfolio projects">' +
  '<div class="rw-filter-field"><label for="rw-category-filter">Category</label><select id="rw-category-filter" data-filter-category><option value="">All categories</option>' +
  usedCategories.map((item) => '<option value="' + escapeHtml(item.id) + '">' + escapeHtml(item.label) + "</option>").join("") +
  '</select></div><div class="rw-filter-field"><label for="rw-service-filter">Service</label><select id="rw-service-filter" data-filter-service><option value="">All services</option>' +
  usedServices.map((item) => '<option value="' + escapeHtml(item.id) + '">' + escapeHtml(item.label) + "</option>").join("") +
  '</select></div><button class="rw-filter-button" type="button" data-shuffle-order>Shuffle order</button>' +
  '<button class="rw-filter-button rw-filter-secondary" type="button" data-clear-filters hidden>Clear filters</button>' +
  '<p class="rw-work-status" role="status" aria-live="polite" data-work-status>' + projects.length + " projects shown</p></div>";

const projectGroups = [
  { type: "client", title: "Client work", intro: "Commissioned work shown with the permissions and evidence required for public presentation." },
  { type: "capability-study", title: "Capability studies", intro: "Illustrative studies that show how River Ways approaches brand, campaign and digital experience work. These are not commissioned client case studies." },
  { type: "internal-demo", title: "Internal demonstrations", intro: "River Ways-owned demonstrations of our thinking and systems. These are not external client engagements." },
  { type: "concept", title: "Concepts", intro: "Exploratory work is labelled clearly and is not presented as delivered client work." },
  { type: "experiment", title: "Experiments", intro: "Experiments are exploratory and are not presented as commissioned client work." },
  { type: "roadmap", title: "Roadmap", intro: "Planned work is identified as planned and is not presented as delivered." }
];

const groupMarkup = projectGroups.map((group) => {
  const groupProjects = projects.filter((project) => project.type === group.type);
  if (!groupProjects.length) return "";
  return '<section class="rw-project-group" data-work-group><h2>' + group.title + '</h2><p class="rw-project-group-intro">' + group.intro + '</p><div class="rw-project-grid" data-work-grid>' +
    groupProjects.map(projectCard).join("") + "</div></section>";
}).join("");

const workContent =
  hero("River Ways / Work", "A catalogue of thinking,<br><em>made visible.</em>", "Explore the systems, studies and demonstrations that show how River Ways connects creative direction, digital experience and demand engineering.") +
  '<section class="rw-page-section"><div class="rw-wrap" data-work-index><div class="rw-work-intro"><div><p class="rw-section-kicker">The collection</p><h2>Know what you are looking at.</h2></div><p>This collection currently contains illustrative capability studies and River Ways-owned demonstrations. No commissioned client case studies or verified client outcomes are being claimed here.</p></div>' +
  filterMarkup + groupMarkup + "</div></section>" +
  ctaBand("Have a challenge worth shaping?", "Tell us what is changing in your business and what a useful outcome would look like.");

function projectDetailContent(project) {
  const cover = project.media.cover;
  const serviceLabels = (project.services || []).map(getServiceLabel).filter(Boolean);
  const deliverables = (project.deliverables || []).length
    ? '<section><h2>What this includes</h2><ul>' + project.deliverables.map((item) => "<li>" + escapeHtml(item) + "</li>").join("") + "</ul></section>"
    : "";
  const approach = project.approach
    ? '<section><h2>Approach</h2><p>' + escapeHtml(project.approach) + "</p></section>"
    : "";
  const problem = project.problem
    ? '<section><h2>Challenge</h2><p>' + escapeHtml(project.problem) + "</p></section>"
    : "";
  const outcome = project.outcome
    ? '<section><h2>Outcome</h2><p>' + escapeHtml(project.outcome) + "</p></section>"
    : "";
  const results = (project.results || []).length
    ? '<section><h2>Verified signals</h2><ul>' + project.results.map((item) => "<li>" + escapeHtml(item.label) + ": " + escapeHtml(item.value) + "</li>").join("") + "</ul></section>"
    : "";
  const testimonials = (project.testimonials || []).length
    ? '<section><h2>In their words</h2>' + project.testimonials.map((item) => '<blockquote><p>“' + escapeHtml(item.quote) + '”</p><cite>' + escapeHtml(item.attribution) + "</cite></blockquote>").join("") + "</section>"
    : "";
  const client = project.client?.publicName
    ? '<p class="rw-project-detail-meta"><span>Client: ' + escapeHtml(project.client.publicName) + "</span></p>"
    : "";
  const sections = problem + approach + deliverables + outcome + results + testimonials;
  const explanatory = sections || '<section><h2>About this study</h2><p>This page is an illustrative capability study. It does not describe a commissioned client engagement or claim a client result.</p></section>';

  return hero("River Ways / " + escapeHtml(project.typeLabel), escapeHtml(project.title), escapeHtml(project.summary)) +
    '<section class="rw-page-section"><div class="rw-wrap rw-project-detail">' +
    '<div class="rw-project-badges"><span class="rw-project-badge">' + escapeHtml(project.typeLabel) + '</span><span class="rw-project-badge rw-project-truth">' + escapeHtml(truthLabels[project.deliveryTruth] || "Project") + "</span></div>" +
    (project.disclaimer ? '<p class="rw-project-disclaimer">' + escapeHtml(project.disclaimer) + "</p>" : "") +
    '<div class="rw-project-detail-media"><img src="' + escapeHtml(cover.src) + '" alt="' + escapeHtml(cover.alt) + '" width="' + cover.width + '" height="' + cover.height + '" loading="eager" decoding="async"></div>' +
    client + (serviceLabels.length ? '<div class="rw-project-detail-meta">' + serviceLabels.map((label) => "<span>" + escapeHtml(label) + "</span>").join("") + "</div>" : "") +
    '<div class="rw-project-detail-copy">' + explanatory + "</div>" +
    '<p><a href="/work/">← Back to all work</a></p></div></section>' +
    ctaBand("Make the next piece of work matter.", "Start with the business challenge. We will help shape the right route.");
}

const contactContent =
  hero("River Ways / Contact", "Let's make the next move<br><em>clearer.</em>", "Tell us what is changing, what you want to move forward and where the current system is getting in the way.") +
  '<section class="rw-page-section"><div class="rw-wrap rw-two-column"><div><p class="rw-section-kicker">Start a conversation</p><h2>Useful context makes for a better first conversation.</h2><div class="rw-body-copy"><p>You do not need a finished brief. A clear description of the business, the challenge and the change you want to create is enough to begin.</p><p>The River Ways enquiry form captures the context needed to route your enquiry. You can open it directly on the homepage.</p></div><div class="rw-contact-actions"><a class="rw-contact-link" href="/#contact">Open the enquiry form ↗</a><a class="rw-contact-link rw-contact-link-secondary" href="mailto:akinsify0511@gmail.com">Email River Ways</a></div></div><div class="rw-service-card"><span class="rw-service-number">A USEFUL STARTING POINT</span><h3>What to include</h3><p>Where the business is today, the audience you need to reach, the problem you want to solve, what you have already tried and the outcome you would like to create.</p><p>Please do not send passwords, payment details, sensitive personal information or confidential third-party information through the website form.</p></div></div></section>' +
  ctaBand("Not sure where to begin?", "The Growth Diagnostic can help you identify a useful starting point.", "/growth-diagnostic/", "Explore the diagnostic");

const insightCards = [
  { number: "01 / SYSTEMS", title: "Demand is a system, not a channel.", text: "A campaign can create attention, but demand moves through a connected journey: discovery, understanding, trust, conversion and learning. Improving one channel without understanding the handoffs can leave the real constraint untouched." },
  { number: "02 / POSITIONING", title: "Positioning is a conversion tool.", text: "Clear positioning helps the right people recognise themselves in the problem you solve. It gives creative, content, sales conversations and digital experiences a shared point of view." },
  { number: "03 / MEASUREMENT", title: "Measurement should change decisions.", text: "A dashboard is useful when it helps a team decide what to keep, change or stop. Start with a small set of meaningful outcomes, establish a baseline and make the review lead to action." }
];

const insightsContent =
  hero("River Ways / Insights", "Signals worth<br><em>following.</em>", "Ideas and practical perspectives on the systems that connect positioning, creative, digital experience and business demand.") +
  '<section class="rw-page-section"><div class="rw-wrap"><div class="rw-insight-grid">' +
  insightCards.map((item) => '<article class="rw-insight-card"><span class="rw-service-number">' + item.number + "</span><h3>" + item.title + "</h3><p>" + item.text + "</p></article>").join("") +
  "</div></div></section>" +
  '<section class="rw-page-section"><div class="rw-wrap rw-two-column"><div><p class="rw-section-kicker">Go deeper</p><h2>The Demand Engineering Field Guide.</h2></div><div class="rw-body-copy"><p>A practical guide to connecting market signals, positioning, conversion and learning into a more intentional growth system.</p><p><a href="/field-guide/">Read the Field Guide ↗</a></p></div></div></section>' +
  ctaBand("Turn a useful signal into a clear next step.", "Bring us the question your business is working through.");

const termsContent =
  hero("River Ways / Terms", "A clear basis for<br><em>using this site.</em>", "These terms describe the basic conditions for accessing and using the River Ways website.") +
  '<section class="rw-page-section"><div class="rw-wrap rw-legal-content"><p><strong>Last updated: 7 November 2026.</strong></p>' +
  "<h2>Using this website</h2><p>You may browse this website for lawful personal or business purposes. You agree not to misuse the site, attempt unauthorised access, interfere with its operation or use its content in a way that infringes another person's rights.</p>" +
  "<h2>Information on the site</h2><p>Website content is provided for general information about River Ways, its capabilities and its approach. It is not a guarantee of a particular business, financial, legal or commercial outcome. Decisions should be made using the facts and advice relevant to your circumstances.</p>" +
  "<h2>Intellectual property</h2><p>Unless otherwise stated, the original text, visual identity, design, graphics and other materials on this website belong to River Ways or are used with permission. You may link to public pages. You must not reproduce, adapt, distribute or commercially exploit protected materials without prior permission from the relevant rights holder.</p>" +
  "<h2>Third-party services and links</h2><p>This website may link to external websites or services. River Ways does not control those third parties and is not responsible for their content, availability or privacy practices. Access them at your own discretion.</p>" +
  "<h2>Enquiries and engagements</h2><p>Submitting an enquiry does not create a client relationship or require River Ways to accept an engagement. Any project scope, fees, delivery terms, intellectual property arrangements and other client obligations will be set out in a separate written agreement. Where such an agreement applies, it governs the relevant engagement.</p>" +
  "<h2>Availability and liability</h2><p>We work to keep the website accurate and available, but do not guarantee uninterrupted access or that every item of information will always be current. To the extent permitted by applicable law, River Ways is not responsible for indirect loss arising from reliance on general website content or temporary website unavailability.</p>" +
  "<h2>Changes</h2><p>These terms may be updated as the website or its services change. The latest version will be published on this page with its revision date.</p>" +
  '<h2>Contact</h2><p>Questions about these terms can be sent to <a href="mailto:akinsify0511@gmail.com">akinsify0511@gmail.com</a>.</p></div></section>';

async function writeRoute(route, html) {
  const relative = route.replace(/^\/+|\/+$/g, "");
  const directory = path.join(outputDirectory, relative);
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, "index.html"), html, "utf8");
}

await writeRoute("/about/", shell({
  title: "About",
  description: "Meet River Ways and the philosophy behind Creative Demand Engineering.",
  route: "/about/",
  activeNav: "about",
  content: aboutContent
}));

await writeRoute("/services/", shell({
  title: "Services",
  description: "Explore River Ways capabilities across creative demand engineering, brand, digital experience, discovery and growth.",
  route: "/services/",
  activeNav: "services",
  content: servicesContent
}));

const workPage = shell({
  title: "Work",
  description: "Explore River Ways capability studies and internal demonstrations, clearly labelled and grounded in real project records.",
  route: "/work/",
  activeNav: "work",
  content: workContent
}).replace("</body>", '<script src="/work/work.js" defer></script></body>');
await writeRoute("/work/", workPage);

for (const project of projects) {
  const route = "/work/" + project.slug + "/";
  await writeRoute(route, shell({
    title: project.title,
    description: project.summary,
    route,
    activeNav: "work",
    content: projectDetailContent(project)
  }));
}

await writeRoute("/contact/", shell({
  title: "Contact",
  description: "Start a conversation with River Ways about your business challenge and the next useful move.",
  route: "/contact/",
  activeNav: "contact",
  content: contactContent
}));

await writeRoute("/insights/", shell({
  title: "Insights",
  description: "Perspectives on positioning, creative, digital experience and demand systems from River Ways.",
  route: "/insights/",
  activeNav: "insights",
  content: insightsContent
}));

await writeRoute("/terms/", shell({
  title: "Terms of Use",
  description: "The terms governing access to and use of the River Ways website.",
  route: "/terms/",
  activeNav: null,
  content: termsContent
}));

const sitemapRoutes = [
  "/", "/about/", "/services/", "/work/",
  ...projects.map((project) => "/work/" + project.slug + "/"),
  "/contact/", "/growth-diagnostic/", "/field-guide/", "/insights/", "/privacy/", "/terms/"
];
const uniqueRoutes = Array.from(new Set(sitemapRoutes));
const sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  uniqueRoutes.map((route) => {
    const priority = route === "/" ? "1.0" : route === "/work/" || route === "/services/" ? "0.8" : route.startsWith("/work/") ? "0.6" : "0.5";
    return "  <url><loc>" + baseUrl + route + "</loc><changefreq>monthly</changefreq><priority>" + priority + "</priority></url>";
  }).join("\n") + "\n</urlset>\n";

await fs.writeFile(path.join(outputDirectory, "sitemap.xml"), sitemapXml, "utf8");
await fs.writeFile(path.join(outputDirectory, "route-manifest.json"), JSON.stringify({
  routePatterns: ["/", "/about/", "/services/", "/work/", "/work/:slug/", "/contact/", "/growth-diagnostic/", "/field-guide/", "/insights/", "/privacy/", "/terms/", "Cloudflare Pages 404 fallback"],
  generatedPages: uniqueRoutes
}, null, 2) + "\n", "utf8");

process.stdout.write("Generated " + (6 + projects.length) + " static route pages and a sitemap containing " + uniqueRoutes.length + " URLs.\n");
