import { test, expect } from '@playwright/test';
import { SELECTORS } from './utils/selectors';
import { INVALID_USER_DATA } from './fixtures/test-data';
import { waitForValidation } from './utils/helpers';

/**
 * E2E Test: Error State
 * 
 * Test ID: CKO / Start / Pickup / Error state
 * 
 * Purpose: Verify form validation and error handling
 * - Submit form with empty fields
 * - Submit form with invalid data
 * - Verify error messages appear
 * - Verify error styling
 * - Verify error icons
 * - Test field-level validation
 */

test.describe('Checkout Error State - Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
  });

  test('should show validation errors when submitting empty form', async ({ page }) => {
    // Click submit without filling anything
    const submitButton = page.locator(SELECTORS.submit);
    await submitButton.click();

    // Wait for validation
    await waitForValidation(page, 1000);

    // Verify error messages appear
    const errorMessages = page.locator(SELECTORS.errorMessage);
    const count = await errorMessages.count();
    expect(count).toBeGreaterThan(0);

    // Verify specific required field errors
    await expect(page.locator('text=E-mail é obrigatório')).toBeVisible();
    await expect(page.locator('text=Selecione uma opção de entrega')).toBeVisible();
    await expect(page.locator('text=CPF/CNPJ é obrigatório')).toBeVisible();
    await expect(page.locator('text=Nome é obrigatório')).toBeVisible();
    await expect(page.locator('text=Sobrenome é obrigatório')).toBeVisible();
    await expect(page.locator('text=Telefone é obrigatório')).toBeVisible();
    await expect(page.locator('text=CEP é obrigatório')).toBeVisible();

    // Take screenshot of error state
    await page.screenshot({ 
      path: 'test-results/screenshots/error-state-empty.png', 
      fullPage: true 
    });
  });

  test('should show error for invalid email format', async ({ page }) => {
    // Enter invalid email
    await page.fill(SELECTORS.email, INVALID_USER_DATA.email);
    await page.locator(SELECTORS.email).blur();

    await waitForValidation(page);

    // Click submit to trigger validation
    await page.click(SELECTORS.submit);
    await waitForValidation(page);

    // Verify error message
    await expect(page.locator('text=E-mail inválido')).toBeVisible();

    // Verify error styling (red background)
    const errorElement = page.locator(SELECTORS.errorMessage).first();
    await expect(errorElement).toHaveCSS('background-color', /rgb\(220, 38, 38\)|#dc2626/i);
  });

  test('should show error for invalid CPF', async ({ page }) => {
    // Enter CPF with all same digits (invalid)
    await page.fill(SELECTORS.cpf, INVALID_USER_DATA.cpf);
    await page.locator(SELECTORS.cpf).blur();

    await waitForValidation(page);

    // Click submit
    await page.click(SELECTORS.submit);
    await waitForValidation(page);

    // Verify error message
    await expect(page.locator('text=CPF inválido')).toBeVisible();
  });

  test('should show error for invalid phone', async ({ page }) => {
    // Enter phone with insufficient digits
    await page.fill(SELECTORS.phone, INVALID_USER_DATA.phone);
    await page.locator(SELECTORS.phone).blur();

    await waitForValidation(page);

    // Click submit
    await page.click(SELECTORS.submit);
    await waitForValidation(page);

    // Verify error message
    await expect(page.locator('text=Telefone inválido')).toBeVisible();
  });

  test('should show error for invalid CEP', async ({ page }) => {
    // Enter invalid CEP
    await page.fill(SELECTORS.cep, INVALID_USER_DATA.cep);
    await page.locator(SELECTORS.cep).blur();

    await waitForValidation(page, 2000);

    // Verify error message (either format error or not found)
    const hasError = await page.locator(SELECTORS.errorMessage).count();
    expect(hasError).toBeGreaterThan(0);
  });

  test('should show error when number field is empty', async ({ page }) => {
    // Fill other fields but leave number empty
    await page.fill(SELECTORS.firstName, 'João');
    await page.fill(SELECTORS.lastName, 'Silva');
    await page.fill(SELECTORS.phone, '11987654321');
    await page.fill(SELECTORS.cep, '01310100');
    await page.locator(SELECTORS.cep).blur();
    
    await waitForValidation(page, 2000);

    // Leave number empty and submit
    await page.click(SELECTORS.submit);
    await waitForValidation(page);

    // Verify error
    await expect(page.locator('text=Número é obrigatório')).toBeVisible();
  });

  test('should display error icon (X) on invalid fields', async ({ page }) => {
    // Fill with invalid data
    await page.fill(SELECTORS.email, INVALID_USER_DATA.email);
    await page.fill(SELECTORS.cpf, INVALID_USER_DATA.cpf);
    
    // Submit to trigger all validations
    await page.click(SELECTORS.submit);
    await waitForValidation(page);

    // Verify error messages have X icon and red styling
    const errorMessages = page.locator(SELECTORS.errorMessage);
    const firstError = errorMessages.first();

    // Check for SVG (X icon)
    const hasSvg = await firstError.locator('svg').count();
    expect(hasSvg).toBeGreaterThan(0);

    // Verify red background
    await expect(firstError).toHaveCSS('background-color', /rgb\(220, 38, 38\)|#dc2626/i);

    // Verify white text
    await expect(firstError).toHaveCSS('color', /rgb\(255, 255, 255\)|#fff/i);
  });

  test('should scroll to first error on submit', async ({ page }) => {
    // Fill only bottom fields, leave top fields empty
    await page.fill(SELECTORS.firstName, 'João');
    await page.fill(SELECTORS.lastName, 'Silva');

    // Submit
    await page.click(SELECTORS.submit);
    await waitForValidation(page);

    // Verify email field (first error) is in viewport
    const emailInput = page.locator(SELECTORS.email);
    await expect(emailInput).toBeInViewport();
  });

  test('should clear error when field becomes valid', async ({ page }) => {
    // Submit empty form to show errors
    await page.click(SELECTORS.submit);
    await waitForValidation(page);

    // Verify error exists
    await expect(page.locator('text=E-mail é obrigatório')).toBeVisible();

    // Fill email correctly
    await page.fill(SELECTORS.email, 'valid@example.com');
    await page.locator(SELECTORS.email).blur();
    await waitForValidation(page);

    // Submit again
    await page.click(SELECTORS.submit);
    await waitForValidation(page);

    // Verify email error is gone (but other errors remain)
    const emailError = page.locator('text=E-mail é obrigatório');
    await expect(emailError).not.toBeVisible();

    // But other errors should still be visible
    await expect(page.locator('text=Nome é obrigatório')).toBeVisible();
  });

  test('should validate on blur after attempted submit', async ({ page }) => {
    // Attempt submit to activate validation
    await page.click(SELECTORS.submit);
    await waitForValidation(page);

    // Now type invalid email and blur
    await page.fill(SELECTORS.email, 'invalid');
    await page.locator(SELECTORS.email).blur();
    await waitForValidation(page);

    // Error should appear immediately
    await expect(page.locator('text=E-mail inválido')).toBeVisible();

    // Fix email
    await page.fill(SELECTORS.email, 'valid@example.com');
    await page.locator(SELECTORS.email).blur();
    await waitForValidation(page);

    // Error should disappear
    const emailErrors = page.locator(SELECTORS.errorMessage).filter({ hasText: /e-mail/i });
    await expect(emailErrors).toHaveCount(0);
  });

  test('should show all errors at once on submit', async ({ page }) => {
    // Click submit without filling anything
    await page.click(SELECTORS.submit);
    await waitForValidation(page);

    // Count all error messages
    const errorMessages = page.locator(SELECTORS.errorMessage);
    const count = await errorMessages.count();

    // Should have at least 7 errors (email, delivery, cpf, firstName, lastName, phone, cep)
    expect(count).toBeGreaterThanOrEqual(7);

    // Take full screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/error-state-all-errors.png', 
      fullPage: true 
    });
  });

  test('should prevent form submission when validation fails', async ({ page }) => {
    // Fill with invalid data
    await page.fill(SELECTORS.email, INVALID_USER_DATA.email);
    await page.fill(SELECTORS.cpf, INVALID_USER_DATA.cpf);

    // Try to submit
    await page.click(SELECTORS.submit);
    await waitForValidation(page, 2000);

    // Verify we're still on the same page (URL hasn't changed)
    expect(page.url()).toContain('/checkout');

    // Verify form is still visible
    await expect(page.locator(SELECTORS.submit)).toBeVisible();
  });
});
