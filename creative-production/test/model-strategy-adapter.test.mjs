import test from "node:test";
import assert from "node:assert/strict";
import { generateStrategyDraft, resolveStrategyRoute } from "../bin/model-strategy-adapter.mjs";

const brief = {
  client: { name: "Example Client" },
  campaign: { name: "Launch", targetTerritories: ["Nigeria"] },
  objective: "Increase qualified demo requests.",
  audience: "Small business owners",
  primaryMessage: "Understand your business faster.",
  constraints: ["No unsupported feature claims."]
};

const env = {
  STUDIO_MODEL_ROUTES_JSON: JSON.stringify({
    strategy: {
      provider: "openai-compatible",
      baseUrl: "https://api.example.test/v1",
      model: "strategy-model-v1",
      apiKeyEnv: "STRATEGY_TEST_KEY"
    }
  }),
  STRATEGY_TEST_KEY: "test-secret"
};

const modelContent = JSON.stringify({
  positioning: "A practical business visibility proposition.",
  audienceSegments: ["Owners actively seeking operational clarity"],
  channelStrategy: [{
    channel: "LinkedIn",
    role: "Reach decision-makers",
    action: "Publish evidence-led educational posts",
    metric: "Qualified demo requests"
  }],
  measurementPlan: ["Track qualified demo requests by source"],
  risks: ["Audience assumptions require validation"],
  assumptions: ["The demo journey is available"]
});

test("no strategy route means no model call and allows deterministic fallback", async () => {
  assert.equal(resolveStrategyRoute({}), null);
  assert.equal(await generateStrategyDraft(brief, { env: {} }), null);
});

test("strategy route requires explicit provider, model, HTTPS endpoint and secret env", () => {
  assert.throws(() => resolveStrategyRoute({ STUDIO_MODEL_ROUTES_JSON: "{" }), /valid JSON/);
  assert.throws(() => resolveStrategyRoute({
    STUDIO_MODEL_ROUTES_JSON: JSON.stringify({ strategy: { provider: "unknown" } })
  }), /Unsupported strategy model provider/);
  assert.throws(() => resolveStrategyRoute({
    STUDIO_MODEL_ROUTES_JSON: JSON.stringify({ strategy: { provider: "openai-compatible", model: "m", baseUrl: "http://localhost", apiKeyEnv: "STRATEGY_TEST_KEY" } }),
    STRATEGY_TEST_KEY: "secret"
  }), /public HTTPS URL/);
  assert.throws(() => resolveStrategyRoute({
    STUDIO_MODEL_ROUTES_JSON: JSON.stringify({ strategy: { provider: "openai-compatible", model: "m", baseUrl: "https://api.example.test/v1", apiKeyEnv: "STRATEGY_TEST_KEY" } })
  }), /not configured/);
});

test("strategy adapter calls the explicitly routed model and returns a review-only artifact", async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url: String(url), headers: options.headers, body: JSON.parse(options.body) });
    return new Response(JSON.stringify({
      choices: [{ message: { content: modelContent } }]
    }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const result = await generateStrategyDraft(brief, { env, fetchImpl });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.example.test/v1/chat/completions");
  assert.equal(calls[0].headers.authorization, "Bearer test-secret");
  assert.equal(calls[0].body.model, "strategy-model-v1");
  assert.equal(result.status, "draft");
  assert.equal(result.artifactType, "strategy-draft");
  assert.equal(result.source.client, "Example Client");
  assert.equal(result.provenance.provider, "openai-compatible");
  assert.equal(result.provenance.model, "strategy-model-v1");
  assert.equal(result.provenance.reviewRequired, true);
  assert.ok(result.constraints.some((item) => item.includes("Human review")));
});

test("strategy adapter rejects malformed provider output and HTTP errors", async () => {
  await assert.rejects(
    generateStrategyDraft(brief, { env, fetchImpl: async () => new Response(JSON.stringify({ choices: [{ message: { content: "not-json" } }] }), { status: 200 }) }),
    /did not return valid JSON/
  );
  await assert.rejects(
    generateStrategyDraft(brief, { env, fetchImpl: async () => new Response("{}", { status: 429 }) }),
    /HTTP 429/
  );
  const incomplete = JSON.stringify({ positioning: "Only this field", channelStrategy: [] });
  await assert.rejects(
    generateStrategyDraft(brief, { env, fetchImpl: async () => new Response(JSON.stringify({ choices: [{ message: { content: incomplete } }] }), { status: 200 }) }),
    /audienceSegments/
  );
});

test("a configured provider failure does not silently fall back to deterministic output", async () => {
  await assert.rejects(
    generateStrategyDraft(brief, { env, fetchImpl: async () => { throw new Error("provider unavailable"); } }),
    /provider unavailable/
  );
});
