# Coding Standards - Inspire Checkout Project

## 🎯 Architecture Philosophy

This project follows principles of **clean architecture**, **composition over inheritance**, and **separation of concerns**. Each decision is oriented towards maintaining maintainable, testable, and scalable code.

---

## 📐 Implemented Design Patterns

### 1. **Custom Hooks Pattern**

**Why:** Separates business logic from UI components, promoting reusability and testability.

**When to use:**
- Complex form logic that needs to be isolated from presentation
- State management and side effects that can be shared across components
- When you need to keep components clean and focused on rendering

**Implementation:**
```tsx
// ✅ Good - Custom hook isolates form logic
export const useCheckoutForm = () => {
  const emailRef = useRef<SecureInputRef>(null);
  const { updateContact, contact } = useCheckoutStore();
  
  const handleEmailChange = useCallback((value: string) => {
    updateContact({ email: value });
  }, [updateContact]);
  
  return {
    refs: { emailRef },
    contact,
    handleEmailChange,
    validators: { emailValidator },
  };
};

// Usage in component
const CheckoutPage = () => {
  const form = useCheckoutForm();
  
  return (
    <SecureInput
      ref={form.refs.emailRef}
      onValueChange={form.handleEmailChange}
    />
  );
};
```

**Alternatives considered:**
- **Render Props:** Rejected due to verbosity and excessive nesting
- **HOCs:** Rejected due to loss of type inference and prop collision

---

### 2. **Secure Fields with Refs (useImperativeHandle)**

**Why:** For sensitive data (CPF, email, address) we need full control over the value without exposing it in the DOM or React state.

**Implementation:**
```tsx
// SecureInput - Doesn't expose value in DOM props or React state
export const SecureInput = forwardRef<SecureInputRef, SecureInputProps>((props, ref) => {
  const rawValue = useRef<string>('');
  
  useImperativeHandle(ref, () => ({
    getValue: () => rawValue.current,
    setValue: (val: string) => {
      rawValue.current = val;
    },
    validate: () => validator?.(rawValue.current) || null,
  }));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    rawValue.current = value;
    props.onValueChange?.(value);
  };

  return (
    <Input
      onChange={handleChange}
      autoComplete="off"
      data-lpignore="true"
      data-form-type="other"
    />
  );
});
```

**Why not regular controlled components:**
- Reduces exposure of sensitive data in React DevTools
- Prevents malicious browser extensions from reading state
- Complies with PCI-DSS security best practices for payment data
- Values not visible in error snapshots or monitoring tools

---

### 3. **State Management with Zustand**

**Why Zustand over Context API:**
- ✅ No unnecessary re-renders (selector-based subscriptions)
- ✅ Simpler API with less boilerplate
- ✅ Integrated DevTools
- ✅ Better performance with large component trees
- ✅ Built-in middleware support

**Implementation:**
```tsx
// ✅ Zustand Store with atomic updates
export const useCheckoutStore = create<CheckoutStore>()(
  devtools(
    (set, get) => ({
      contact: { email: '', receiveNewsletter: true },
      
      // Atomic updates - only re-renders components using this field
      updateContact: (data) =>
        set(
          (state) => ({ contact: { ...state.contact, ...data } }),
          false,
          'updateContact'
        ),
      
      // Computed values with getters
      getSubtotal: () => {
        const { products } = get();
        return products.reduce((sum, p) => sum + p.price * p.quantity, 0);
      },
    }),
    { name: 'Checkout Store' }
  )
);

// Usage with selectors to avoid re-renders
const email = useCheckoutStore((state) => state.contact.email);
const updateContact = useCheckoutStore((state) => state.updateContact);
```

**Why not Context API:**
- Context causes re-render of entire tree when any value changes
- Requires multiple contexts or extensive manual memoization
- Zustand provides slices and selectors out-of-the-box

---

### 4. **Validation Strategy - Zod Schemas**

**Why Zod:**
- ✅ Type-safe: automatically infers TypeScript types
- ✅ Composable: reusable schemas
- ✅ Customizable error messages
- ✅ Async validations (e.g., verify CPF with API)
- ✅ Transform and preprocess capabilities

