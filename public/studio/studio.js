const $ = (selector) => document.querySelector(selector);
const state = { clients: [], client: null, projects: [], jobs: [], assets: [] };

const defaultBrief = {
  schemaVersion: "1.0",
  client: { name: "Avenize", id: "avenize" },
  campaign: { name: "Global market-entry and customer acquisition", slug: "market-entry" },
  objective: "Establish Avenize as a credible premium Business Operating System brand and generate qualified product demonstrations.",
  audience: "SME owners, founders, directors, operators and business decision-makers. Initial activation market: Lagos, Nigeria.",
  primaryMessage: "The state of your business in seconds.",
  platforms: ["LinkedIn", "Facebook", "Instagram", "TikTok", "YouTube", "X", "WhatsApp Business"],
  deliverables: [
    { type: "launch-campaign-concept", quantity: 1 },
    { type: "corporate-presentation", quantity: 1 },
    { type: "product-brochure", quantity: 1 },
    { type: "product-demonstration-video", quantity: 1 }
  ],
  brandKit: {
    direction: "Premium global Business Operating System. Obsidian, charcoal and electric-lime. Cinematic editorial direction and authentic product interface only.",
    approvedAssets: [],
    restrictedAssets: [
      "Do not invent product features, pricing, customer proof or endorsements.",
      "Niyi Adesanya and LIMBsimple are prospects, not confirmed partners.",
      "Do not use client assets for model generation until explicit permission is recorded."
    ]
  },
  approval: { status: "draft", approvedBy: null, approvedAt: null },
  rights: {
    clientAssetsApprovedForGeneration: false,
    modelLicenseReviewed: false,
    musicRightsCleared: false,
    territoryReviewed: false,
    hardwareCompatibilityReviewed: false
  }
};

function notice(message, kind = "") {
  const element = $("#notice");
  element.textContent = message;
  element.className = "notice" + (kind ? " " + kind : "");
}

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body !== undefined) headers.set("content-type", "application/json");
  const response = await fetch("/api/studio/" + path, {
    ...options,
    headers,
    credentials: "same-origin",
    cache: "no-store",
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });
  let result;
  try { result = await response.json(); } catch { result = { error: "invalid_server_response" }; }
  if (!response.ok) {
    const error = new Error(result.error || "studio_request_failed");
    error.status = response.status;
    throw error;
  }
  return result;
}

function showError(error) {
  if (error.status === 401 || error.status === 403) {
    notice("Studio access is restricted. Sign in through the configured River Ways Cloudflare Access policy, then reload this page.", "error");
  } else {
    notice("Studio could not complete that action: " + error.message, "error");
  }
}

function renderClients() {
  const list = $("#client-list");
  list.replaceChildren();
  if (!state.clients.length) {
    list.append(node("p", "muted", "No client workspaces yet."));
    return;
  }
  for (const client of state.clients) {
    const button = node("button", "client-item" + (state.client?.id === client.id ? " active" : ""), client.name);
    button.type = "button";
    button.setAttribute("aria-pressed", String(state.client?.id === client.id));
    button.addEventListener("click", () => selectClient(client));
    list.append(button);
  }
}

function renderProjects() {
  const list = $("#project-list");
  const select = $("#job-project");
  list.replaceChildren();
  select.replaceChildren();
  for (const project of state.projects) {
    const option = node("option", "", project.name);
    option.value = project.id;
    select.append(option);
    const row = node("div", "project-row");
    const info = node("div");
    info.append(node("strong", "", project.name));
    info.append(node("small", "", project.objective));
    const status = node("span", "job-status " + project.status, project.status.replaceAll("_", " "));
    row.append(info, status);
    list.append(row);
  }
  if (!state.projects.length) list.append(node("p", "muted", "No projects yet. Create a draft brief to begin."));
  $("#metric-projects").textContent = String(state.projects.length);
  $("#new-job-toggle").disabled = state.projects.length === 0;
}

