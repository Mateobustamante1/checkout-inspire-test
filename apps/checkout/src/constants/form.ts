import { validationMessages, wordings } from '../wordings';

/**
 * Form Constants - Centralized configuration
 * 
 * Single source of truth for form configuration.
 * Validation messages come from wordings for i18n support.
 */

export const VALIDATION_MESSAGES = {
  EMAIL: {
    REQUIRED: validationMessages.email.required,
    INVALID: validationMessages.email.invalid,
  },
  CPF: {
    REQUIRED: validationMessages.cpf.required,
    INVALID: validationMessages.cpf.invalid,
  },
  PHONE: {
    REQUIRED: validationMessages.phone.required,
    INVALID: validationMessages.phone.invalid,
  },
  CEP: {
    REQUIRED: validationMessages.cep.required,
    INVALID: validationMessages.cep.invalid,
  },
  NAME: {
    REQUIRED: validationMessages.name.required,
  },
  DELIVERY: {
    REQUIRED: validationMessages.delivery.required,
  },
} as const;

export const FORM_FIELDS = {
  EMAIL: 'email',
  CPF: 'cpf',
  PHONE: 'phone',
  CEP: 'cep',
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  NUMBER: 'number',
  COMPLEMENT: 'complement',
  COUNTRY: 'country',
} as const;

export const FIELD_LENGTHS = {
  CPF: 11,
  CEP: 8,
  PHONE_MIN: 10,
  PHONE_MAX: 11,
} as const;

export const COUNTRY_OPTIONS = [
  { value: 'BR', label: wordings.countries.BR },
  { value: 'AR', label: wordings.countries.AR, disabled: true },
  { value: 'CL', label: wordings.countries.CL, disabled: true },
  { value: 'UY', label: wordings.countries.UY, disabled: true },
  { value: 'PY', label: wordings.countries.PY, disabled: true },
  { value: 'CO', label: wordings.countries.CO, disabled: true },
] as const;

export const ANIMATION = {
  DURATION: 0.3,
  EASING: 'easeInOut',
} as const;

export const SCROLL_CONFIG = {
  TOP: 0,
  BEHAVIOR: 'smooth' as ScrollBehavior,
} as const;

export const API_TIMEOUTS = {
  CEP_LOOKUP: 5000,
  SUBMIT: 30000,
} as const;
