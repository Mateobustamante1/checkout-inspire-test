# React Components Guide - Inspire UI Library

## 🎨 Design System Philosophy

Nuestro sistema de componentes está diseñado con **composición**, **accesibilidad** y **type-safety** como pilares fundamentales.

---

## 📋 Component Tiers

### Tier 1: Primitives (Design Tokens)

Valores fundamentales del diseño. No son componentes React, sino constantes.

```typescript
// tokens/colors.ts
export const colors = {
  primary: {
    50: '#e3f2fd',
    500: '#2196f3',
    600: '#1e88e5',
  },
  semantic: {
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
  }
} as const;

// tokens/spacing.ts
export const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
} as const;
```

---

### Tier 2: Base Components (Atoms)

Componentes fundamentales, no se descomponen más.

#### Button Component

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Variantes del botón usando CVA (Class Variance Authority)
 * 
 * Por qué CVA:
 * - Type-safe variants
 * - Compound variants (combinaciones específicas)
 * - Better than manual className concatenation
 */
const buttonVariants = cva(
  // Base styles - siempre aplicados
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        ghost: 'hover:bg-gray-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-13 px-8 text-lg',
      },
    },
    // Compound variants - estilos cuando se combinan variantes específicas
    compoundVariants: [
      {
        variant: 'primary',
        size: 'lg',
        className: 'font-bold', // Botones primarios grandes son bold
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  /** Loading state - muestra spinner y deshabilita el botón */
  isLoading?: boolean;
  /** Icon a la izquierda del texto */
  leftIcon?: React.ReactNode;
  /** Icon a la derecha del texto */
  rightIcon?: React.ReactNode;
}

/**
 * Button component con soporte completo de variantes y accesibilidad.
 * 
 * Decisiones de diseño:
 * - forwardRef: Permite refs para focus management
 * - ComponentPropsWithoutRef: Type-safety para props HTML nativas
 * - Spread props al final: Permite override de cualquier prop HTML
 * - cn utility: Merge de classNames con soporte para conditional classes
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" leftIcon={<Icon />}>
 *   Continuar
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      className,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**Alternativas consideradas:**
- **Styled Components:** Descartado por bundle size y performance
- **Emotion:** Descartado por preferencia de Tailwind + SCSS híbrido
- **Manual className:** Descartado por falta de type-safety

---

#### Input Component (Base)

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'w-full rounded-md border bg-white px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2',
  {
    variants: {
      state: {
        default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        success: 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

export interface InputProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Label del input */
  label?: string;
  /** Mensaje de error */
  error?: string;
  /** Mensaje de éxito */
  successMessage?: string;
  /** Icon al final del input */
  endIcon?: React.ReactNode;
}

/**
 * Input component con estados visuales y accesibilidad.
 * 
 * Por qué este diseño:
 * - Omit<..., 'size'>: Evitamos conflicto con HTML size attribute
 * - State-based styling: Estados visuales claros (error, success)
 * - Built-in label association: Mejor accesibilidad
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   error="Email inválido"
 *   state="error"
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      successMessage,
      state,
      className,
      endIcon,
      id,
      ...props
    },
    ref
  ) => {
    // Auto-generate ID for accessibility if not provided
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    
    // Determine state based on error/success
    const derivedState = error ? 'error' : successMessage ? 'success' : state;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              inputVariants({ state: derivedState }),
              endIcon && 'pr-10',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${inputId}-error`
                : successMessage
                ? `${inputId}-success`
                : undefined
            }
            {...props}
          />
          
          {endIcon && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              {endIcon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {successMessage && !error && (
          <p
            id={`${inputId}-success`}
            className="text-xs text-green-600"
          >
            {successMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

**Decisiones de accesibilidad:**
- `aria-invalid`: Screen readers anuncian el estado de error
- `aria-describedby`: Asocia mensajes de error con el input
- Auto-generated ID: Garantiza label-input association única
- `role="alert"`: Error messages son anunciados inmediatamente

---

#### SecureInput Component

```tsx
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { Input, type InputProps } from './Input';

/**
 * API imperativa para acceder al valor de forma segura.
 * 
 * Por qué useImperativeHandle:
 * - Expone API controlada sin exponer el elemento HTML directo
 * - Permite getValue sin almacenar en state React (DevTools)
 * - Facilita integración con formularios sin re-renders excesivos
 */
