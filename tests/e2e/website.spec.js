import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('homepage communicates the River Ways positioning', async ({ page, isMobile }) => {
  await expect(page).toHaveTitle(/River Ways.*Engineer Demand/i);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Find the current.');
  await expect(page.getByRole('link', { name: /Start a conversation/i })).toHaveAttribute('href', '#contact');

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

test('page has no horizontal overflow on the tested viewport', async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});