function renderJobs() {
  const list = $("#job-list");
  list.replaceChildren();
  const counts = { queued: 0, running: 0, review: 0 };
  for (const job of state.jobs) {
    if (job.status === "queued") counts.queued += 1;
    if (job.status === "claimed" || job.status === "running") counts.running += 1;
    if (job.status === "review_required") counts.review += 1;
    const project = state.projects.find((item) => item.id === job.project_id);
    const row = node("div", "job-row");
    const info = node("div");
    info.append(node("strong", "", job.job_type + " · " + (project?.name || "Project")));
    info.append(node("small", "", "Job " + job.id + " · " + new Date(job.created_at).toLocaleString()));
    const meta = node("div", "job-meta");
    meta.append(node("span", "job-status " + job.status, job.status.replaceAll("_", " ")));
    meta.append(node("small", "muted", "Attempt " + job.attempt_count));
    row.append(info, meta);
    list.append(row);
  }
  if (!state.jobs.length) list.append(node("p", "muted", "The production queue is empty."));
  $("#metric-queued").textContent = String(counts.queued);
  $("#metric-running").textContent = String(counts.running);
  $("#metric-review").textContent = String(counts.review);
}

async function loadProjects() {
  if (!state.client) return;
  const result = await api("projects?clientId=" + encodeURIComponent(state.client.id));
  state.projects = result.projects || [];
  renderProjects();
  await loadJobs();
}

async function loadJobs() {
  if (!state.client) return;
  const result = await api("jobs?clientId=" + encodeURIComponent(state.client.id));
  state.jobs = result.jobs || [];
  renderJobs();
}


async function loadAssets() {
  if (!state.client) return;
  const result = await api("assets?clientId=" + encodeURIComponent(state.client.id));
  state.assets = result.assets || [];
  renderAssets();
}

function renderAssets() {
  const list = $("#asset-list");
  list.replaceChildren();
  if (!state.assets.length) {
    list.append(node("p", "muted", "No creative assets have been registered for this workspace yet."));
    return;
  }
  for (const asset of state.assets) {
    const row = node("article", "asset-row");
    const preview = node("div", "asset-preview");
    const url = "/api/studio/assets/" + encodeURIComponent(asset.id) + "/file";
    if (asset.media_type?.startsWith("image/")) {
      const image = node("img", "asset-image");
      image.src = url;
      image.alt = asset.filename;
      preview.append(image);
    } else if (asset.media_type?.startsWith("video/")) {
      const video = node("video", "asset-video");
      video.src = url;
      video.controls = true;
      video.preload = "metadata";
      video.setAttribute("aria-label", "Preview " + asset.filename);
      preview.append(video);
    } else {
      preview.append(node("span", "asset-file-icon", asset.media_type === "application/pdf" ? "PDF" : "FILE"));
    }
    const details = node("div", "asset-details");
    details.append(node("strong", "", asset.filename));
    details.append(node("small", "", asset.asset_type + " · v" + asset.version + " · " + asset.media_type));
    details.append(node("small", "muted", "SHA-256 " + asset.sha256));
    const status = node("span", "job-status " + asset.status, asset.status.replaceAll("_", " "));
    const open = node("a", "asset-open", "Open file ↗");
    open.href = url;
    open.target = "_blank";
    open.rel = "noopener";
    const controls = node("div", "asset-review-controls");
    const scope = node("input", "asset-scope");
    scope.type = "text";
    scope.maxLength = 240;
    scope.value = "Internal agency review only";
    scope.setAttribute("aria-label", "Usage scope for " + asset.filename);
    const approve = node("button", "button button-primary", "Approve scope");
    approve.type = "button";
    approve.disabled = asset.status === "delivered";
    approve.addEventListener("click", () => reviewAsset(asset, "approved", scope.value));
    const changes = node("button", "button button-secondary", "Request changes");
    changes.type = "button";
    changes.disabled = asset.status === "delivered";
    changes.addEventListener("click", () => reviewAsset(asset, "changes_requested", scope.value));
    controls.append(scope, approve, changes);
    details.append(status, open, controls);
    row.append(preview, details);
    list.append(row);
  }
}

