import test from "node:test";
import assert from "node:assert/strict";
import { CATEGORIES, buildProjectCollection, normalizeProject, validateMedia, validateProject } from "../../src/portfolio/index.js";
import { image, project } from "./helpers.js";

test("the controlled taxonomy contains 21 categories", () => assert.equal(CATEGORIES.length, 21));

test("a capability study is valid but never client proof", () => {
  const normalized = normalizeProject(project());
  assert.equal(normalized.typeLabel, "Capability study");
  assert.equal(normalized.publishableAsProof, false);
  assert.match(normalized.disclaimer, /Illustrative capability study/);
});

test("an internal demonstration is labelled and can prove owned capability", () => {
  const normalized = normalizeProject(project({ type: "internal-demo" }));
  assert.equal(normalized.publishableAsProof, true);
  assert.match(normalized.disclaimer, /not client work/i);
});

test("a client project is proof only with granted permission", () => {
  const record = project({ type: "client", client: { name: "Private Client", publicName: "Approved Client", sector: "Education", permission: "granted" } });
  assert.equal(normalizeProject(record).publishableAsProof, true);
});

test("strict public validation rejects a client without granted permission", () => {
  const record = project({ type: "client", client: { name: "Private Client", publicName: null, sector: "Education", permission: "pending" } });
  assert.ok(validateProject(record, { strict: true }).some((issue) => issue.includes("granted permission")));
});

test("unpermitted client identity is redacted from the render model", () => {
  const normalized = normalizeProject(project({ type: "client", client: { name: "Private Client", publicName: null, sector: "Education", permission: "pending" } }));
  assert.equal(normalized.client.name, null);
  assert.equal(normalized.client.publicName, null);
  assert.equal(normalized.publishableAsProof, false);
});

test("concepts and experiments are not proof", () => {
  assert.equal(normalizeProject(project({ type: "concept" })).publishableAsProof, false);
  assert.equal(normalizeProject(project({ type: "experiment" })).publishableAsProof, false);
});

test("roadmap records cannot be featured", () => {
  const issues = validateProject(project({ type: "roadmap", featured: ["work"] }));
  assert.ok(issues.some((issue) => issue.includes("roadmap records can never be featured")));
});

test("unknown project types are rejected", () => assert.ok(validateProject(project({ type: "case-study" })).some((issue) => issue.startsWith("type:"))));

test("unknown categories are rejected", () => assert.ok(validateProject(project({ categories: ["made-up-category"] })).some((issue) => issue.includes("unknown category"))));

test("a project needs at least one category", () => assert.ok(validateProject(project({ categories: [] })).some((issue) => issue.includes("at least one controlled category"))));

test("a project needs at least one known service", () => assert.ok(validateProject(project({ services: ["unlisted-service"] })).some((issue) => issue.includes("unknown service"))));

test("slugs must be lowercase kebab case", () => assert.ok(validateProject(project({ slug: "Bad Slug" })).some((issue) => issue.startsWith("slug:"))));

test("titles are limited to 160 characters", () => assert.ok(validateProject(project({ title: "x".repeat(161) })).some((issue) => issue.startsWith("title:"))));

test("summaries are limited to 320 characters", () => assert.ok(validateProject(project({ summary: "x".repeat(321) })).some((issue) => issue.startsWith("summary:"))));

test("public records must be published", () => assert.ok(validateProject(project({ status: "draft" })).some((issue) => issue.includes("public records must have published status"))));

test("featured scopes must be known and public", () => {
  assert.ok(validateProject(project({ featured: ["homepage", "unknown"] })).some((issue) => issue.includes("unknown scope")));
  assert.ok(validateProject(project({ visibility: "internal", featured: ["studio"] })).some((issue) => issue.includes("only published public records")));
});

test("duplicate ids and slugs invalidate every conflicting record", () => {
  const result = buildProjectCollection([project(), project({ title: "Second record", order: 2 })]);
  assert.equal(result.projects.length, 0);
  assert.equal(result.errors.length, 2);
  assert.ok(result.errors.every((error) => error.issues.some((issue) => issue.includes("unique"))));
});

test("a cover is required", () => assert.ok(validateProject(project({ media: { gallery: [] } })).some((issue) => issue.includes("media.cover"))));

test("informative images require meaningful alt text", () => {
  assert.ok(validateMedia(image({ alt: "" })).some((issue) => issue.includes("meaningful alt text")));
  assert.ok(validateMedia(image({ alt: "Image of a website" })).some((issue) => issue.includes("generic image label")));
});

