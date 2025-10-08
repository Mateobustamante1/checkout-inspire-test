/**
 * Test Data Fixtures for E2E Tests
 * 
 * Centralized test data for consistent testing across all scenarios
 */

export const VALID_USER_DATA = {
  email: 'teste@inspire.com.br',
  cpf: '123.456.789-09',
  firstName: 'João',
  lastName: 'Silva',
  phone: '(11) 98765-4321',
  cep: '01310-100',
  number: '1000',
  complement: 'Apto 42',
} as const;

export const INVALID_USER_DATA = {
  email: 'invalid-email',
  cpf: '111.111.111-11',
  phone: '123',
  cep: '00000-000',
  number: '',
} as const;

export const EXPECTED_ADDRESS = {
  street: 'Avenida Paulista',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
} as const;

export const DELIVERY_OPTIONS = {
  free: 'Grátis',
  standard: 'Standard',
  express: 'Express',
} as const;
