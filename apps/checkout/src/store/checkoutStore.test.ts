import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCheckoutStore } from './checkoutStore';
import type { Product, DeliveryOption } from '../types';

/**
 * Tests for Checkout Store (Zustand)
 * 
 * Focus: Critical business logic
 * - Price calculations (subtotal, shipping, total)
 * - Discount application
 * - Form completion validation
 * - State updates
 */

describe('CheckoutStore - Calculations', () => {
  beforeEach(() => {
    // Reset store before each test - clear all state
    useCheckoutStore.setState({
      contact: { email: '', receiveNewsletter: true },
      delivery: null,
      fiscal: { country: 'BR', cpfCnpj: '' },
      payer: {},
      formState: { status: 'idle' },
      products: [],
      discountCode: null,
      discountAmount: 0,
    });
  });

  describe('getSubtotal', () => {
    it('should calculate subtotal from products', () => {
      const store = useCheckoutStore.getState();
      
      // Simulate products
      store.loadProducts = vi.fn(async () => {
        useCheckoutStore.setState({
          products: [
            { id: '1', name: 'Product 1', price: 5000, quantity: 2, imageUrl: '' },
            { id: '2', name: 'Product 2', price: 3000, quantity: 1, imageUrl: '' },
          ] as Product[],
        });
      });

      store.loadProducts();
      
      expect(store.getSubtotal()).toBe(13000); // 5000*2 + 3000*1
    });

    it('should return 0 when no products', () => {
      const store = useCheckoutStore.getState();
      expect(store.getSubtotal()).toBe(0);
    });

    it('should handle single product', () => {
      const store = useCheckoutStore.getState();
      
      useCheckoutStore.setState({
        products: [
          { id: '1', name: 'Product', price: 2500, quantity: 1, imageUrl: '' },
        ] as Product[],
      });

      expect(store.getSubtotal()).toBe(2500);
    });
  });

  describe('getShipping', () => {
    it('should return 0 for free shipping', () => {
      const store = useCheckoutStore.getState();
      
      store.selectDelivery({
        id: '1',
        name: 'Free',
        address: 'Address',
        price: 0,
        isFree: true,
      });

      expect(store.getShipping()).toBe(0);
    });

    it('should return delivery price for paid shipping', () => {
      const store = useCheckoutStore.getState();
      
      store.selectDelivery({
        id: '2',
        name: 'Express',
        address: 'Address',
        price: 1500,
        isFree: false,
      });

      expect(store.getShipping()).toBe(1500);
    });

    it('should return 0 when no delivery selected', () => {
      const store = useCheckoutStore.getState();
      expect(store.getShipping()).toBe(0);
    });
  });

  describe('getTotal', () => {
    it('should calculate total = subtotal + shipping - discount', () => {
      const store = useCheckoutStore.getState();
      
      // Setup products
      useCheckoutStore.setState({
        products: [
          { id: '1', name: 'Product', price: 10000, quantity: 1, imageUrl: '' },
        ] as Product[],
      });

      // Setup delivery
      store.selectDelivery({
        id: '1',
        name: 'Standard',
        address: 'Address',
        price: 500,
        isFree: false,
      });

      // Setup discount
      store.applyDiscount('PROMO10', 1000);

      expect(store.getTotal()).toBe(9500); // 10000 + 500 - 1000
    });

    it('should calculate total with free shipping', () => {
      const store = useCheckoutStore.getState();
      
      useCheckoutStore.setState({
        products: [
          { id: '1', name: 'Product', price: 5000, quantity: 2, imageUrl: '' },
        ] as Product[],
      });

      store.selectDelivery({
        id: '1',
        name: 'Free',
        address: 'Address',
        price: 0,
        isFree: true,
      });

      expect(store.getTotal()).toBe(10000); // 5000 * 2
    });

    it('should handle no discount', () => {
      const store = useCheckoutStore.getState();
      
      useCheckoutStore.setState({
        products: [
          { id: '1', name: 'Product', price: 3000, quantity: 1, imageUrl: '' },
        ] as Product[],
      });

      store.selectDelivery({
        id: '1',
        name: 'Standard',
        address: 'Address',
        price: 500,
        isFree: false,
      });

      expect(store.getTotal()).toBe(3500); // 3000 + 500
    });
  });
});

describe('CheckoutStore - Discount Management', () => {
  beforeEach(() => {
    useCheckoutStore.setState({
      contact: { email: '', receiveNewsletter: true },
      delivery: null,
      fiscal: { country: 'BR', cpfCnpj: '' },
      payer: {},
      formState: { status: 'idle' },
      products: [],
      discountCode: null,
      discountAmount: 0,
    });
  });

  it('should apply discount correctly', () => {
    const store = useCheckoutStore.getState();
    
    store.applyDiscount('SAVE20', 2000);

    // Get fresh state after update
    const updated = useCheckoutStore.getState();
    expect(updated.discountCode).toBe('SAVE20');
    expect(updated.discountAmount).toBe(2000);
  });

  it('should remove discount correctly', () => {
    const store = useCheckoutStore.getState();
    
    store.applyDiscount('SAVE20', 2000);
    store.removeDiscount();

    expect(store.discountCode).toBe(null);
    expect(store.discountAmount).toBe(0);
  });

  it('should replace existing discount', () => {
    const store = useCheckoutStore.getState();
    
    store.applyDiscount('SAVE20', 2000);
    store.applyDiscount('SAVE50', 5000);

    // Get fresh state after updates
    const updated = useCheckoutStore.getState();
    expect(updated.discountCode).toBe('SAVE50');
    expect(updated.discountAmount).toBe(5000);
  });
});

