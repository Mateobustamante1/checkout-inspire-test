import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  CheckoutFormData,
  ContactData,
  DeliveryOption,
  FiscalData,
  PayerData,
  Product,
  FormState,
} from '../types';
import { fetchCartProducts } from '../services/api';
import { checkoutLogger } from '../services/logger';

/**
 * Zustand Store - Checkout state management
 * 
 * Why Zustand:
 * - Minimal boilerplate compared to Redux
 * - No Provider wrapper needed
 * - Built-in DevTools integration
 * - Selector-based subscriptions prevent unnecessary re-renders
 * - Smaller bundle size (~1kb vs ~3kb for Redux)
 */

interface CheckoutStore {
  contact: ContactData;
  delivery: DeliveryOption | null;
  fiscal: FiscalData;
  payer: Partial<PayerData>;
  formState: FormState;
  products: Product[];
  discountCode: string | null;
  discountAmount: number;
  
  getSubtotal: () => number;
  getShipping: () => number;
  getTotal: () => number;
  isFormComplete: () => boolean;
  
  /** Update contact data */
  updateContact: (data: Partial<ContactData>) => void;
  
  /** Select delivery option */
  selectDelivery: (option: DeliveryOption) => void;
  
  /** Update fiscal data */
  updateFiscal: (data: Partial<FiscalData>) => void;
  
  /** Update payer data */
  updatePayer: (data: Partial<PayerData>) => void;
  
  /** Update form state */
  setFormState: (state: FormState) => void;
  
  /** Apply discount code */
  applyDiscount: (code: string, amount: number) => void;
  
  /** Remove discount */
  removeDiscount: () => void;
  
  /** Submit checkout */
  submitCheckout: () => Promise<void>;
  
  /** Load products from API */
  loadProducts: () => Promise<void>;
  
  /** Reset store */
  reset: () => void;
}

const initialState = {
  contact: {
    email: '',
    receiveNewsletter: true,
  },
  delivery: null,
  fiscal: {
    country: 'BR',
    cpfCnpj: '',
  },
  payer: {},
  formState: { status: 'idle' } as FormState,
  products: [],
  discountCode: null,
  discountAmount: 0,
};

/**
 * Zustand Store with DevTools
 * 
 * Architecture: Atomic updates - components subscribe only to what they need
 * 
 * Usage:
 * ✅ Granular: const email = useCheckoutStore(state => state.contact.email)
 * ❌ Avoid: const store = useCheckoutStore() // causes re-renders on any change
 */
export const useCheckoutStore = create<CheckoutStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      getSubtotal: () => {
        const { products } = get();
        return products.reduce(
          (sum, product) => sum + product.price * product.quantity,
          0
        );
      },

      getShipping: () => {
        const { delivery } = get();
        return delivery?.isFree ? 0 : delivery?.price || 0;
      },

      getTotal: () => {
        const { getSubtotal, getShipping, discountAmount } = get();
        return getSubtotal() + getShipping() - discountAmount;
      },

      isFormComplete: () => {
        const { contact, delivery, fiscal, payer } = get();
        
        return !!(
          contact.email &&
          delivery &&
          fiscal.cpfCnpj &&
          payer.firstName &&
          payer.lastName &&
          payer.phone &&
          payer.address?.cep &&
          payer.address?.street &&
          payer.address?.number
        );
      },

      updateContact: (data) =>
        set(
          (state) => ({
            contact: { ...state.contact, ...data },
          }),
          false,
          'updateContact'
        ),

      selectDelivery: (option) =>
        set({ delivery: option }, false, 'selectDelivery'),

      updateFiscal: (data) =>
        set(
          (state) => ({
            fiscal: { ...state.fiscal, ...data },
          }),
          false,
          'updateFiscal'
        ),

      updatePayer: (data) =>
        set(
          (state) => ({
            payer: { ...state.payer, ...data },
          }),
          false,
          'updatePayer'
        ),

      setFormState: (formState) =>
        set({ formState }, false, 'setFormState'),

      applyDiscount: (code, amount) => {
        const currentState = get();
        const totalBefore = currentState.getTotal();
        
        set(
          { discountCode: code, discountAmount: amount },
          false,
          'applyDiscount'
        );

        checkoutLogger.couponApplied(code, amount, totalBefore);
      },

      removeDiscount: () =>
        set(
          { discountCode: null, discountAmount: 0 },
          false,
          'removeDiscount'
        ),

      loadProducts: async () => {
        try {
          const products = await fetchCartProducts();
          set({ products }, false, 'loadProducts');
        } catch (error) {
          console.error('Error loading products:', error);
        }
      },

      submitCheckout: async () => {
        const store = get();

        set(
          { formState: { status: 'submitting' } },
          false,
          'submitCheckout:start'
        );

        try {
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const orderId = `ORD-${Date.now()}`;

          set(
            { formState: { status: 'success', orderId } },
            false,
            'submitCheckout:success'
          );
        } catch (error) {
          set(
            {
              formState: {
                status: 'error',
                error: error instanceof Error ? error.message : 'Erro desconhecido',
              },
            },
            false,
            'submitCheckout:error'
          );
        }
      },

      reset: () =>
        set(
          {
            ...initialState,
            products: get().products,
          },
          false,
          'reset'
        ),
    }),
    {
      name: 'Checkout Store',
    }
  )
);

/**
 * Optimized selectors - Custom hooks for common selections
 * Prevents logic duplication and improves performance
 */
export const useCheckoutSelectors = () => {
  const subtotal = useCheckoutStore((state) => state.getSubtotal());
  const shipping = useCheckoutStore((state) => state.getShipping());
  const total = useCheckoutStore((state) => state.getTotal());
  const isComplete = useCheckoutStore((state) => state.isFormComplete());

  return { subtotal, shipping, total, isComplete };
};

