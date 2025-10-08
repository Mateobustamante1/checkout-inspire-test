/**
 * Wordings / i18n
 * 
 * Centralized application texts for:
 * - Internationalization (i18n)
 * - Consistency and maintainability
 */

import ptBR from './pt-BR.json';

export type Wordings = typeof ptBR;

export const wordings = ptBR;

export const validationMessages = wordings.validation;

export const checkoutWordings = wordings.checkout;

export const orderSummaryWordings = wordings.orderSummary;

export const countriesWordings = wordings.countries;

export const getWording = (path: string): string => {
  return path.split('.').reduce((obj: any, key) => obj?.[key], wordings) || path;
};

export default wordings;