describe('CheckoutStore - Form Completion Validation', () => {
  beforeEach(() => {
    useCheckoutStore.setState({
      contact: { email: '', receiveNewsletter: true },
      delivery: null,
      fiscal: { country: 'BR', cpfCnpj: '' },
      payer: {},
      formState: { status: 'idle' },
      products: [],
      discountCode: null,
      discountAmount: 0,
    });
  });

  it('should return false when form is empty', () => {
    const store = useCheckoutStore.getState();
    expect(store.isFormComplete()).toBe(false);
  });

  it('should return false when missing contact', () => {
    const store = useCheckoutStore.getState();
    
    store.selectDelivery({ id: '1', name: 'Standard', address: 'Addr', price: 0, isFree: true });
    store.updateFiscal({ cpfCnpj: '12345678909' });
    store.updatePayer({
      firstName: 'John',
      lastName: 'Doe',
      phone: '11987654321',
      address: { cep: '01310100', street: 'Street', number: '123' } as any,
    });

    expect(store.isFormComplete()).toBe(false);
  });

  it('should return false when missing delivery', () => {
    const store = useCheckoutStore.getState();
    
    store.updateContact({ email: 'test@example.com' });
    store.updateFiscal({ cpfCnpj: '12345678909' });
    store.updatePayer({
      firstName: 'John',
      lastName: 'Doe',
      phone: '11987654321',
      address: { cep: '01310100', street: 'Street', number: '123' } as any,
    });

    expect(store.isFormComplete()).toBe(false);
  });

  it('should return false when missing fiscal data', () => {
    const store = useCheckoutStore.getState();
    
    store.updateContact({ email: 'test@example.com' });
    store.selectDelivery({ id: '1', name: 'Standard', address: 'Addr', price: 0, isFree: true });
    store.updatePayer({
      firstName: 'John',
      lastName: 'Doe',
      phone: '11987654321',
      address: { cep: '01310100', street: 'Street', number: '123' } as any,
    });

    expect(store.isFormComplete()).toBe(false);
  });

  it('should return false when missing payer info', () => {
    const store = useCheckoutStore.getState();
    
    store.updateContact({ email: 'test@example.com' });
    store.selectDelivery({ id: '1', name: 'Standard', address: 'Addr', price: 0, isFree: true });
    store.updateFiscal({ cpfCnpj: '12345678909' });

    expect(store.isFormComplete()).toBe(false);
  });

  it('should return false when missing address', () => {
    const store = useCheckoutStore.getState();
    
    store.updateContact({ email: 'test@example.com' });
    store.selectDelivery({ id: '1', name: 'Standard', address: 'Addr', price: 0, isFree: true });
    store.updateFiscal({ cpfCnpj: '12345678909' });
    store.updatePayer({
      firstName: 'John',
      lastName: 'Doe',
      phone: '11987654321',
    });

    expect(store.isFormComplete()).toBe(false);
  });

  it('should return true when all required fields are filled', () => {
    const store = useCheckoutStore.getState();
    
    store.updateContact({ email: 'test@example.com' });
    store.selectDelivery({ id: '1', name: 'Standard', address: 'Addr', price: 0, isFree: true });
    store.updateFiscal({ cpfCnpj: '12345678909' });
    store.updatePayer({
      firstName: 'John',
      lastName: 'Doe',
      phone: '11987654321',
      address: { cep: '01310100', street: 'Paulista Ave', number: '123' } as any,
    });

    expect(store.isFormComplete()).toBe(true);
  });
});

describe('CheckoutStore - State Updates', () => {
  beforeEach(() => {
    useCheckoutStore.setState({
      contact: { email: '', receiveNewsletter: true },
      delivery: null,
      fiscal: { country: 'BR', cpfCnpj: '' },
      payer: {},
      formState: { status: 'idle' },
      products: [],
      discountCode: null,
      discountAmount: 0,
    });
  });

  it('should update contact data', () => {
    const store = useCheckoutStore.getState();
    
    store.updateContact({ email: 'test@example.com', receiveNewsletter: false });

    // Get fresh state after update
    const updated = useCheckoutStore.getState();
    expect(updated.contact.email).toBe('test@example.com');
    expect(updated.contact.receiveNewsletter).toBe(false);
  });

  it('should update fiscal data', () => {
    const store = useCheckoutStore.getState();
    
    store.updateFiscal({ cpfCnpj: '12345678909', country: 'BR' });

    // Get fresh state after update
    const updated = useCheckoutStore.getState();
    expect(updated.fiscal.cpfCnpj).toBe('12345678909');
    expect(updated.fiscal.country).toBe('BR');
  });

  it('should update payer data partially', () => {
    const store = useCheckoutStore.getState();
    
    store.updatePayer({ firstName: 'John' });
    let updated = useCheckoutStore.getState();
    expect(updated.payer.firstName).toBe('John');
    
    store.updatePayer({ lastName: 'Doe' });
    updated = useCheckoutStore.getState();
    expect(updated.payer.firstName).toBe('John');
    expect(updated.payer.lastName).toBe('Doe');
  });

  it('should reset store while keeping products', () => {
    const store = useCheckoutStore.getState();
    
    // Setup initial state
    useCheckoutStore.setState({
      products: [
        { id: '1', name: 'Product', price: 5000, quantity: 1, imageUrl: '' },
      ] as Product[],
    });

    store.updateContact({ email: 'test@example.com' });
    store.updateFiscal({ cpfCnpj: '12345678909' });

    // Reset
    store.reset();

    // Get fresh state after reset
    const updated = useCheckoutStore.getState();
    expect(updated.contact.email).toBe('');
    expect(updated.fiscal.cpfCnpj).toBe('');
    expect(updated.products).toHaveLength(1); // Products preserved
  });
});
