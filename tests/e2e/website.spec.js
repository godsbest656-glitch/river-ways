import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage explains the proposition and exposes clear routes", async ({ page, isMobile }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/River Ways.*We Engineer Demand/i);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("We engineer");
  await expect(page.getByRole("link", { name: /Start a conversation/i }).first()).toHaveAttribute("href", "#contact");
  await expect(page.locator(".hero-copy-centered")).toBeVisible();

  if (isMobile) {
    const toggle = page.getByRole("button", { name: "Open navigation" });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.getByRole("button", { name: "Close navigation" })).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("link", { name: "Capabilities", exact: true }).click();
    await expect(page).toHaveURL(/#services$/);
    await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
  } else {
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Work", exact: true })).toHaveAttribute("href", "/work/");
    await expect(page.getByRole("link", { name: "Insights", exact: true })).toHaveAttribute("href", "/insights/");
  }
});

test("all seven core capabilities and the creative studies are represented", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#services .service-feature")).toHaveCount(3);
  await expect(page.locator("#services .service-compact")).toHaveCount(4);
  await expect(page.locator("#studio .rw-project-card")).toHaveCount(3);
  await expect(page.locator("#studio")).toContainText("Illustrative capability studies");
});

test("Demand Intelligence workflow controls update the selected step", async ({ page }) => {
  await page.goto("/");
  const learn = page.getByRole("button", { name: /Learn/i });
  await learn.click();
  await expect(learn).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("region", { name: "Selected Demand Intelligence workflow step" })).toContainText("Improve the system.");
});

test("a Creative Studio study opens its canonical work detail route", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Explore Identity with a point of view/i }).click();
  await expect(page).toHaveURL(/\/work\/identity-with-a-point-of-view\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Identity with a point of view");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://riverwayse.com/work/identity-with-a-point-of-view/");
});

test("all public content routes return their own documents", async ({ page }) => {
  const routes = [
    "/about/", "/services/", "/work/",
    "/work/identity-with-a-point-of-view/",
    "/work/ideas-built-to-travel/",
    "/work/experiences-with-dimension/",
    "/work/river-ways-website/",
    "/work/growth-diagnostic/",
    "/contact/", "/insights/", "/field-guide/", "/growth-diagnostic/", "/privacy/", "/terms/"
  ];

  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main h1").first(), route).toBeVisible();
    await expect(page.locator('link[rel="canonical"]'), route).toHaveAttribute("href", "https://riverwayse.com" + route);
  }
});

test("work filters narrow the visible portfolio without hiding the whole collection", async ({ page }) => {
  await page.goto("/work/");
  const cards = page.locator("[data-project-card]");
  await expect(cards).toHaveCount(5);
  await page.locator("[data-filter-category]").selectOption("brand-identity");
  await expect(cards).toHaveCount(1);
  await expect(page.locator("[data-work-status]")).toContainText("1 projects shown");
  await page.locator("[data-clear-filters]").click();
  await expect(cards).toHaveCount(5);
});

test("invalid enquiry input is explained without a network request", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: /Send my enquiry/i }).click();
  await expect(page.getByRole("alert")).toContainText("Add your name and a valid email address");
  await expect(page).toHaveURL(/#contact$/);
});

test("saved-but-unnotified enquiry response is described honestly", async ({ page }) => {
  await page.route("**/api/contact", (route) => route.fulfill({
    status: 202,
    contentType: "application/json",
    body: JSON.stringify({
      ok: true,
      saved: true,
      notification: "not_configured",
      reference: "preview-reference-001",
      message: "Your enquiry has been safely recorded. We could not confirm the team notification automatically. Keep your reference and email the team if you need a prompt response."
    })
  }));

  await page.goto("/#contact");
  await page.getByLabel("Your name").fill("Preview Test");
  await page.getByLabel("Work email").fill("preview@example.com");
  await page.getByRole("button", { name: /Send my enquiry/i }).click();
  await expect(page.getByRole("status")).toContainText("safely recorded");
  await expect(page.getByRole("status")).toContainText("preview-reference-001");
});

test("Growth Diagnostic carries only approved journey and attribution context into the enquiry", async ({ page }) => {
  let submittedPayload;
  await page.route("**/api/contact", async (route) => {
    submittedPayload = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        saved: true,
        notification: "sent",
        reference: "preview-reference-002",
        message: "Your enquiry has been recorded. We will review the details and follow up using the email address you provided."
      })
    });
  });

  await page.goto("/growth-diagnostic/?utm_source=google&utm_medium=cpc&utm_campaign=rw-diagnostic-test&utm_content=search-ad-a&utm_term=demand-engineering");
  const questions = page.locator(".question");
  await expect(questions).toHaveCount(10);
  for (let index = 0; index < 10; index += 1) {
    await questions.nth(index).locator('input[type="radio"]').first().check();
  }
  await page.getByRole("button", { name: /Generate my diagnostic/i }).click();
  const handoff = page.locator("#brief-link");
  await expect(handoff).toHaveAttribute("href", /utm_source=google/);
  await expect(handoff).toHaveAttribute("href", /engagement=diagnostic/);
  await handoff.click();
  await expect(page).toHaveURL(/journey=growth-diagnostic/);
  await expect(page).toHaveURL(/utm_campaign=rw-diagnostic-test/);
  await expect(page).toHaveURL(/landing_page=%2Fgrowth-diagnostic%2F/);

  await page.getByLabel("Your name").fill("Attribution QA");
  await page.getByLabel("Work email").fill("attribution-test@example.com");
  await page.getByRole("button", { name: /Send my enquiry/i }).click();
  await expect.poll(() => submittedPayload).toBeTruthy();
  expect(submittedPayload.source).toBe("campaign");
  expect(submittedPayload.landingPage).toBe("/growth-diagnostic/");
  expect(submittedPayload.utmSource).toBe("google");
  expect(submittedPayload.utmMedium).toBe("cpc");
  expect(submittedPayload.utmCampaign).toBe("rw-diagnostic-test");
  expect(submittedPayload.utmContent).toBe("search-ad-a");
  expect(submittedPayload.utmTerm).toBe("demand-engineering");
  expect(submittedPayload.journey).toBe("growth-diagnostic");
  expect(submittedPayload.engagement).toBe("diagnostic");
  expect(submittedPayload.answers).toBeUndefined();
  expect(submittedPayload.score).toBeUndefined();
});

test("homepage and key static routes have no automated WCAG A/AA axe violations", async ({ page }) => {
  for (const route of ["/", "/about/", "/services/", "/work/", "/growth-diagnostic/"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
      .analyze();
    expect(results.violations.map(({ id, impact, description, nodes }) => ({
      id, impact, description, elements: nodes.map((node) => node.target)
    })), route).toEqual([]);
  }
});

test("the viewport has no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});
