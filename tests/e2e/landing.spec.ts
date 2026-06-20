import { test, expect } from '@playwright/test';

test('landing page has hero section', async ({ page }) => {
  await page.goto('http://localhost:3000');
  // Check for hero CTA button
  const cta = page.getByRole('button', { name: /find a tutor/i });
  await expect(cta).toBeVisible();
  // Check that the hero heading contains platform name
  const heading = page.getByRole('heading', { name: /mini-tuition/i });
  await expect(heading).toBeVisible();
});
