# Playwright Test Suite

Comprehensive end-to-end testing for ApplyTrack using Playwright.

## Running Tests

### Locally
```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/auth.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run tests in UI mode (interactive)
npx playwright test --ui
```

### Against Production
```bash
PLAYWRIGHT_TEST_BASE_URL=https://applytrack.vercel.app npx playwright test
```

## Test Coverage

### Authentication (`auth.spec.ts`)
- ✅ Login as recruiter
- ✅ Login as applicant
- ✅ Role-based content verification
- ✅ Invalid credentials handling

### End-to-End Job Flow (`job-flow.spec.ts`)
- ✅ Recruiter creates job posting
- ✅ Applicant sees new job in job list
- ✅ Applicant applies to job
- ✅ Application appears in applicant's applications
- ✅ Application appears in recruiter's applications
- ✅ Dashboard stats update
- ✅ Company isolation (recruiters only see their company)

### Dashboard (`dashboard.spec.ts`)
- ✅ KPI cards display
- ✅ Charts render correctly
- ✅ Recent activity section
- ✅ Chart tooltips

### Filters & Search (`filters.spec.ts`)
- ✅ Filter applications by status
- ✅ Search jobs by title
- ✅ Filter jobs by company

## CI/CD

Tests run automatically on:
- Every push to `main`
- Every pull request
- Manual workflow dispatch

Test results are uploaded as artifacts and can be viewed in the GitHub Actions tab.

## Adding New Tests

1. Create a new `.spec.ts` file in the `tests/` directory
2. Import helpers from `tests/helpers/auth.ts`
3. Write tests using Playwright's API
4. Tests will automatically run in CI

Example:
```typescript
import { test, expect } from '@playwright/test';
import { loginAsApplicant } from './helpers/auth';

test('should do something', async ({ page }) => {
  await loginAsApplicant(page);
  // Your test logic here
});
```

## Debugging

- Run with `--headed` to see the browser
- Use `--debug` to step through tests
- Screenshots are taken on failure
- Traces are captured on retry

## Configuration

Edit `playwright.config.ts` to:
- Change browser settings
- Adjust timeouts
- Configure test environment
- Set base URL
