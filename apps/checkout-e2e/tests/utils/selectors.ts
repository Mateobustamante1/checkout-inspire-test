/**
 * Page Object Model - Selectors
 * 
 * Centralized selectors for better maintainability
 * Following best practices: prefer user-facing selectors (labels, text, roles)
 */

export const SELECTORS = {
  // Contact Section
  email: 'label:has-text("E-mail") input',
  newsletter: 'label:has-text("Receber ofertas")',
  
  // Delivery Section
  deliveryOption: (name: string) => `label:has-text("${name}")`,
  moreOptions: 'button:has-text("Mais opções")',
  lessOptions: 'button:has-text("Menos opções")',
  
  // Fiscal Section
  country: 'label:has-text("País")',
  cpf: 'label:has-text("CPF/CNPJ") input',
  
  // Payer Section
  firstName: 'label:has-text("Nome") input',
  lastName: 'label:has-text("Sobrenome") input',
  phone: 'label:has-text("Telefone") input',
  cep: 'label:has-text("CEP") input',
  cepModal: 'button:has-text("Não sei meu CEP")',
  number: 'label:has-text("Número") input',
  complement: 'label:has-text("Complemento") input',
  anotherPerson: 'label:has-text("Outra pessoa buscará")',
  
  // Address Display
  addressDisplay: '.address-display',
  addressStreet: '.address-display__street',
  addressChange: '.address-display__change',
  
  // Buttons
  submit: 'button:has-text("CONTINUAR PARA PAGAMENTO")',
  
  // Error Messages
  errorMessage: '.input__error',
  fieldError: (fieldName: string) => `label:has-text("${fieldName}") ~ .input__error`,
  
  // Success Indicators
  successIcon: '.input__success-icon',
  
  // Order Summary
  orderSummary: '.order-summary',
  productItem: '.order-summary__product',
  subtotal: '.order-summary__line:has-text("Subtotal")',
  shipping: '.order-summary__line:has-text("Frete")',
  total: '.order-summary__total',
  couponButton: 'button:has-text("Adicionar cupom")',
  
  // CEP Modal
  cepModalTitle: 'text="Selecione seu CEP"',
  cepModalSearch: 'input[placeholder*="Buscar"]',
  cepModalResult: '.cep-modal__result-item',
} as const;
