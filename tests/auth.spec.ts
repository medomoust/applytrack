import { test, expect } from '@playwright/test';
import { loginAsRecruiter, loginAsApplicant } from './helpers/auth';

test.describe('Authentication', () => {
  test('should login as recruiter and see recruiter-specific content', async ({ page }) => {
    await loginAsRecruiter(page);
    
    // Check if we're on the dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Verify recruiter sees "Open Positions" instead of "Applied This Week"
    await expect(page.locator('text=Open Positions')).toBeVisible();
    
    // Navigate to job management (recruiters only)
    await page.click('text=Job Management');
    await expect(page).toHaveURL('/job-management');
    await expect(page.locator('h1')).toContainText('Job Management');
  });

  test('should login as applicant and see applicant-specific content', async ({ page }) => {
    await loginAsApplicant(page);
    
    // Check if we're on the dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Verify applicant sees "Applied This Week"
    await expect(page.locator('text=Applied This Week')).toBeVisible();
    
    // Navigate to jobs page
    await page.click('text=Browse Jobs');
    await expect(page).toHaveURL('/jobs');
    
    // Applicant should NOT have access to Job Management
    await expect(page.locator('text=Job Management')).not.toBeVisible();
  });

  test('should reject invalid login credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('#email', 'invalid@test.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=/Invalid credentials|Login failed/i')).toBeVisible({ timeout: 5000 });
  });
});
