import test from "node:test";
import assert from "node:assert/strict";
import { generateCopyDraft } from "../bin/model-copy-adapter.mjs";

const brief = {
  client: { name: "Example Client" },
  campaign: { name: "Launch" },
  objective: "Increase qualified demo requests.",
  audience: "Small business owners",
  primaryMessage: "Understand your business faster.",
  platforms: ["LinkedIn", "Instagram"],
  approvedFacts: ["The product brings business information into one view."],
  constraints: ["No unsupported feature claims."]
};
const env = {
  STUDIO_MODEL_ROUTES_JSON: JSON.stringify({
    copy: {
      provider: "openai-compatible",
      baseUrl: "https://api.example.test/v1/",
      model: "copy-model-v1",
      apiKeyEnv: "COPY_TEST_KEY"
    }
  }),
  COPY_TEST_KEY: "test-secret"
};
const copy = {
  channelCopy: [
    {
      platform: "LinkedIn",
      hook: "Understand your business faster.",
      body: "Bring your business information into one view and make your next conversation more focused.",
      callToAction: null,
      hashtags: ["BusinessOperations"],
      claimReferences: ["The product brings business information into one view."],
      reviewNotes: ["Confirm the intended demo journey."]
    },
    {
      platform: "Instagram",
      hook: "See the bigger picture.",
      body: "Understand your business faster. Keep the conversation focused on what matters next.",
      callToAction: null,
      hashtags: ["BusinessClarity"],
      claimReferences: [],
      reviewNotes: []
    }
  ],
  assumptions: ["The audience recognises the business visibility problem."]
};

test("copy adapter is inactive without its own explicit route", async () => {
  assert.equal(await generateCopyDraft(brief, { env: {} }), null);
});

test("copy route requires explicit model, public HTTPS endpoint and secret env", async () => {
  assert.throws(() => generateCopyDraft(brief, { env: {
    STUDIO_MODEL_ROUTES_JSON: JSON.stringify({ copy: { provider: "other" } })
  } }), /Unsupported copy model provider/);
  assert.throws(() => generateCopyDraft(brief, { env: {
    STUDIO_MODEL_ROUTES_JSON: JSON.stringify({ copy: {
      provider: "openai-compatible", model: "m", baseUrl: "http://localhost", apiKeyEnv: "COPY_TEST_KEY"
    } }), COPY_TEST_KEY: "secret"
  } }), /public HTTPS URL/);
});

test("copy adapter creates a platform-complete, provenance-bearing draft", async () => {
  const calls = [];
  const result = await generateCopyDraft(brief, {
    env,
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), headers: options.headers, body: JSON.parse(options.body) });
      return new Response(JSON.stringify({
        choices: [{ message: { content: JSON.stringify(copy) } }]
      }), { status: 200 });
    }
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.example.test/v1/chat/completions");
  assert.equal(calls[0].headers.authorization, "Bearer test-secret");
  assert.equal(calls[0].body.model, "copy-model-v1");
  assert.equal(result.status, "draft");
  assert.equal(result.channelCopy.length, 2);
  assert.equal(result.provenance.model, "copy-model-v1");
  assert.equal(result.provenance.reviewRequired, true);
  assert.equal(result.channelCopy[1].callToAction, null);
});

test("copy adapter rejects invented claim references, missing channels and HTTP failures", async () => {
  const invented = structuredClone(copy);
  invented.channelCopy[0].claimReferences = ["We have 10,000 customers."];
  await assert.rejects(generateCopyDraft(brief, {
    env, fetchImpl: async () => new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify(invented) } }]
    }), { status: 200 })
  }), /not in the approved brief/);

  const missing = structuredClone(copy);
  missing.channelCopy.pop();
  await assert.rejects(generateCopyDraft(brief, {
    env, fetchImpl: async () => new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify(missing) } }]
    }), { status: 200 })
  }), /one item for each requested platform/);

  await assert.rejects(generateCopyDraft(brief, {
    env, fetchImpl: async () => new Response("{}", { status: 503 })
  }), /HTTP 503/);
});

test("configured copy provider failure never falls back silently", async () => {
  await assert.rejects(generateCopyDraft(brief, {
    env, fetchImpl: async () => { throw new Error("copy provider unavailable"); }
  }), /copy provider unavailable/);
});
