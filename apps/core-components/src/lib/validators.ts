/**
 * Validators for Brazilian data (CPF, CNPJ, CEP)
 * 
 * Architecture: Validation on both frontend and backend
 * - Frontend: Immediate UX feedback
 * - Backend: Security (never trust frontend only)
 */

/**
 * Validates CPF (Brazilian Tax ID for individuals)
 * 
 * Algorithm:
 * 1. Validates format (11 digits)
 * 2. Validates check digits using modulo 11
 * 3. Rejects known invalid CPFs (111.111.111-11, etc.)
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');

  if (cleaned.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  let sum = 0;
  let remainder: number;

  // First verification digit
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

  sum = 0;

  // Second verification digit
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

  return true;
}

/**
 * Validates CNPJ (Brazilian Tax ID for companies)
 */
export function validateCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '');

  if (cleaned.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cleaned)) return false;

  // Verification digits validation
  let length = cleaned.length - 2;
  let numbers = cleaned.substring(0, length);
  const digits = cleaned.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  length = length + 1;
  numbers = cleaned.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

/**
 * Validates CEP (Brazilian Postal Code) format
 */
export function validateCEP(cep: string): boolean {
  const cleaned = cep.replace(/\D/g, '');
  return /^\d{8}$/.test(cleaned);
}

/**
 * Validates email using standard regex
 * 
 * Trade-off: Simple vs complete regex
 * - Simple: Covers 99% of cases, easy to understand
 * - Complete (RFC 5322): Complex, hard to maintain
 * 
 * Choice: Simple + backend validation
 */
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validates Brazilian phone (mobile or landline)
 */
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // Mobile: 11 digits (area code + 9 + number)
  // Landline: 10 digits (area code + number)
  return cleaned.length === 10 || cleaned.length === 11;
}

