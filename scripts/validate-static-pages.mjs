import fs from "node:fs/promises";
import path from "node:path";
import { createProjectSource, projectRecords } from "../src/portfolio/index.js";

const dist = path.resolve("dist");
const source = createProjectSource(projectRecords);
const projects = source.listPublic();
const fixedRoutes = [
  "/", "/about/", "/services/", "/work/", "/contact/",
  "/growth-diagnostic/", "/field-guide/", "/insights/", "/privacy/", "/terms/"
];
const failures = [];

async function exists(file) {
  try { await fs.access(file); return true; } catch { return false; }
}

function routeFile(route) {
  if (route === "/") return path.join(dist, "index.html");
  return path.join(dist, route.replace(/^\/+|\/+$/g, ""), "index.html");
}

for (const route of fixedRoutes) {
  const file = routeFile(route);
  if (!(await exists(file))) failures.push("Missing route output: " + route);
  else {
    const html = await fs.readFile(file, "utf8");
    if (!/<title>[^<]+<\/title>/.test(html)) failures.push("Missing page title: " + route);
    if (!html.includes('rel="canonical"')) failures.push("Missing canonical metadata: " + route);
  }
}

for (const project of projects) {
  const route = "/work/" + project.slug + "/";
  const file = routeFile(route);
  if (!(await exists(file))) {
    failures.push("Missing project detail output: " + route);
    continue;
  }
  const html = await fs.readFile(file, "utf8");
  if (!html.includes(project.title)) failures.push("Project title missing from detail page: " + route);
  if (project.disclaimer && !html.includes(project.disclaimer)) failures.push("Project disclaimer missing from detail page: " + route);
}

const sitemapPath = path.join(dist, "sitemap.xml");
if (!(await exists(sitemapPath))) {
  failures.push("Missing generated sitemap.xml");
} else {
  const sitemap = await fs.readFile(sitemapPath, "utf8");
  const locations = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
  if (new Set(locations).size !== locations.length) failures.push("Sitemap contains duplicate URLs");
  for (const route of fixedRoutes) {
    if (!locations.includes("https://riverwayse.com" + route)) failures.push("Sitemap missing route: " + route);
  }
  for (const project of projects) {
    const route = "https://riverwayse.com/work/" + project.slug + "/";
    if (!locations.includes(route)) failures.push("Sitemap missing project detail: " + route);
  }
}

const manifestPath = path.join(dist, "route-manifest.json");
if (!(await exists(manifestPath))) {
  failures.push("Missing generated route manifest");
} else {
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  if (!Array.isArray(manifest.routePatterns) || manifest.routePatterns.length !== 12) {
    failures.push("Route manifest must describe exactly 12 route patterns including the 404 fallback");
  }
}

const workIndexPath = path.join(dist, "work", "index.html");
if (await exists(workIndexPath)) {
  const workHtml = await fs.readFile(workIndexPath, "utf8");
  for (const project of projects) {
    if (!workHtml.includes('data-project-id="' + project.id + '"')) {
      failures.push("Work index missing public project card: " + project.id);
    }
  }
}

const notFoundPath = path.join(dist, "404.html");
if (!(await exists(notFoundPath))) failures.push("Missing Cloudflare Pages 404.html fallback");
else {
  const notFound = await fs.readFile(notFoundPath, "utf8");
  if (!notFound.includes('content="noindex,follow"')) failures.push("404 fallback must be noindex");
}

for (const asset of ["site-pages.css", "site-pages.js", "work/work.js"]) {
  if (!(await exists(path.join(dist, asset)))) failures.push("Missing shared page asset: " + asset);
}

if (failures.length) {
  failures.forEach((failure) => process.stderr.write("FAIL: " + failure + "\n"));
  process.exitCode = 1;
} else {
  process.stdout.write("Validated 12 route patterns, " + fixedRoutes.length + " fixed route outputs, " + projects.length + " project detail pages and required sitemap/404 assets.\n");
}