async function reviewAsset(asset, decision, usageScope) {
  if (!usageScope.trim()) {
    notice("Enter the intended usage scope before recording an approval decision.", "error");
    return;
  }
  try {
    await api("assets/" + encodeURIComponent(asset.id) + "/approval", {
      method: "POST",
      body: {
        decision,
        usageScope: usageScope.trim(),
        assetSha256: asset.sha256,
        notes: "Recorded from the River Ways Creative Studio agency review."
      }
    });
    await loadAssets();
    notice(decision === "approved" ? "Agency review recorded for this exact asset version." : "Changes requested for this asset version.", "success");
  } catch (error) { showError(error); }
}

async function selectClient(client) {
  state.client = client;
  $("#selected-client").textContent = client.name;
  $("#client-status").textContent = client.status;
  $("#new-project-toggle").disabled = false;
  renderClients();
  try {
    await loadProjects();
    await loadAssets();
    notice("Connected to " + client.name + " workspace.", "success");
  } catch (error) { showError(error); }
}

$("#new-client-toggle").addEventListener("click", () => $("#client-form").classList.toggle("hidden"));
$("#client-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = String(data.get("name") || "").trim();
  const slug = String(data.get("slug") || "").trim().toLowerCase();
  try {
    await api("clients", { method: "POST", body: { name, slug, brandProfile: {} } });
    event.currentTarget.reset();
    event.currentTarget.classList.add("hidden");
    await loadClients();
    notice("Client workspace created.", "success");
  } catch (error) { showError(error); }
});

$("#new-project-toggle").addEventListener("click", () => {
  $("#project-brief").value = JSON.stringify({
    ...defaultBrief,
    client: { name: state.client?.name || "Avenize", id: state.client?.slug || "client" }
  }, null, 2);
  $("#project-form").classList.remove("hidden");
});
$("#cancel-project").addEventListener("click", () => $("#project-form").classList.add("hidden"));
$("#project-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.client) return;
  const data = new FormData(event.currentTarget);
  let brief;
  try { brief = JSON.parse(String(data.get("brief") || "")); }
  catch { notice("The brief must be valid JSON.", "error"); return; }
  const payload = {
    clientId: state.client.id,
    name: String(data.get("name") || "").trim(),
    slug: String(data.get("slug") || "").trim().toLowerCase(),
    objective: String(data.get("objective") || "").trim(),
    brief
  };
  try {
    await api("projects", { method: "POST", body: payload });
    event.currentTarget.classList.add("hidden");
    event.currentTarget.reset();
    await loadProjects();
    notice("Draft project saved. No generation permission has been granted.", "success");
  } catch (error) { showError(error); }
});

$("#new-job-toggle").addEventListener("click", () => $("#job-form").classList.toggle("hidden"));
$("#job-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.client) return;
  const projectId = $("#job-project").value;
  const jobType = $("#job-type").value;
  try {
    await api("jobs", {
      method: "POST",
      body: { clientId: state.client.id, projectId, jobType, payload: { source: "creative-studio-ui" } }
    });
    $("#job-form").classList.add("hidden");
    await loadJobs();
    notice("Job added to the persistent queue. A connected worker is required to execute it.", "success");
  } catch (error) { showError(error); }
});

async function loadClients() {
  const result = await api("clients");
  state.clients = result.clients || [];
  renderClients();
  if (state.clients.length) await selectClient(state.clients[0]);
  else {
    $("#selected-client").textContent = "No workspace selected";
    notice("Studio API connected. Create a client workspace to begin.", "success");
  }
}

loadClients().catch(showError);