**Implementation:**
```tsx
// ✅ Composable and type-safe schema
export const addressSchema = z.object({
  cep: z.string()
    .min(1, 'CEP é obrigatório')
    .refine(validateCEP, 'CEP inválido'),
  street: z.string().min(3, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  city: z.string().min(2),
  state: z.string().length(2),
});

export const checkoutSchema = z.object({
  email: z.string().email('Email inválido'),
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  address: addressSchema, // Composition
});

// Automatic type inference
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
```

**Alternatives considered:**
- **Yup:** Less type-safe, more verbose API
- **Joi:** Designed for Node.js, larger bundle size
- **Manual validation:** Not scalable, error-prone

---

## 🏗️ Component Architecture

### Abstraction Hierarchy

```
1. Design Tokens          → Colors, spacing, typography (CSS variables)
2. Base Components        → Button, Input, Checkbox, SecureInput
3. Composite Components   → Header, Modal, CustomSelect
4. Feature Components     → CheckoutForm, OrderSummary, CEPModal
5. Pages                  → CheckoutPage
```

**Golden Rule:** A component should only import from lower or same level, never higher.

---

### Base Components - Principles

```tsx
// ✅ Flexible and extensible using CVA
const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'button--primary',
      secondary: 'button--secondary',
      ghost: 'button--ghost',
    },
    size: {
      sm: 'button--sm',
      md: 'button--md',
      lg: 'button--lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface ButtonProps
  extends ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
```

**Decisions:**
- **forwardRef:** Allows refs for focus management and library integrations
- **ComponentPropsWithoutRef:** Type-safety for native HTML props
- **className prop:** Allows style override without breaking encapsulation
- **CVA (class-variance-authority):** Type-safe, scalable variant management

---

## 🔐 Security Best Practices

### 1. Secure Fields for Sensitive Data

**Data requiring SecureInput:**
- ✅ CPF/CNPJ (Brazilian Tax IDs)
- ✅ Email (PII - Personally Identifiable Information)
- ✅ Full address
- ✅ Phone number

**Implementation:**
```tsx
// ✅ Secure implementation
const cpfRef = useRef<SecureInputRef>(null);

const handleSubmit = async () => {
  const cpf = cpfRef.current?.getValue();
  // Send directly to API, don't store in public state
  await api.submitCheckout({ cpf });
};

<SecureInput
  ref={cpfRef}
  mask="cpf"
  validator={validateCPF}
/>
```

### 2. Input Sanitization

```tsx
// ✅ Sanitize before validation
const sanitizeCPF = (value: string) => value.replace(/[^\d]/g, '');
const sanitizeEmail = (value: string) => value.trim().toLowerCase();
```

### 3. No Sensitive Data in Logs

**Implemented logger service with PII sanitization:**

```tsx
// ❌ Avoid
console.log('Form data:', formData); // Exposes CPF, email, etc.

// ✅ Good - Our implementation
checkoutLogger.submitted({
  subtotal: getSubtotal(),
  total: getTotal(),
  emailDomain: email.split('@')[1], // Only domain, not full email
  cepRegion: sanitizePII.cep(cep), // Masked: "12345XXX"
  timeOnPage: duration,
});
```

---

## 🎨 Styles - CSS/SCSS Architecture

### Structure

```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.css          # Component styles
│   └── Button.stories.tsx
└── Input/
    ├── Input.tsx
    ├── Input.css
    └── Input.stories.tsx
```

**Note:** We use component-level CSS files instead of global SCSS structure for better component isolation.

### BEM Naming Convention

```scss
// ✅ Block Element Modifier
.button {
  // Block base styles
  
  &__spinner {
    // Element
  }
  
  &--primary {
    // Modifier
  }
  
  &--loading {
    .button__spinner {
      animation: spin 1s linear infinite;
    }
  }
}
```

**Why BEM:**
- Prevents name collisions
- Self-documented
- Easy to search in codebase
- Clear component structure

