/**
 * Centralized types for checkout application
 * Single source of truth for easier refactoring and imports
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  description?: string;
}

export interface Cart {
  products: Product[];
  subtotal: number;
  shipping: number;
  total: number;
}

export interface DeliveryOption {
  id: string;
  name: string;
  address: string;
  price: number;
  isFree: boolean;
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
}

export interface ContactData {
  email: string;
  receiveNewsletter: boolean;
}

export interface FiscalData {
  country: string;
  cpfCnpj: string;
}

export interface PayerData {
  firstName: string;
  lastName: string;
  phone: string;
  address: Address;
  isAnotherPersonPickup: boolean;
  pickupPerson?: {
    firstName: string;
    lastName: string;
  };
}

export interface CheckoutFormData {
  contact: ContactData;
  delivery: DeliveryOption | null;
  fiscal: FiscalData;
  payer: PayerData;
}

/**
 * Discriminated Union for form state
 * Type-safe state machine that prevents impossible states
 */
export type FormState =
  | { status: 'idle' }
  | { status: 'validating' }
  | { status: 'submitting' }
  | { status: 'success'; orderId: string }
  | { status: 'error'; error: string };

export interface CEPResponse {
  cep: string;
  logradouro: string; // street
  complemento: string;
  bairro: string; // neighborhood
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface CheckoutResponse {
  orderId: string;
  status: 'pending' | 'confirmed' | 'failed';
  message: string;
}

export type ValidationErrors = {
  [K in keyof CheckoutFormData]?: string;
} & {
  [key: string]: string | undefined;
};

