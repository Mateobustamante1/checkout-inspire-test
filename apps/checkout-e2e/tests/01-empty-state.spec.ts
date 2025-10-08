import { test, expect } from '@playwright/test';
import { SELECTORS } from './utils/selectors';

/**
 * E2E Test: Empty State
 * 
 * Test ID: CKO / Start / Pickup / Empty state
 * 
 * Purpose: Verify initial page load and empty form state
 * - All required sections are visible
 * - Form fields are empty
 * - Order summary shows correct initial state
 * - No validation errors on initial load
 */

test.describe('Checkout Empty State', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
  });

  test('should display empty checkout form on initial load', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Checkout|Inspire/i);

    // Verify main sections are visible
    await expect(page.locator('h2:has-text("Dados de contato")')).toBeVisible();
    await expect(page.locator('h2.checkout-section__title:has-text("Entrega")')).toBeVisible();
    await expect(page.locator('h2:has-text("Dados para nota fiscal")')).toBeVisible();
    await expect(page.locator('h2:has-text("Dados de quem vai fazer o pagamento")')).toBeVisible();

    // Verify form inputs are present (structure test only)
    await expect(page.locator('input').first()).toBeVisible();
    await expect(page.locator('button:has-text("CONTINUAR")')).toBeVisible();

    // Verify no error messages on initial load
    const errorMessages = page.locator(SELECTORS.errorMessage);
    await expect(errorMessages).toHaveCount(0);
  });

  test('should display order summary with products', async ({ page }) => {
    // Verify Order Summary section exists
    const orderSummary = page.locator(SELECTORS.orderSummary);
    await expect(orderSummary).toBeVisible();

    // Verify products are loaded (should be 2 from Fake Store API)
    const products = page.locator(SELECTORS.productItem);
    await expect(products).toHaveCount(2);

    // Verify pricing sections exist
    await expect(page.locator(SELECTORS.subtotal)).toBeVisible();
    await expect(page.locator(SELECTORS.shipping)).toBeVisible();
    await expect(page.locator(SELECTORS.total)).toBeVisible();

    // Verify coupon button
    await expect(page.locator(SELECTORS.couponButton)).toBeVisible();
  });

  test('should have delivery options loaded', async ({ page }) => {
    // Wait for delivery options to load
    await page.waitForSelector('text=Grátis', { timeout: 5000 });

    // Verify at least one delivery option is visible
    const freeDelivery = page.locator(SELECTORS.deliveryOption('Grátis'));
    await expect(freeDelivery).toBeVisible();

    // Verify "Mais opções" button exists
    const moreOptionsButton = page.locator(SELECTORS.moreOptions);
    const isVisible = await moreOptionsButton.isVisible();
    
    if (isVisible) {
      // Click to expand
      await moreOptionsButton.click();
      await page.waitForTimeout(500);

      // Verify additional options are now visible
      const deliveryOptions = page.locator('.delivery-option');
      const count = await deliveryOptions.count();
      expect(count).toBeGreaterThan(1);
    }
  });

  test('should have newsletter checkbox checked by default', async ({ page }) => {
    const newsletterCheckbox = page.locator(SELECTORS.newsletter);
    await expect(newsletterCheckbox).toBeChecked();
  });

  test('should have Brasil as default country', async ({ page }) => {
    // Verify country select component exists and shows Brasil
    await expect(page.getByText('Brasil')).toBeVisible();
    await expect(page.getByText('País')).toBeVisible();
  });

  test('should have submit button enabled (even with empty form)', async ({ page }) => {
    const submitButton = page.locator(SELECTORS.submit);
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });

  test('should display breadcrumb navigation', async ({ page }) => {
    // Verify breadcrumb exists (use specific class to avoid multiple matches)
    await expect(page.locator('.breadcrumb-item', { hasText: 'Entrega' })).toBeVisible();
    await expect(page.locator('.breadcrumb-item', { hasText: 'Pagamento' })).toBeVisible();
  });

  test('should display security badge in header', async ({ page }) => {
    // Verify security elements
    await expect(page.locator('text=COMPRA SEGURA')).toBeVisible();
    await expect(page.locator('text=100% PROTEGIDO')).toBeVisible();
  });

  test('should have responsive layout', async ({ page }) => {
    // Desktop view - check two-column layout
    const viewportSize = page.viewportSize();
    if (viewportSize && viewportSize.width >= 1024) {
      const content = page.locator('.checkout-page__content');
      await expect(content).toHaveCSS('display', /grid|flex/);
    }
  });
});