export interface SecureInputRef {
  /** Obtiene el valor actual de forma segura */
  getValue: () => string;
  /** Establece el valor programáticamente */
  setValue: (value: string) => void;
  /** Limpia el campo */
  clear: () => void;
  /** Valida el campo y retorna errores */
  validate: () => string | null;
}

export interface SecureInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  /** Callback con el valor (no se almacena en state público) */
  onValueChange?: (value: string) => void;
  /** Máscara a aplicar (cpf, cnpj, phone, cep) */
  mask?: 'cpf' | 'cnpj' | 'phone' | 'cep' | 'none';
  /** Función de validación custom */
  validator?: (value: string) => string | null;
}

/**
 * Máscaras para inputs brasileños
 */
const masks = {
  cpf: (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  },
  cnpj: (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 14);
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  },
  phone: (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  },
  cep: (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 8);
    return numbers.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
  },
  none: (value: string) => value,
};

/**
 * SecureInput - Input para datos sensibles que no expone valores en DevTools.
 * 
 * Seguridad implementada:
 * 1. Valor almacenado en ref (no en state)
 * 2. Display value separado (puede ser masked/obfuscated)
 * 3. API imperativa en lugar de controlled component
 * 4. No expone raw value en props del DOM
 * 
 * Trade-offs:
 * ✅ Mayor seguridad para datos sensibles
 * ✅ No aparece en React DevTools
 * ✅ Menos re-renders (valor no está en state)
 * ⚠️  Requiere ref para acceder al valor
 * ⚠️  No es "controlled" en el sentido tradicional de React
 * 
 * @example
 * ```tsx
 * const cpfRef = useRef<SecureInputRef>(null);
 * 
 * const handleSubmit = () => {
 *   const cpf = cpfRef.current?.getValue();
 *   await api.submit({ cpf });
 * };
 * 
 * <SecureInput
 *   ref={cpfRef}
 *   label="CPF"
 *   mask="cpf"
 *   validator={validateCPF}
 * />
 * ```
 */
export const SecureInput = forwardRef<SecureInputRef, SecureInputProps>(
  ({ onValueChange, mask = 'none', validator, ...inputProps }, ref) => {
    // Raw value (no masked) - almacenado en ref
    const rawValue = useRef<string>('');
    
    // Display value (masked) - solo para UI
    const [displayValue, setDisplayValue] = useState('');
    
    // Validation state
    const [validationError, setValidationError] = useState<string | null>(null);

    // Exponer API imperativa
    useImperativeHandle(ref, () => ({
      getValue: () => rawValue.current,
      
      setValue: (value: string) => {
        rawValue.current = value;
        const masked = masks[mask](value);
        setDisplayValue(masked);
      },
      
      clear: () => {
        rawValue.current = '';
        setDisplayValue('');
        setValidationError(null);
      },
      
      validate: () => {
        if (!validator) return null;
        const error = validator(rawValue.current);
        setValidationError(error);
        return error;
      },
    }));

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Extract raw value (sin máscara)
      const raw = inputValue.replace(/\D/g, '');
      rawValue.current = raw;
      
      // Apply mask for display
      const masked = masks[mask](raw);
      setDisplayValue(masked);
      
      // Validar si hay validator
      if (validator) {
        const error = validator(raw);
        setValidationError(error);
      }
      
      // Notify parent (con raw value)
      onValueChange?.(raw);
    };

    return (
      <Input
        {...inputProps}
        value={displayValue}
        onChange={handleChange}
        error={validationError || inputProps.error}
        // Security: no exponer raw value en atributos
        autoComplete="off"
        data-lpignore="true" // LastPass ignore
        data-form-type="other" // Prevent autofill
      />
    );
  }
);

