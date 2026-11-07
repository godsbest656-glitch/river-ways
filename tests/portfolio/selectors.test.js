import test from "node:test";
import assert from "node:assert/strict";
import { createProjectSource, selectFeatured, selectFiltered, selectGalleryProjects, selectHomeShowcase } from "../../src/portfolio/index.js";
import { project } from "./helpers.js";

const source = createProjectSource([
  project({ id: "second", slug: "second", order: 2, featured: ["studio"], categories: ["brand-identity"], services: ["brand-creative-systems"] }),
  project({ id: "first", slug: "first", order: 1, featured: ["homepage"], categories: ["web-design"], services: ["websites-digital-experiences"] }),
  project({ id: "hidden", slug: "hidden", order: 3, visibility: "unlisted" })
]);

test("gallery selection is ordered and public only", () => {
  assert.deepEqual(selectGalleryProjects(source).map((item) => item.id), ["first", "second"]);
});

test("filtering supports category and service", () => {
  assert.deepEqual(selectFiltered(source, { category: "brand-identity" }).map((item) => item.id), ["second"]);
  assert.deepEqual(selectFiltered(source, { service: "websites-digital-experiences" }).map((item) => item.id), ["first"]);
});

test("home showcase puts homepage-featured records first and tops up without repeats", () => {
  const selected = selectHomeShowcase(source, { limit: 3 });
  assert.deepEqual(selected.map((item) => item.id), ["first", "second"]);
  assert.equal(new Set(selected.map((item) => item.id)).size, selected.length);
});

test("featured selector rejects unknown scopes", () => assert.throws(() => selectFeatured(source, "footer"), /Unknown featured scope/));

test("selectors do not mutate source ordering", () => {
  const before = source.listPublic().map((item) => item.id);
  selectGalleryProjects(source).reverse();
  assert.deepEqual(source.listPublic().map((item) => item.id), before);
});

test("source is immutable and unlisted projects are deep-link only", () => {
  assert.equal(Object.isFrozen(source), true);
  assert.equal(Object.isFrozen(source.listPublic()), true);
  assert.equal(source.getBySlug("hidden").visibility, "unlisted");
  assert.equal(source.listPublic().some((item) => item.slug === "hidden"), false);
  assert.equal(source.getBySlug("missing"), null);
});

test("home showcase respects its limit", () => assert.equal(selectHomeShowcase(source, { limit: 1 }).length, 1));

test("negative limits are rejected", () => {
  assert.throws(() => selectGalleryProjects(source, { limit: -1 }), RangeError);
  assert.throws(() => selectHomeShowcase(source, { limit: -1 }), RangeError);
});
