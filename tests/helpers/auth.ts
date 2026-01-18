import { Page, expect } from '@playwright/test';

export async function loginAsRecruiter(page: Page) {
  await page.goto('/login', { waitUntil: 'networkidle' });
  
  // Wait for the login form to be fully loaded
  await page.waitForSelector('#email', { state: 'visible', timeout: 10000 });
  
  await page.fill('#email', 'recruiter@meta.com');
  await page.fill('#password', 'Password123!');
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL('/dashboard', { timeout: 10000 });
  await expect(page.locator('h1')).toContainText('Dashboard');
}

export async function loginAsApplicant(page: Page) {
  await page.goto('/login', { waitUntil: 'networkidle' });
  
  // Wait for the login form to be fully loaded
  await page.waitForSelector('#email', { state: 'visible', timeout: 10000 });
  
  await page.fill('#email', 'john.doe@email.com');
  await page.fill('#password', 'Password123!');
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL('/dashboard', { timeout: 10000 });
  await expect(page.locator('h1')).toContainText('Dashboard');
}

export async function logout(page: Page) {
  // Click user menu and logout
  await page.click('[data-testid="user-menu"]');
  await page.click('text=Logout');
  
  // Wait for redirect to login
  await page.waitForURL('/login', { timeout: 10000 });
}

export async function signup(page: Page, email: string, password: string, name: string, role: 'applicant' | 'recruiter', company?: string) {
  await page.goto('/signup');
  
  await page.fill('#name', name);
  await page.fill('#email', email);
  await page.fill('#password', password);
  
  // Select role
  if (role === 'recruiter') {
    await page.click('text=I\'m hiring');
    if (company) {
      await page.selectOption('select[name="company"]', company);
    }
  } else {
    await page.click('text=I\'m looking for a job');
  }
  
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL('/dashboard', { timeout: 10000 });
}