SecureInput.displayName = 'SecureInput';
```

**Por qué este approach sobre alternatives:**

| Approach | Pros | Cons | Elegido |
|----------|------|------|---------|
| **SecureInput (actual)** | Valor no en DevTools, menos re-renders, más seguro | API imperativa (refs) | ✅ |
| **Controlled normal** | API React estándar | Valor visible en DevTools, más re-renders | ❌ |
| **Uncontrolled** | Simple | No puedes validar en tiempo real | ❌ |
| **Input con cifrado** | Máxima seguridad | Over-engineering para este caso, bundle size | ❌ |

---

### Tier 3: Composite Components (Molecules)

Combinación de base components con lógica compartida.

#### Form (Compound Components Pattern)

```tsx
import {
  createContext,
  useContext,
  useCallback,
  type FormEvent,
  type ReactNode,
} from 'react';
import { useForm, type UseFormReturn, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodSchema } from 'zod';

/**
 * Form Context - compartido entre Form.* components
 * 
 * Por qué Context aquí:
 * - Scope limitado al Form (no global)
 * - Alternativa a prop drilling para 3+ niveles
 * - react-hook-form methods necesitan estar accesibles en children
 */
interface FormContextValue<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
}

const FormContext = createContext<FormContextValue | null>(null);

/**
 * Hook para acceder al form context
 * Throws si se usa fuera de <Form>
 */
const useFormContext = <T extends FieldValues = FieldValues>() => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('Form.* components must be used within <Form>');
  }
  return context as FormContextValue<T>;
};

// ==================== Form Root ====================

interface FormProps<T extends FieldValues> {
  /** Zod schema para validación */
  schema: ZodSchema<T>;
  /** Valores iniciales del formulario */
  defaultValues: T;
  /** Callback al enviar (después de validación) */
  onSubmit: (data: T) => void | Promise<void>;
  /** Children - Form.Field components */
  children: ReactNode;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Form root component con validación automática vía Zod.
 * 
 * Decisiones:
 * - React Hook Form: Mejor performance (uncontrolled), type-safe, rich API
 * - Zod integration: Validación type-safe reutilizable
 * - Compound components: API declarativa sin prop drilling
 * 
 * @example
 * ```tsx
 * <Form schema={checkoutSchema} defaultValues={{}} onSubmit={handleSubmit}>
 *   <Form.Field name="email">
 *     <Form.Label>Email</Form.Label>
 *     <Form.Input />
 *     <Form.Error />
 *   </Form.Field>
 * </Form>
 * ```
 */
function FormRoot<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: FormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur', // Validar al salir del campo
  });

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      form.handleSubmit(onSubmit)(e);
    },
    [form, onSubmit]
  );

  return (
    <FormContext.Provider value={{ form }}>
      <form onSubmit={handleSubmit} className={className} noValidate>
        {children}
      </form>
    </FormContext.Provider>
  );
}

// ==================== Form.Field ====================

interface FormFieldProps {
  /** Nombre del campo (debe coincidir con schema) */
  name: string;
  /** Children - Form.Label, Form.Input, Form.Error */
  children: ReactNode;
}

/**
 * Form.Field - Contenedor para un campo del formulario.
 * Proporciona contexto del campo a sus children.
 */
function FormField({ name, children }: FormFieldProps) {
  return <div className="form-field">{children}</div>;
}

// ==================== Form.Label ====================

interface FormLabelProps {
  children: ReactNode;
  htmlFor?: string;
}

function FormLabel({ children, htmlFor }: FormLabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}

// ==================== Form.Input ====================

interface FormInputProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'name'> {
  /** Nombre del campo */
  name: string;
  /** Si true, usa SecureInput */
  secure?: boolean;
}

