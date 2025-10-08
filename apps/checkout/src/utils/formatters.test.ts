import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatCEP,
  formatCPF,
  formatPhone,
  truncate,
} from './formatters';

/**
 * Tests for formatting utilities
 * 
 * Focus: Business logic for data presentation
 * - Currency formatting (Brazilian Real)
 * - Brazilian document formatting (CPF, CEP)
 * - Phone formatting (mobile and landline)
 */

describe('formatCurrency', () => {
  it('should format amount in cents to Brazilian Real', () => {
    const result = formatCurrency(10000);
    expect(result).toContain('100,00');
    expect(result).toContain('R$');
  });

  it('should format with decimal places', () => {
    const result = formatCurrency(10050);
    expect(result).toContain('100,50');
  });

  it('should format thousands correctly', () => {
    const result = formatCurrency(1234567);
    expect(result).toContain('12.345,67');
  });

  it('should format zero correctly', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0,00');
  });

  it('should format single digit cents', () => {
    const result = formatCurrency(105);
    expect(result).toContain('1,05');
  });

  it('should handle large amounts', () => {
    const result = formatCurrency(999999999);
    expect(result).toContain('9.999.999,99');
  });
});

describe('formatCEP', () => {
  it('should format valid 8-digit CEP', () => {
    expect(formatCEP('01310100')).toBe('01310-100');
  });

  it('should keep already formatted CEP', () => {
    expect(formatCEP('01310-100')).toBe('01310-100');
  });

  it('should return original if invalid length', () => {
    expect(formatCEP('123')).toBe('123');
  });

  it('should format CEP with letters (after cleaning)', () => {
    expect(formatCEP('01310ABC100XYZ')).toBe('01310-100');
  });

  it('should handle empty string', () => {
    expect(formatCEP('')).toBe('');
  });
});

describe('formatCPF', () => {
  it('should format valid 11-digit CPF', () => {
    expect(formatCPF('12345678909')).toBe('123.456.789-09');
  });

  it('should keep already formatted CPF', () => {
    expect(formatCPF('123.456.789-09')).toBe('123.456.789-09');
  });

  it('should return original if invalid length', () => {
    expect(formatCPF('123')).toBe('123');
  });

  it('should format CPF with dots/dashes mixed', () => {
    expect(formatCPF('123.456.78909')).toBe('123.456.789-09');
  });

  it('should handle empty string', () => {
    expect(formatCPF('')).toBe('');
  });
});

describe('formatPhone', () => {
  it('should format mobile phone (11 digits)', () => {
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
  });

  it('should format landline (10 digits)', () => {
    expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
  });

  it('should keep already formatted mobile', () => {
    expect(formatPhone('(11) 98765-4321')).toBe('(11) 98765-4321');
  });

  it('should keep already formatted landline', () => {
    expect(formatPhone('(11) 3333-4444')).toBe('(11) 3333-4444');
  });

  it('should return original if invalid length', () => {
    expect(formatPhone('123')).toBe('123');
  });

  it('should handle empty string', () => {
    expect(formatPhone('')).toBe('');
  });
});

describe('truncate', () => {
  it('should truncate text longer than max length', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
  });

  it('should keep text shorter than max length', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('should keep text equal to max length', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('should handle empty string', () => {
    expect(truncate('', 10)).toBe('');
  });

  it('should handle zero max length', () => {
    expect(truncate('Hello', 0)).toBe('...');
  });
});
