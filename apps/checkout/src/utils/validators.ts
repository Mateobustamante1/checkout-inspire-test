import { VALIDATION_MESSAGES, FIELD_LENGTHS } from '../constants/form';

/**
 * Centralized validators
 * Single source of truth for validation logic
 */

export const emailValidator = (value: string): string | null => {
  if (!value) {
    return VALIDATION_MESSAGES.EMAIL.REQUIRED;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return VALIDATION_MESSAGES.EMAIL.INVALID;
  }
  
  return null;
};

export const cpfValidator = (value: string): string | null => {
  if (!value) {
    return VALIDATION_MESSAGES.CPF.REQUIRED;
  }
  
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.length !== FIELD_LENGTHS.CPF) {
    return VALIDATION_MESSAGES.CPF.INVALID;
  }
  
  return null;
};

export const phoneValidator = (value: string): string | null => {
  if (!value) {
    return VALIDATION_MESSAGES.PHONE.REQUIRED;
  }
  
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.length < FIELD_LENGTHS.PHONE_MIN) {
    return VALIDATION_MESSAGES.PHONE.INVALID;
  }
  
  return null;
};

export const cepValidator = (value: string): string | null => {
  if (!value) {
    return VALIDATION_MESSAGES.CEP.REQUIRED;
  }
  
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.length !== FIELD_LENGTHS.CEP) {
    return VALIDATION_MESSAGES.CEP.INVALID;
  }
  
  return null;
};

export const requiredValidator = (value: string | undefined | null): string | null => {
  if (!value || value.trim() === '') {
    return VALIDATION_MESSAGES.NAME.REQUIRED;
  }
  
  return null;
};

export const isEmailValid = (value: string): boolean => {
  return emailValidator(value) === null;
};

export const isCPFValid = (value: string): boolean => {
  return cpfValidator(value) === null;
};

export const isPhoneValid = (value: string): boolean => {
  return phoneValidator(value) === null;
};

export const isCEPValid = (value: string): boolean => {
  return cepValidator(value) === null;
};