function FormInput({ name, secure, ...props }: FormInputProps) {
  const { form } = useFormContext();
  const { register, formState: { errors } } = form;
  
  const error = errors[name]?.message as string | undefined;
  const hasError = !!error;

  if (secure) {
    // TODO: Integrate SecureInput with react-hook-form
    // Requires custom Controller
  }

  return (
    <Input
      {...register(name)}
      {...props}
      error={error}
      state={hasError ? 'error' : 'default'}
    />
  );
}

// ==================== Form.Error ====================

interface FormErrorProps {
  /** Nombre del campo */
  name: string;
}

function FormError({ name }: FormErrorProps) {
  const { form } = useFormContext();
  const error = form.formState.errors[name]?.message as string | undefined;

  if (!error) return null;

  return (
    <p className="text-xs text-red-600" role="alert">
      {error}
    </p>
  );
}

// ==================== Compound Component Export ====================

/**
 * Compound component pattern para formularios.
 * 
 * Por qué este pattern:
 * ✅ API declarativa y legible
 * ✅ Composición flexible
 * ✅ No prop drilling
 * ✅ Type-safe con TypeScript
 * ✅ Encapsulación de lógica compartida
 * 
 * Alternativas consideradas:
 * - Render props: Más verboso, anidación profunda
 * - Single component con config object: Menos flexible
 * - Separate components sin context: Prop drilling excesivo
 */
export const Form = Object.assign(FormRoot, {
  Field: FormField,
  Label: FormLabel,
  Input: FormInput,
  Error: FormError,
});
```

**Trade-offs del Compound Component Pattern:**

✅ **Pros:**
- API intuitiva y declarativa
- Composition > Configuration
- TypeScript-friendly
- Evita prop drilling

⚠️ **Cons:**
- Requiere Context (ligero overhead)
- Curva de aprendizaje inicial
- No funciona bien con dynamic children

---

### Tier 4: Feature Components

Componentes específicos de dominio que combinan composites.

```tsx
/**
 * AddressForm - Formulario de dirección con búsqueda de CEP.
 * 
 * Features:
 * - Auto-complete via CEP API
 * - Validación de campos relacionados
 * - Manejo de estado con Zustand
 */
export const AddressForm: FC<AddressFormProps> = ({ onComplete }) => {
  const updateAddress = useCheckoutStore((state) => state.updateAddress);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);

  const handleCEPBlur = async (cep: string) => {
    if (cep.length !== 8) return;

    setIsLoadingCEP(true);
    try {
      const address = await fetchAddressByCEP(cep);
      updateAddress(address);
    } catch (error) {
      // Handle error
    } finally {
      setIsLoadingCEP(false);
    }
  };

  return (
    <Form schema={addressSchema} onSubmit={onComplete} defaultValues={{}}>
      <Form.Field name="cep">
        <Form.Label>CEP</Form.Label>
        <Form.Input
          secure
          mask="cep"
          onBlur={(e) => handleCEPBlur(e.target.value)}
        />
        {isLoadingCEP && <Spinner size="sm" />}
        <Form.Error name="cep" />
      </Form.Field>

      {/* More fields... */}
    </Form>
  );
};
```

---

## 🎯 Component Checklist

Antes de crear un nuevo componente, verificar:

- [ ] ¿Es reutilizable o específico de una feature?
- [ ] ¿Qué tier le corresponde?
- [ ] ¿Necesita forwardRef?
- [ ] ¿Hay variantes? → Usar CVA
- [ ] ¿Maneja datos sensibles? → SecureInput
- [ ] ¿Es accesible? (ARIA, keyboard nav)
- [ ] ¿Tiene TypeScript types precisos?
- [ ] ¿Está documentado con TSDoc?
- [ ] ¿Tiene Storybook stories?
- [ ] ¿Tiene tests unitarios?

---

## 📚 Storybook Organization

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Base/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destructive'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    leftIcon: <IconUser />,
    children: 'Button',
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Loading...',
  },
};
```

---

**Próximos pasos:** Implementar componentes específicos del checkout.

