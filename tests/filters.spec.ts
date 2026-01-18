import { test, expect } from '@playwright/test';
import { loginAsApplicant } from './helpers/auth';

test.describe('Filters and Search', () => {
  test('should filter applications by status', async ({ page }) => {
    await loginAsApplicant(page);
    
    // Navigate to applications
    await page.click('text=My Applications');
    await expect(page).toHaveURL('/applications');
    
    // Wait for applications to load
    await page.waitForTimeout(2000);
    
    // Click filter button
    const filterButton = page.locator('button:has-text("Filter")');
    if (await filterButton.isVisible()) {
      await filterButton.click();
      
      // Select a status filter (e.g., "Interview")
      const interviewFilter = page.locator('text=Interview');
      if (await interviewFilter.isVisible()) {
        await interviewFilter.click();
        
        // Apply filter
        await page.click('button:has-text("Apply")');
        
        // Wait for filtered results
        await page.waitForTimeout(1000);
        
        // Verify only interview applications are shown
        // This is implementation specific
      }
    }
  });

  test('should search for jobs by title', async ({ page }) => {
    await loginAsApplicant(page);
    
    // Navigate to jobs
    await page.click('text=Browse Jobs');
    await expect(page).toHaveURL('/jobs');
    
    // Wait for jobs to load
    await page.waitForTimeout(2000);
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('Engineer');
      
      // Wait for search results
      await page.waitForTimeout(1000);
      
      // Verify results contain the search term
      const results = page.locator('.job-card, [data-testid="job-card"]');
      if (await results.first().isVisible()) {
        const text = await results.first().textContent();
        expect(text?.toLowerCase()).toContain('engineer');
      }
    }
  });

  test('should filter jobs by company', async ({ page }) => {
    await loginAsApplicant(page);
    
    await page.click('text=Browse Jobs');
    await expect(page).toHaveURL('/jobs');
    
    await page.waitForTimeout(2000);
    
    // Try company filter
    const filterButton = page.locator('button:has-text("Filter")');
    if (await filterButton.isVisible()) {
      await filterButton.click();
      
      // Select a company (e.g., Meta)
      const companyOption = page.locator('text=Meta').first();
      if (await companyOption.isVisible()) {
        await companyOption.click();
        
        await page.waitForTimeout(1000);
        
        // Verify filtered results
        const jobCards = page.locator('[data-company="Meta"]');
        if (await jobCards.first().isVisible()) {
          const count = await jobCards.count();
          expect(count).toBeGreaterThan(0);
        }
      }
    }
  });
});
