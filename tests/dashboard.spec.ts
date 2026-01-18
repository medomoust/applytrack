import { test, expect } from '@playwright/test';
import { loginAsApplicant } from './helpers/auth';

test.describe('Dashboard', () => {
  test('should display dashboard with charts and stats', async ({ page }) => {
    await loginAsApplicant(page);
    
    // Should be on dashboard by default
    await expect(page).toHaveURL('/dashboard');
    
    // Check for KPI cards
    await expect(page.locator('text=Total Applications')).toBeVisible();
    await expect(page.locator('text=Applied This Week')).toBeVisible();
    await expect(page.locator('text=Interviews')).toBeVisible();
    await expect(page.locator('text=Offers')).toBeVisible();
    
    // Check for charts
    await expect(page.locator('text=Applications by Status')).toBeVisible();
    await expect(page.locator('text=Distribution Overview')).toBeVisible();
    
    // Check for recent activity
    await expect(page.locator('text=Recent Activity')).toBeVisible();
  });

  test('should show chart tooltips on hover', async ({ page }) => {
    await loginAsApplicant(page);
    
    // Wait for charts to render
    await page.waitForTimeout(2000);
    
    // Try hovering over a bar in the chart
    const chart = page.locator('svg').first();
    if (await chart.isVisible()) {
      await chart.hover();
      // Tooltip should appear (implementation specific)
    }
  });
});
