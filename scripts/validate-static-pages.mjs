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

async function collectHtmlFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtmlFiles(fullPath));
    else if (entry.isFile() && (entry.name.toLowerCase().endsWith(".html") || entry.name.toLowerCase().endsWith(".htm"))) files.push(fullPath);
  }
  return files;
}

async function validateInternalReferences() {
  const htmlFiles = await collectHtmlFiles(dist);
  for (const file of htmlFiles) {
    const relativeFile = path.relative(dist, file).split(path.sep).join("/");
    const currentUrl = "https://riverwayse.com/" + relativeFile;
    const html = await fs.readFile(file, "utf8");
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const reference = match[1].trim();
      if (!reference || reference.startsWith("#") || /^(?:data:|blob:|mailto:|tel:|javascript:)/i.test(reference)) continue;
      let url;
      try { url = new URL(reference, currentUrl); } catch { failures.push("Invalid local reference in " + relativeFile + ": " + reference); continue; }
      if (url.origin !== "https://riverwayse.com") continue;
      let pathname;
      try { pathname = decodeURIComponent(url.pathname); } catch { failures.push("Invalid URL encoding in " + relativeFile + ": " + reference); continue; }
      let target;
      if (pathname === "/") target = path.join(dist, "index.html");
      else {
        const relativePath = pathname.split("/").filter(Boolean).join(path.sep);
        target = path.extname(pathname)
          ? path.join(dist, relativePath)
          : path.join(dist, relativePath, "index.html");
      }
      if (!(await exists(target))) failures.push("Broken internal reference in " + relativeFile + ": " + reference);
    }
  }
}

await validateInternalReferences();

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
  process.stdout.write("Validated 12 route patterns, " + fixedRoutes.length + " fixed route outputs, " + projects.length + " project detail pages, internal links, sitemap and 404 assets.\n");
}
