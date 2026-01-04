# Playwright Tests for Gallery and Lightbox

## Overview

These Playwright tests verify the functionality of the Gallery and Lightbox components in the photography gallery application.

## Test Structure

### Test Files

1. **`gallery-lightbox.spec.ts`** - Comprehensive test suite for gallery and lightbox functionality
2**`helpers.ts`** - Helper classes and utility functions
3**`example.spec.ts`** - Example tests from Playwright

### Test Categories

1. **Gallery Tests**
   - Gallery loads with photos
   - Gallery cards have correct attributes (lazy loading, classes)
   - Responsive layout across different viewports
   - Image source paths are correct

2. **Lightbox Tests**
   - Lightbox opens when clicking gallery images
   - EXIF metadata is displayed correctly
   - Navigation buttons (Previous/Next) work properly
   - Keyboard navigation (Arrow keys, Escape)
   - Close functionality (X button, click outside, Escape key)
   - Touch/swipe navigation for mobile devices

3. **Performance Tests**
   - Gallery load time (should be under 5 seconds)
   - Lightbox open time (should be under 1 second)

4. **Accessibility Tests**
   - ARIA attributes for modal dialogs
   - Alt texts for all images
   - Proper button labels and types

## Prerequisites

- Node.js 18 or higher
- Playwright installed (`@playwright/test` in devDependencies)
- The application must be running (locally or accessible via URL)

## Installation

```bash
# Install Playwright browsers
npx playwright install

# Or use the provided script
npm run test:e2e:install
```

## Configuration

The tests use `playwright.config.ts` with the following key settings:

- **baseURL**: `http://localhost:5173` (override with `BASE_URL` environment variable)
- **Test directory**: `./tests`
- **Browsers**: Chrome and Firefox
- **Parallel execution**: Enabled
- **Retries**: 2 retries on CI, 0 locally
- **Reporter**: HTML reporter

## Available Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:chromium": "playwright test --project=chromium",
    "test:e2e:firefox": "playwright test --project=firefox",
    "test:e2e:report": "playwright show-report",
    "test:e2e:install": "playwright install",
    "test:e2e:codegen": "playwright codegen"
  }
}
```

## Running Tests

### Basic Test Execution

```bash
# Run all tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug
```

### Local Development

```bash
# 1. Start your application
npm run dev
# App runs on http://localhost:5173

# 2. Run tests against local instance
BASE_URL=http://localhost:5173 npm run test:e2e

# 3. Or run specific test file
BASE_URL=http://localhost:5173 npx playwright test tests/gallery-lightbox.spec.ts
```

### Browser-Specific Tests

```bash
# Run only in Chrome
npm run test:e2e:chromium

# Run only in Firefox
npm run test:e2e:firefox
```

### Filtering Tests

```bash
# Run tests containing "Lightbox" in the name
npx playwright test --grep "Lightbox"

# Run tests excluding "Performance"
npx playwright test --grep-invert "Performance"

# Run a specific test
npx playwright test tests/gallery-lightbox.spec.ts:17
```

## Test Data Requirements

The tests expect:
1. A valid `photos.json` file in `src/assets/`
2. Image directories (`grid/` and `lightbox/`) with actual photos
3. EXIF metadata in the JSON for lightbox display

## Page Object Pattern

The tests use a Page Object Pattern for better maintainability:

```typescript
// Example usage
import { GalleryPage } from './helpers';

test('Gallery loads with photos', async ({ page }) => {
  const galleryPage = new GalleryPage(page);
  await galleryPage.navigate();
  
  const cardCount = await galleryPage.getGalleryCardCount();
  expect(cardCount).toBeGreaterThan(0);
});
```

## Performance Testing

The tests include performance measurements:

```typescript
test('Gallery loads within performance budget', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('/');
  await page.waitForSelector('.gallery-card', { state: 'visible' });
  
  const loadTime = Date.now() - startTime;
  console.log(`Gallery load time: ${loadTime}ms`);
  
  expect(loadTime).toBeLessThan(5000); // Should load under 5 seconds
});
```

## Accessibility Testing

The tests verify accessibility features:

```typescript
test('Accessibility checks', async ({ page }) => {
  const galleryImages = page.locator('.gallery-card img');
  const firstImage = galleryImages.first();
  
  // Images should have alt attributes
  const altText = await firstImage.getAttribute('alt');
  expect(altText).toBeTruthy();
  
  // Lightbox should have proper ARIA attributes
  await firstImage.click();
  const lightboxModal = page.locator('.modal.show');
  await expect(lightboxModal).toHaveAttribute('role', 'dialog');
  await expect(lightboxModal).toHaveAttribute('aria-modal', 'true');
});
```

## Troubleshooting

### Common Issues

1. **Tests fail with timeout**
   - Ensure the application is running
   - Check the `baseURL` in `playwright.config.ts`
   - Increase timeouts if needed: `await page.waitForSelector('.selector', { timeout: 10000 })`

2. **Images not loading**
   - Verify `photos.json` exists and has correct paths
   - Check that image directories exist
   - Ensure the build process has generated thumbnails

3. **Lightbox doesn't open**
   - Check CSS selectors match your implementation
   - Verify the lightbox component is properly mounted
   - Check for JavaScript errors in the console

4. **Playwright can't find browsers**
   ```bash
   npx playwright install
   ```

### Debugging Tips

```bash
# Run with trace
npx playwright test --trace on

# Show test report
npm run test:e2e:report

# Generate test code (record interactions)
npm run test:e2e:codegen
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Extending Tests

### Adding New Tests

1. Create a new `.spec.ts` file in the `tests/` directory
2. Follow the existing patterns for test structure
3. Use the helper classes from `helpers.ts` when possible

### Visual Regression Tests

```typescript
test('visual regression - gallery', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('gallery.png', {
    maxDiffPixels: 100,
  });
});
```

### API Testing

If your application has APIs, you can test them too:

```typescript
test('API returns photo data', async ({ request }) => {
  const response = await request.get('/api/photos');
  expect(response.ok()).toBeTruthy();
  
  const photos = await response.json();
  expect(photos.length).toBeGreaterThan(0);
});
```

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Selectors**: Use stable selectors (data-test-id attributes are ideal)
3. **Waiting**: Use `waitForSelector` instead of fixed timeouts
4. **Assertions**: Make assertions specific and meaningful
5. **Cleanup**: Close modals and reset state after tests
6. **Reporting**: Use the HTML reporter for detailed test results

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Test Generator](https://playwright.dev/docs/codegen)

## Support

For issues with these tests:
1. Check the Playwright documentation
2. Review the test output and error messages
3. Adjust selectors to match your component implementation
4. Update performance thresholds based on your environment
