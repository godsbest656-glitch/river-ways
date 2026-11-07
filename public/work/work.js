const workIndex = document.querySelector("[data-work-index]");

if (workIndex) {
  const cards = Array.from(workIndex.querySelectorAll("[data-project-card]"));
  const groups = Array.from(workIndex.querySelectorAll("[data-work-group]"));
  const categoryFilter = workIndex.querySelector("[data-filter-category]");
  const serviceFilter = workIndex.querySelector("[data-filter-service]");
  const clearButton = workIndex.querySelector("[data-clear-filters]");
  const shuffleButton = workIndex.querySelector("[data-shuffle-order]");
  const status = workIndex.querySelector("[data-work-status]");
  let shuffleSeed = 0;

  const hash = (value) => {
    let result = 2166136261;
    for (const character of String(value)) {
      result ^= character.charCodeAt(0);
      result = Math.imul(result, 16777619);
    }
    return result >>> 0;
  };

  const tokens = (value) => (value || "").split(/\s+/).filter(Boolean);

  const updateResults = () => {
    const category = categoryFilter?.value || "";
    const service = serviceFilter?.value || "";
    let visibleCount = 0;

    cards.forEach((card) => {
      const categoryMatch = !category || tokens(card.dataset.categories).includes(category);
      const serviceMatch = !service || tokens(card.dataset.services).includes(service);
      card.hidden = !(categoryMatch && serviceMatch);
      if (!card.hidden) visibleCount += 1;
    });

    groups.forEach((group) => {
      group.hidden = !Array.from(group.querySelectorAll("[data-project-card]")).some((card) => !card.hidden);
    });

    if (status) status.textContent = visibleCount + (visibleCount === 1 ? " project shown" : " projects shown");
    if (clearButton) clearButton.hidden = !(category || service);
  };

  categoryFilter?.addEventListener("change", updateResults);
  serviceFilter?.addEventListener("change", updateResults);

  clearButton?.addEventListener("click", () => {
    if (categoryFilter) categoryFilter.value = "";
    if (serviceFilter) serviceFilter.value = "";
    updateResults();
  });

  shuffleButton?.addEventListener("click", () => {
    shuffleSeed += 1;
    groups.forEach((group) => {
      const grid = group.querySelector("[data-work-grid]");
      if (!grid) return;
      const ordered = Array.from(grid.children).sort((left, right) => {
        const leftScore = hash(shuffleSeed + ":" + left.dataset.projectId);
        const rightScore = hash(shuffleSeed + ":" + right.dataset.projectId);
        return leftScore - rightScore || left.dataset.projectId.localeCompare(right.dataset.projectId);
      });
      ordered.forEach((card) => grid.appendChild(card));
    });
  });

  updateResults();
}
