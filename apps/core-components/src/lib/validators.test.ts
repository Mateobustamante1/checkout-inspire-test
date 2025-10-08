import { describe, it, expect } from 'vitest';
import {
  validateCPF,
  validateCNPJ,
  validateCEP,
  validateEmail,
  validatePhone,
} from './validators';

/**
 * Tests for Brazilian data validators
 * 
 * Focus: Business logic critical for form validation
 * - Valid cases
 * - Invalid format cases
 * - Edge cases (repeated digits, empty strings)
 */

describe('validateCPF', () => {
  describe('valid CPFs', () => {
    it('should accept valid CPF with mask', () => {
      expect(validateCPF('123.456.789-09')).toBe(true);
    });

    it('should accept valid CPF without mask', () => {
      expect(validateCPF('12345678909')).toBe(true);
    });

    it('should accept another valid CPF', () => {
      expect(validateCPF('111.444.777-35')).toBe(true);
    });
  });

  describe('invalid CPFs', () => {
    it('should reject CPF with all same digits', () => {
      expect(validateCPF('111.111.111-11')).toBe(false);
      expect(validateCPF('00000000000')).toBe(false);
    });

    it('should reject CPF with wrong length', () => {
      expect(validateCPF('123.456.789')).toBe(false);
      expect(validateCPF('123')).toBe(false);
    });

    it('should reject CPF with invalid check digits', () => {
      expect(validateCPF('123.456.789-00')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateCPF('')).toBe(false);
    });

    it('should reject CPF with letters', () => {
      expect(validateCPF('123.456.789-0a')).toBe(false);
    });
  });
});

describe('validateCNPJ', () => {
  describe('valid CNPJs', () => {
    it('should accept valid CNPJ with mask', () => {
      expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
    });

    it('should accept valid CNPJ without mask', () => {
      expect(validateCNPJ('11222333000181')).toBe(true);
    });
  });

  describe('invalid CNPJs', () => {
    it('should reject CNPJ with all same digits', () => {
      expect(validateCNPJ('11.111.111/1111-11')).toBe(false);
    });

    it('should reject CNPJ with wrong length', () => {
      expect(validateCNPJ('11.222.333')).toBe(false);
    });

    it('should reject CNPJ with invalid check digits', () => {
      expect(validateCNPJ('11.222.333/0001-00')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateCNPJ('')).toBe(false);
    });
  });
});

describe('validateCEP', () => {
  describe('valid CEPs', () => {
    it('should accept CEP with mask', () => {
      expect(validateCEP('01310-100')).toBe(true);
    });

    it('should accept CEP without mask', () => {
      expect(validateCEP('01310100')).toBe(true);
    });

    it('should accept CEP starting with 0', () => {
      expect(validateCEP('01234-567')).toBe(true);
    });
  });

  describe('invalid CEPs', () => {
    it('should reject CEP with wrong length', () => {
      expect(validateCEP('123')).toBe(false);
      expect(validateCEP('123456789')).toBe(false);
    });

    it('should reject CEP with letters', () => {
      expect(validateCEP('0131A-100')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateCEP('')).toBe(false);
    });
  });
});

describe('validateEmail', () => {
  describe('valid emails', () => {
    it('should accept standard email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    it('should accept email with subdomain', () => {
      expect(validateEmail('user@mail.example.com')).toBe(true);
    });

    it('should accept email with plus sign', () => {
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should accept email with dots', () => {
      expect(validateEmail('first.last@example.com')).toBe(true);
    });
  });

  describe('invalid emails', () => {
    it('should reject email without @', () => {
      expect(validateEmail('userexample.com')).toBe(false);
    });

    it('should reject email without domain', () => {
      expect(validateEmail('user@')).toBe(false);
    });

    it('should reject email without username', () => {
      expect(validateEmail('@example.com')).toBe(false);
    });

    it('should reject email with spaces', () => {
      expect(validateEmail('user @example.com')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateEmail('')).toBe(false);
    });
  });
});

describe('validatePhone', () => {
  describe('valid phones', () => {
    it('should accept mobile phone (11 digits)', () => {
      expect(validatePhone('11987654321')).toBe(true);
    });

    it('should accept landline (10 digits)', () => {
      expect(validatePhone('1133334444')).toBe(true);
    });

    it('should accept phone with mask (mobile)', () => {
      expect(validatePhone('(11) 98765-4321')).toBe(true);
    });

    it('should accept phone with mask (landline)', () => {
      expect(validatePhone('(11) 3333-4444')).toBe(true);
    });
  });

  describe('invalid phones', () => {
    it('should reject phone with wrong length', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('123456789012')).toBe(false);
    });

    it('should reject phone with 9 digits', () => {
      expect(validatePhone('123456789')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validatePhone('')).toBe(false);
    });
  });
});