test("decorative media must have empty alt text", () => {
  assert.ok(validateMedia(image({ decorative: true, alt: "Decorative river image" })).some((issue) => issue.includes("decorative media must have empty alt text")));
});

test("images require intrinsic dimensions", () => {
  assert.ok(validateMedia(image({ width: 0 })).some((issue) => issue.includes("width")));
  assert.ok(validateMedia(image({ height: null })).some((issue) => issue.includes("height")));
});

test("unlicensed media is rejected", () => {
  const issues = validateMedia(image({ license: { kind: "unlicensed", source: "unknown" } }));
  assert.ok(issues.some((issue) => issue.includes("unlicensed media cannot be published")));
});

test("licences requiring attribution must include attribution", () => {
  const issues = validateMedia(image({ license: { kind: "cc-by", source: "Source record", attributionRequired: true } }));
  assert.ok(issues.some((issue) => issue.includes("required by this licence")));
});

test("video requires a poster and static fallback", () => {
  const issues = validateMedia({ kind: "video", src: "/media/demo.mp4", alt: "A motion study", license: { kind: "original", source: "River Ways", attributionRequired: false } });
  assert.ok(issues.some((issue) => issue.includes("poster")));
  assert.ok(issues.some((issue) => issue.includes("fallback")));
});

test("interactive media requires a static fallback", () => {
  const issues = validateMedia({ kind: "interactive", src: "interactive:current", alt: "Interactive current study", license: { kind: "original", source: "River Ways", attributionRequired: false } });
  assert.ok(issues.some((issue) => issue.includes("fallback")));
});

test("responsive source sets require sizes and increasing widths", () => {
  const issues = validateMedia(image({ responsive: { srcSet: [{ url: "/a.svg", width: 800 }, { url: "/b.svg", width: 600 }], sizes: "" } }));
  assert.ok(issues.some((issue) => issue.includes("strictly increasing positive width")));
  assert.ok(issues.some((issue) => issue.includes("sizes")));
});

test("focal points must be within the zero-to-one range", () => assert.ok(validateMedia(image({ focalPoint: { x: 1.2, y: 0.5 } })).some((issue) => issue.includes("focalPoint"))));

test("strict public validation rejects unverified results", () => {
  const record = project({ results: [{ label: "Leads", value: 20, verified: false }] });
  assert.ok(validateProject(record, { strict: true }).some((issue) => issue.includes("public results must be verified")));
});

test("verified results require evidence and source references", () => {
  const record = project({ results: [{ label: "Leads", value: 20, verified: true }] });
  assert.ok(validateProject(record).some((issue) => issue.includes("verified results require evidence and source")));
});

test("unpermissioned testimonials are filtered from the view model", () => {
  const record = project({ testimonials: [
    { quote: "Approved quote.", attribution: "Approved person", permission: "granted" },
    { quote: "Not approved quote.", attribution: "Unknown person", permission: "pending" }
  ]});
  assert.equal(normalizeProject(record).testimonials.length, 1);
  assert.equal(normalizeProject(record).testimonials[0].quote, "Approved quote.");
});

test("outcomes without verified evidence are never exposed", () => assert.equal(normalizeProject(project({ outcome: "A claimed outcome" })).outcome, null));

test("collection validation drops invalid records and reports the reason", () => {
  const result = buildProjectCollection([project(), project({ id: "bad", slug: "bad", categories: [] })]);
  assert.equal(result.projects.length, 1);
  assert.equal(result.errors.length, 1);
  assert.ok(result.errors[0].issues.some((issue) => issue.includes("category")));
});

test("strict collection validation requires public published records", () => {
  const result = buildProjectCollection([project({ visibility: "internal" })], { requirePublishable: true });
  assert.equal(result.projects.length, 0);
  assert.ok(result.errors[0].issues.some((issue) => issue.includes("published public records")));
});

test("validation does not mutate source records", () => {
  const record = project({ featured: null });
  const before = JSON.stringify(record);
  validateProject(record);
  assert.equal(JSON.stringify(record), before);
});

test("collection building does not mutate input records", () => {
  const record = project({ featured: null });
  const before = JSON.stringify(record);
  buildProjectCollection([record]);
  assert.equal(JSON.stringify(record), before);
});

test("unverified results are filtered from the normalized public view", () => {
  const normalized = normalizeProject(project({ results: [
    { label: "Claim", value: 1, verified: false },
    { label: "Verified", value: 2, verified: true, evidence: "report-1", source: "owner-approved-report" }
  ]}));
  assert.equal(normalized.results.length, 1);
  assert.equal(normalized.results[0].label, "Verified");
});