---

## 📦 File Organization

### Component File Structure

```
Button/
├── Button.tsx           # Implementation
├── Button.css           # Styles
├── Button.stories.tsx   # Storybook
├── Button.test.tsx      # Tests (if needed)
└── index.ts             # Public API (barrel export)
```

**Why:**
- **Colocation:** Everything related to the component is together
- **Easy to delete:** Remove folder = remove entire feature
- **Clear public API:** Only export what's necessary from index.ts
- **Better for code splitting:** Each component is a natural boundary

---

## 🧪 Testing Strategy

### Testing Pyramid

```
       E2E (10%)
      /          \
   Integration (20%)
  /                  \
 Unit Tests (70%)
```

### What to test at each level

**Unit Tests (components):**
- Rendering with different props
- User interactions (click, input)
- Internal states

**Integration Tests:**
- Complete form flow
- Validations between related fields
- Integration with Zustand store

**E2E:**
- Complete checkout happy path
- Critical error scenarios

**Note:** This project includes the infrastructure for testing (Vitest, React Testing Library) but focuses on implementation first, tests second.

---

## 🚀 Performance Optimizations Implemented

### 1. Code Splitting & Lazy Loading

**Implemented:**
```tsx
// ✅ Route-based code splitting
const CheckoutPage = lazy(() => 
  import('./pages/CheckoutPage/CheckoutPage').then(module => ({
    default: module.CheckoutPage
  }))
);

// App structure with Suspense
<Suspense fallback={<LoadingFallback />}>
  <RouterProvider router={router} />
</Suspense>
```

**Vite configuration for manual chunks:**
```ts
// vite.config.ts
rollupOptions: {
  output: {
    manualChunks: (id) => {
      if (id.includes('node_modules')) {
        if (id.includes('react')) return 'vendor';
        if (id.includes('zustand') || id.includes('framer-motion')) return 'state';
        if (id.includes('@inspire/core-components')) return 'ui';
      }
    },
  },
}
```

### 2. Strategic Memoization

**Implemented in hooks:**
```tsx
// ✅ useCheckoutForm.ts - Memoized callbacks
const handleEmailChange = useCallback((value: string) => {
  updateContact({ email: value });
}, [updateContact]);

const validateAllFields = useCallback(() => {
  // Expensive validation logic
}, [contact.email, delivery, fiscal.cpfCnpj, payer]);

// ✅ useDeliveryOptions.ts - Memoized computed values
const firstOption = useMemo(
  () => deliveryOptions[0] || null,
  [deliveryOptions]
);
```

### 3. Zustand Selector-based Subscriptions

**Prevents unnecessary re-renders:**
```tsx
// ✅ Good - Only re-renders when email changes
const email = useCheckoutStore((state) => state.contact.email);

// ✅ Custom selector hook for common patterns
export const useCheckoutSelectors = () => {
  const subtotal = useCheckoutStore((state) => state.getSubtotal());
  const shipping = useCheckoutStore((state) => state.getShipping());
  const total = useCheckoutStore((state) => state.getTotal());
  
  return { subtotal, shipping, total };
};
```

---

## 📝 TypeScript Standards

### 1. Interfaces for Extensible Objects, Types for Props

**Implemented pattern:**
```tsx
// ✅ Interface for stores (can be extended)
export interface CheckoutStore {
  contact: ContactData;
  updateContact: (data: Partial<ContactData>) => void;
}

// ✅ Type for component props (more flexible)
export type ButtonProps = ComponentPropsWithoutRef<'button'> & 
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
  };
```

**Why:**
- Types are more flexible (unions, intersections)
- Interfaces have better error messages for object shapes
- Interfaces can be extended/merged

### 2. Discriminated Unions for State Machines

**Implemented in form state:**
```tsx
// ✅ Type-safe state machine
export type FormState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; orderId: string }
  | { status: 'error'; error: string };

// Compiler forces handling all cases
const renderFormState = (state: FormState) => {
  switch (state.status) {
    case 'idle': return <Form />;
    case 'submitting': return <Spinner />;
    case 'success': return <Success orderId={state.orderId} />;
    case 'error': return <Error message={state.error} />;
  }
};
```

