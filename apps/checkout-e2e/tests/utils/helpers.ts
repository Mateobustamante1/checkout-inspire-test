import { Page, expect } from '@playwright/test';
import { SELECTORS } from './selectors';

/**
 * Helper Functions for E2E Tests
 * Reusable actions to reduce duplication
 */

/**
 * Fill contact information
 */
export async function fillContactInfo(page: Page, email: string, newsletter = true) {
  await page.fill(SELECTORS.email, email);
  
  const newsletterCheckbox = page.locator(SELECTORS.newsletter);
  const isChecked = await newsletterCheckbox.isChecked();
  
  if (newsletter && !isChecked) {
    await newsletterCheckbox.click();
  } else if (!newsletter && isChecked) {
    await newsletterCheckbox.click();
  }
}

/**
 * Select delivery option
 */
export async function selectDeliveryOption(page: Page, optionName: string) {
  const deliveryOption = page.locator(SELECTORS.deliveryOption(optionName));
  
  // Check if option is visible, if not, click "Mais opções"
  const isVisible = await deliveryOption.isVisible();
  if (!isVisible) {
    await page.click(SELECTORS.moreOptions);
    await page.waitForTimeout(500); // Wait for animation
  }
  
  await deliveryOption.click();
}

/**
 * Fill fiscal data (CPF/CNPJ)
 */
export async function fillFiscalData(page: Page, cpf: string) {
  await page.fill(SELECTORS.cpf, cpf);
}

/**
 * Fill payer information
 */
export async function fillPayerInfo(
  page: Page,
  data: {
    firstName: string;
    lastName: string;
    phone: string;
    cep: string;
    number: string;
    complement?: string;
  }
) {
  await page.fill(SELECTORS.firstName, data.firstName);
  await page.fill(SELECTORS.lastName, data.lastName);
  await page.fill(SELECTORS.phone, data.phone);
  
  // Fill CEP and wait for address lookup
  await page.fill(SELECTORS.cep, data.cep);
  await page.locator(SELECTORS.cep).blur();
  
  // Wait for address to load (look for address display or number field to be enabled)
  await page.waitForTimeout(1000);
  
  await page.fill(SELECTORS.number, data.number);
  
  if (data.complement) {
    await page.fill(SELECTORS.complement, data.complement);
  }
}

/**
 * Search CEP in modal
 */
export async function searchCEPInModal(page: Page, searchTerm: string) {
  await page.click(SELECTORS.cepModal);
  await expect(page.locator(SELECTORS.cepModalTitle)).toBeVisible();
  
  await page.fill(SELECTORS.cepModalSearch, searchTerm);
  await page.waitForTimeout(500); // Wait for debounce
  
  // Click first result
  await page.locator(SELECTORS.cepModalResult).first().click();
}

/**
 * Wait for form validation to complete
 */
export async function waitForValidation(page: Page, timeout = 1000) {
  await page.waitForTimeout(timeout);
}

/**
 * Check if field has error
 */
export async function hasFieldError(page: Page, fieldName: string): Promise<boolean> {
  const errorLocator = page.locator(SELECTORS.fieldError(fieldName));
  return await errorLocator.isVisible();
}

/**
 * Get error message text for a field
 */
export async function getFieldErrorMessage(page: Page, fieldName: string): Promise<string> {
  const errorLocator = page.locator(SELECTORS.fieldError(fieldName));
  return await errorLocator.textContent() || '';
}

/**
 * Check if submit button is enabled
 */
export async function isSubmitButtonEnabled(page: Page): Promise<boolean> {
  const button = page.locator(SELECTORS.submit);
  return await button.isEnabled();
}

/**
 * Take screenshot with descriptive name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
}
