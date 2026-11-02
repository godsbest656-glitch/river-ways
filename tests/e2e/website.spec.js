import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('homepage communicates the River Ways positioning', async ({ page, isMobile }) => {
  await expect(page).toHaveTitle(/River Ways.*Demand Engineering/i);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Find the current.');
  await expect(page.getByRole('link', { name: /Build your growth system/i })).toHaveAttribute('href', '#contact');

  if (isMobile) {
    await expect(page.getByRole('button', { name: 'Open navigation' })).toBeVisible();
  } else {
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  }
});

test('primary sections and service offerings are present', async ({ page }) => {
  await expect(page.locator('#approach')).toBeAttached();
  await expect(page.locator('#services')).toBeAttached();
  await expect(page.locator('#intelligence')).toBeAttached();
  await expect(page.locator('#contact')).toBeAttached();
  await expect(page.getByRole('heading', { name: /Demand Intelligence/i }).first()).toBeVisible();
  await expect(page.locator('.service-card')).toHaveCount(6);
});

test('Demand Intelligence workflow tabs update the panel', async ({ page }) => {
  const learnTab = page.getByRole('tab', { name: /Learn/i });
  await learnTab.click();
  await expect(learnTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('Improve the system.');
});

test('enquiry form explains invalid input without navigating away', async ({ page }) => {
  await page.getByRole('button', { name: /Send my enquiry/i }).click();
  await expect(page.getByRole('alert')).toContainText('Add your name and a valid email address');
  await expect(page).toHaveURL(/\/$/);
});

test('mobile navigation can be opened and closed', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile navigation check runs on the mobile project.');
  const toggle = page.getByRole('button', { name: 'Open navigation' });
  await toggle.click();
  await expect(page.getByRole('button', { name: 'Close navigation' })).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('link', { name: 'What we do' }).click();
  await expect(page).toHaveURL(/#services$/);
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
});

test('enquiry confirmation is honest when email notification is not configured', async ({ page }) => {
  await page.route('**/api/contact', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ ok: true, notification: 'not_configured' }),
  }));
  await page.getByLabel('Your name').fill('Preview Test');
  await page.getByLabel('Work email').fill('preview@example.com');
  await page.getByRole('button', { name: /Send my enquiry/i }).click();
  await expect(page.getByRole('status')).toContainText('email notifications are not fully configured');
  await expect(page.getByRole('status')).toContainText('akinsify0511@gmail.com');
});

test('enquiry confirmation reports team notification only when it was sent', async ({ page }) => {
  await page.route('**/api/contact', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ ok: true, notification: 'sent' }),
  }));
  await page.getByLabel('Your name').fill('Preview Test');
  await page.getByLabel('Work email').fill('preview@example.com');
  await page.getByRole('button', { name: /Send my enquiry/i }).click();
  await expect(page.getByRole('status')).toContainText('the River Ways team has been notified');
});

test('page has no horizontal overflow on the tested viewport', async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});

test('Growth Diagnostic preserves UTM attribution through enquiry submission', async ({ page }) => {
  let submittedPayload;
  await page.route('**/api/contact', async (route) => {
    submittedPayload = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, notification: 'sent' }),
    });
  });

  await page.goto('/growth-diagnostic/?utm_source=google&utm_medium=cpc&utm_campaign=rw-diagnostic-test&utm_content=search-ad-a&utm_term=demand-engineering');
  const questions = page.locator('.question');
  await expect(questions).toHaveCount(10);
  for (let index = 0; index < 10; index += 1) {
    await questions.nth(index).locator('input[type="radio"]').first().check();
  }
  await page.getByRole('button', { name: /Generate my diagnostic/i }).click();
  await page.getByRole('link', { name: /Discuss my growth diagnostic with River Ways/i }).click();

  await expect(page).toHaveURL(/utm_source=google/);
  await expect(page).toHaveURL(/utm_campaign=rw-diagnostic-test/);
  await page.getByLabel('Your name').fill('Attribution QA');
  await page.getByLabel('Work email').fill('attribution-test@example.com');
  await page.getByRole('button', { name: /Send my enquiry/i }).click();
  await expect.poll(() => submittedPayload).toBeTruthy();
  expect(submittedPayload.utmSource).toBe('google');
  expect(submittedPayload.utmMedium).toBe('cpc');
  expect(submittedPayload.utmCampaign).toBe('rw-diagnostic-test');
  expect(submittedPayload.utmContent).toBe('search-ad-a');
  expect(submittedPayload.utmTerm).toBe('demand-engineering');
  expect(submittedPayload.landingPage).toBe('/growth-diagnostic/');
});
