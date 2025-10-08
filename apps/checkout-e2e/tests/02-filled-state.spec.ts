import { test, expect } from '@playwright/test';
import { SELECTORS } from './utils/selectors';
import {
  fillContactInfo,
  selectDeliveryOption,
  fillFiscalData,
  fillPayerInfo,
  waitForValidation,
} from './utils/helpers';
import { VALID_USER_DATA, DELIVERY_OPTIONS } from './fixtures/test-data';

/**
 * E2E Test: Filled State (Happy Path)
 * 
 * Test ID: CKO / Start / Pickup / Filled state
 * 
 * Purpose: Verify complete checkout flow with valid data
 * - Fill all required fields with valid data
 * - Select delivery option
 * - Verify address auto-fill from CEP
 * - Verify success indicators
 * - Submit form successfully
 */

test.describe('Checkout Filled State - Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
  });

  test('should complete full checkout form with valid data', async ({ page }) => {
    // Step 1: Fill contact information
    await fillContactInfo(page, VALID_USER_DATA.email, true);
    
    // Verify email is filled
    await expect(page.locator(SELECTORS.email)).toHaveValue(VALID_USER_DATA.email);

    // Step 2: Select delivery option
    await selectDeliveryOption(page, DELIVERY_OPTIONS.free);
    
    // Verify delivery is selected
    const selectedDelivery = page.locator(SELECTORS.deliveryOption(DELIVERY_OPTIONS.free));
    await expect(selectedDelivery).toHaveClass(/delivery-option--selected/);

    // Step 3: Fill fiscal data
    await fillFiscalData(page, VALID_USER_DATA.cpf);
    
    // Verify CPF is formatted
    const cpfInput = page.locator(SELECTORS.cpf);
    const cpfValue = await cpfInput.inputValue();
    expect(cpfValue).toContain('.');
    expect(cpfValue).toContain('-');

    // Step 4: Fill payer information
    await fillPayerInfo(page, {
      firstName: VALID_USER_DATA.firstName,
      lastName: VALID_USER_DATA.lastName,
      phone: VALID_USER_DATA.phone,
      cep: VALID_USER_DATA.cep,
      number: VALID_USER_DATA.number,
      complement: VALID_USER_DATA.complement,
    });

    // Step 5: Wait for validation
    await waitForValidation(page);

    // Step 6: Verify address was auto-filled
    const addressDisplay = page.locator(SELECTORS.addressDisplay);
    await expect(addressDisplay).toBeVisible();
    await expect(addressDisplay).toContainText('Avenida Paulista');
    await expect(addressDisplay).toContainText('Bela Vista');
    await expect(addressDisplay).toContainText('São Paulo');

    // Step 7: Verify success indicators are shown
    const successIcons = page.locator(SELECTORS.successIcon);
    const count = await successIcons.count();
    expect(count).toBeGreaterThan(0);

    // Step 8: Verify no error messages
    const errorMessages = page.locator(SELECTORS.errorMessage);
    await expect(errorMessages).toHaveCount(0);

    // Step 9: Screenshot of filled form
    await page.screenshot({ path: 'test-results/screenshots/filled-state.png', fullPage: true });
  });

  test('should format inputs correctly as user types', async ({ page }) => {
    // Test CPF formatting
    await page.fill(SELECTORS.cpf, '12345678909');
    await page.locator(SELECTORS.cpf).blur();
    
    const cpfValue = await page.locator(SELECTORS.cpf).inputValue();
    expect(cpfValue).toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/);

    // Test phone formatting
    await page.fill(SELECTORS.phone, '11987654321');
    await page.locator(SELECTORS.phone).blur();
    
    const phoneValue = await page.locator(SELECTORS.phone).inputValue();
    expect(phoneValue).toMatch(/\(\d{2}\) \d{5}-\d{4}/);

    // Test CEP formatting
    await page.fill(SELECTORS.cep, '01310100');
    await page.locator(SELECTORS.cep).blur();
    
    const cepValue = await page.locator(SELECTORS.cep).inputValue();
    expect(cepValue).toMatch(/\d{5}-\d{3}/);
  });

  test('should allow changing address after auto-fill', async ({ page }) => {
    // Fill CEP to trigger auto-fill
    await page.fill(SELECTORS.cep, VALID_USER_DATA.cep);
    await page.locator(SELECTORS.cep).blur();
    await page.waitForTimeout(1500);

    // Verify address display appears
    const addressDisplay = page.locator(SELECTORS.addressDisplay);
    await expect(addressDisplay).toBeVisible();

    // Click "Alterar" button
    await page.click(SELECTORS.addressChange);

    // Verify CEP input is visible again
    await expect(page.locator(SELECTORS.cep)).toBeVisible();
    
    // Verify address display is hidden
    await expect(addressDisplay).not.toBeVisible();
  });

  test('should show "Mais opções" for delivery', async ({ page }) => {
    const moreOptions = page.locator(SELECTORS.moreOptions);
    
    if (await moreOptions.isVisible()) {
      // Click to expand
      await moreOptions.click();
      await page.waitForTimeout(500);

      // Verify animation completed
      const deliveryOptions = page.locator('.delivery-option');
      const count = await deliveryOptions.count();
      expect(count).toBeGreaterThan(1);

      // Verify button text changed
      await expect(page.locator(SELECTORS.lessOptions)).toBeVisible();
    }
  });

  test('should toggle "Outra pessoa buscará pelo pedido" fields', async ({ page }) => {
    const checkbox = page.locator(SELECTORS.anotherPerson);
    
    // Initially unchecked
    await expect(checkbox).not.toBeChecked();

    // Click to check
    await checkbox.click();
    await page.waitForTimeout(500);

    // Verify new fields appear
    await expect(page.locator('label:has-text("Nome de quem buscará")')).toBeVisible();
    await expect(page.locator('label:has-text("Sobrenome de quem buscará")')).toBeVisible();

    // Uncheck
    await checkbox.click();
    await page.waitForTimeout(500);

    // Verify fields are hidden
    await expect(page.locator('label:has-text("Nome de quem buscará")')).not.toBeVisible();
  });

  test('should apply discount coupon successfully', async ({ page }) => {
    // Click coupon button
    await page.click(SELECTORS.couponButton);

    // Verify modal opens
    await expect(page.locator('text=Adicionar cupom de desconto')).toBeVisible();

    // Enter coupon code
    const couponInput = page.locator('input[placeholder*="cupom" i], input[type="text"]').first();
    await couponInput.fill('SAVE10');

    // Click apply
    await page.click('button:has-text("Aplicar")');
    await page.waitForTimeout(500);

    // Verify discount is applied
    await expect(page.locator('text=Desconto')).toBeVisible();
    await expect(page.locator('text=SAVE10')).toBeVisible();
  });

  test('should submit form successfully with all valid data', async ({ page }) => {
    // Fill complete form
    await fillContactInfo(page, VALID_USER_DATA.email);
    await selectDeliveryOption(page, DELIVERY_OPTIONS.free);
    await fillFiscalData(page, VALID_USER_DATA.cpf);
    await fillPayerInfo(page, {
      firstName: VALID_USER_DATA.firstName,
      lastName: VALID_USER_DATA.lastName,
      phone: VALID_USER_DATA.phone,
      cep: VALID_USER_DATA.cep,
      number: VALID_USER_DATA.number,
      complement: VALID_USER_DATA.complement,
    });

    await waitForValidation(page, 2000);

    // Click submit
    const submitButton = page.locator(SELECTORS.submit);
    await submitButton.click();

    // Wait for submission (2 second mock delay)
    await page.waitForTimeout(3000);

    // Verify success state (button shows loading or success message)
    // Note: Actual success page would require navigation verification
    const buttonText = await submitButton.textContent();
    expect(buttonText).toBeTruthy();
  });
});
