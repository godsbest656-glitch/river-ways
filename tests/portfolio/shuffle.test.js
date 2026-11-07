import test from "node:test";
import assert from "node:assert/strict";
import { stableShuffle } from "../../src/portfolio/shuffle.js";

const items = Array.from({ length: 12 }, (_, index) => ({ id: "project-" + index }));

test("stable shuffle is deterministic for the same seed", () => {
  assert.deepEqual(stableShuffle(items, 7).map((item) => item.id), stableShuffle(items, 7).map((item) => item.id));
});

test("different seeds can produce different orders", () => {
  assert.notDeepEqual(stableShuffle(items, 1).map((item) => item.id), stableShuffle(items, 2).map((item) => item.id));
});

test("stable shuffle never mutates the source list", () => {
  const before = items.map((item) => item.id);
  stableShuffle(items, 3);
  assert.deepEqual(items.map((item) => item.id), before);
});

test("invalid input returns an empty list", () => assert.deepEqual(stableShuffle(null), []));
