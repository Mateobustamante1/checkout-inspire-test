# Checkout E2E Tests

End-to-End tests for the Inspire Checkout application using Playwright.

## 📋 Test Coverage

### 1. **Empty State** (`01-empty-state.spec.ts`)
**Test ID:** CKO / Start / Pickup / Empty state

Tests initial page load and empty form state:
- ✅ All sections are visible
- ✅ Form fields are empty
- ✅ Order summary displays products
- ✅ No validation errors on load
- ✅ Default values set correctly

### 2. **Filled State** (`02-filled-state.spec.ts`)
**Test ID:** CKO / Start / Pickup / Filled state

Tests happy path with valid data:
- ✅ Complete form submission
- ✅ Input formatting (CPF, CEP, Phone)
- ✅ Address auto-fill from CEP
- ✅ Delivery option selection
- ✅ Success indicators display
- ✅ Discount coupon application

### 3. **Error State** (`03-error-state.spec.ts`)
**Test ID:** CKO / Start / Pickup / Error state

Tests validation and error handling:
- ✅ Empty field validation
- ✅ Invalid format errors
- ✅ Error message styling
- ✅ Error icons (X)
- ✅ Scroll to first error
- ✅ Error clearing on fix

---

## 🚀 Quick Start

### Prerequisites

```bash
# Install dependencies (from project root)
pnpm install

# Make sure checkout app is built
cd apps/checkout
pnpm build
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run with UI mode (recommended for development)
pnpm test:ui

# Run in headed mode (see browser)
pnpm test:headed

# Debug mode
pnpm test:debug

# Run specific test file
pnpm test tests/01-empty-state.spec.ts

# View last test report
pnpm test:report
```

---

## 📁 Project Structure

```
checkout-e2e/
├── tests/
│   ├── fixtures/
│   │   └── test-data.ts          # Test data constants
│   ├── utils/
│   │   ├── selectors.ts          # Page Object Model selectors
│   │   └── helpers.ts            # Reusable test functions
│   ├── 01-empty-state.spec.ts    # Empty state tests
│   ├── 02-filled-state.spec.ts   # Filled state tests
│   └── 03-error-state.spec.ts    # Error state tests
├── playwright.config.ts           # Playwright configuration
├── package.json
└── README.md
```

---

## 🎯 Test Strategy

### Page Object Model (POM)
We use a **selector-based POM** approach:
- Selectors centralized in `tests/utils/selectors.ts`
- Helper functions in `tests/utils/helpers.ts`
- Test data in `tests/fixtures/test-data.ts`

### Selector Priority (Best Practices)
1. **User-facing attributes**: `label`, `text`, `role`
2. **Test IDs**: `data-testid` (when needed)
3. **CSS selectors**: Last resort

### Why This Approach?
- **Maintainable**: One place to update selectors
- **Readable**: Tests read like user actions
- **Resilient**: Less brittle than XPath or deep CSS

---

## 🧪 Writing New Tests

### Example Test

```typescript
import { test, expect } from '@playwright/test';
import { SELECTORS } from './utils/selectors';
import { fillContactInfo } from './utils/helpers';

test('should do something', async ({ page }) => {
  await page.goto('/checkout');
  
  // Use helpers
  await fillContactInfo(page, 'test@example.com');
  
  // Use selectors
  await page.click(SELECTORS.submit);
  
  // Assertions
  await expect(page.locator(SELECTORS.errorMessage)).toBeVisible();
});
```

---

## 📊 Test Reports

### HTML Report
After running tests, view the HTML report:

```bash
pnpm test:report
```

### Screenshots
Failed tests automatically capture screenshots in `test-results/screenshots/`

### Videos
Videos are retained only for failed tests (configurable in `playwright.config.ts`)

### Trace Viewer
For failed tests, traces are available for debugging:

```bash
npx playwright show-trace test-results/.../trace.zip
```

---

## ⚙️ Configuration

### Browser Configuration
Edit `playwright.config.ts` to:
- Add more browsers (Firefox, Safari, Mobile)
- Change viewport sizes
- Adjust timeouts
- Configure parallel execution

### Environment Variables
```bash
# Run in CI mode
CI=true pnpm test

# Change base URL
BASE_URL=https://staging.example.com pnpm test
```

---

## 🐛 Debugging Tests

### Interactive Mode
```bash
pnpm test:ui
```

### Headed Mode
```bash
pnpm test:headed
```

### Debug Mode (step-by-step)
```bash
pnpm test:debug
```

### Codegen (record tests)
```bash
pnpm test:codegen
```

---

## 📝 Best Practices

### ✅ DO
- Use user-facing selectors (`label`, `text`, `role`)
- Write independent tests (no shared state)
- Use Page Object Model for reusability
- Add `waitForLoadState` after navigation
- Use descriptive test names
- Take screenshots for important states

### ❌ DON'T
- Don't use brittle selectors (deep CSS, XPath)
- Don't depend on test execution order
- Don't hard-code wait times (use `waitForSelector`)
- Don't test implementation details
- Don't skip error handling

---

## 🔧 Troubleshooting

### Tests Timing Out
- Increase timeout in `playwright.config.ts`
- Check if checkout app is running
- Verify network speed

### Flaky Tests
- Add explicit waits (`waitForSelector`)
- Use `waitForLoadState('networkidle')`
- Check for race conditions

### Selector Not Found
- Verify element exists in browser
- Check spelling/text content
- Use `page.pause()` to inspect

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)

---

## 👥 Contributing

When adding new tests:
1. Follow existing naming conventions
2. Add helpers for reusable actions
3. Update this README
4. Ensure tests pass locally before committing

---

**Last Updated:** October 2025  
**Maintainers:** Inspire Frontend Team