### 3. Utility Types

**Used throughout the codebase:**
```tsx
// ✅ Reuse and transform existing types
type PartialContact = Partial<ContactData>;
type RequiredAddress = Required<AddressData>;
type EmailField = Pick<ContactData, 'email'>;
type ProductWithoutId = Omit<Product, 'id'>;
```

---

## 🌐 Internationalization (i18n)

### Centralized Wordings Pattern

**Implemented structure:**
```
wordings/
├── index.ts          # Type-safe exports
└── pt-BR.json        # Brazilian Portuguese translations
```

**Usage:**
```tsx
// ✅ Type-safe wording access
import { checkoutWordings as w } from '../wordings';

<h2>{w.sections.contact}</h2>
<Input label={w.fields.email} />
<Button>{w.buttons.continueToPayment}</Button>
```

**Benefits:**
- Single source of truth for all text
- Easy to add new languages (create `en-US.json`, `es-ES.json`)
- Type-safe with TypeScript
- Easy to find unused text

---

## 📊 Observability

### Logger Service Implementation

**Implemented features:**
- ✅ PII sanitization (LGPD/GDPR compliant)
- ✅ Session tracking
- ✅ Performance tracking
- ✅ Strategic event logging (not over-logging)

**Usage:**
```tsx
// Critical business events
checkoutLogger.started({ productsCount: 2 });

checkoutLogger.cepLookupSuccess(cep, { city, state });

checkoutLogger.submitted({
  subtotal,
  total,
  emailDomain: email.split('@')[1], // No full email
  cepRegion: sanitizePII.cep(cep),  // Masked: "12345XXX"
  timeOnPage: duration,
});
```

---

## 🔄 Git Workflow

### Commit Convention (Conventional Commits)

```bash
feat: add secure input component
fix: correct CPF validation regex
docs: update coding standards
refactor: extract validation logic to hooks
test: add tests for address form
chore: update dependencies
style: format code with prettier
```

### Branch Strategy

```
main              → Production
├── develop       → Integration
    ├── feat/secure-inputs
    ├── feat/checkout-form
    └── fix/cep-validation
```

---

## 📚 Documentation Standards

### TSDoc for Components

**Implemented pattern:**
```tsx
/**
 * SecureInput - Input for sensitive data that doesn't expose values in DevTools
 * 
 * Security Architecture:
 * 1. Raw value stored in ref (not in state)
 * 2. Separate display value with mask
 * 3. Imperative API via useImperativeHandle
 * 4. Security attributes (autoComplete="off", etc.)
 * 
 * @example
 * ```tsx
 * const cpfRef = useRef<SecureInputRef>(null);
 * 
 * <SecureInput
 *   ref={cpfRef}
 *   mask="cpf"
 *   validator={validateCPF}
 * />
 * ```
 */
export const SecureInput = forwardRef<SecureInputRef, SecureInputProps>(...);
```

---

## ✨ Code Review Checklist

- [ ] Does the component follow established patterns?
- [ ] Is there prop drilling that could be solved with composition or hooks?
- [ ] Does sensitive data use SecureInput?
- [ ] Are validations in Zod schemas?
- [ ] Are Zustand selectors specific (not subscribing to entire store)?
- [ ] Is there unnecessary memoization?
- [ ] Are TypeScript types precise and useful?
- [ ] Is TSDoc documentation present for public APIs?
- [ ] Do commits follow conventional commits?
- [ ] Are comments in English and explain "why", not "what"?

---

## 🎓 Additional Resources

- [React Patterns](https://reactpatterns.com/)
- [Zustand Best Practices](https://docs.pmnd.rs/zustand/guides/practice-with-no-store-actions)
- [Zod Documentation](https://zod.dev/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [BEM Methodology](https://getbem.com/)
- [CVA (Class Variance Authority)](https://cva.style/)

---

**Last Updated:** October 2025  
**Maintainers:** Inspire Frontend Team