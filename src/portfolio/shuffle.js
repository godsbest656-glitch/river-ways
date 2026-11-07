function hash(value) {
  const input = String(value);
  let result = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    result ^= input.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function stableShuffle(items, seed = 0) {
  if (!Array.isArray(items)) return [];
  return items.slice().sort((left, right) => {
    const leftScore = hash(String(seed) + ":" + (left.id || left.slug || ""));
    const rightScore = hash(String(seed) + ":" + (right.id || right.slug || ""));
    return leftScore - rightScore || String(left.id || left.slug).localeCompare(String(right.id || right.slug));
  });
}
