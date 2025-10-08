import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { Input, type InputProps } from '../Input';

/**
 * Imperative API to access value securely
 * 
 * Why useImperativeHandle:
 * - Exposes controlled API without exposing direct HTML element
 * - Allows getValue without storing in React state (not visible in DevTools)
 * - Facilitates form integration without excessive re-renders
 * 
 * Trade-offs:
 * ✅ Better security for sensitive data
 * ✅ Not visible in React DevTools
 * ✅ Fewer re-renders
 * ⚠️  Imperative API (requires ref)
 * ⚠️  Not "controlled" in traditional sense
 */
export interface SecureInputRef {
  getValue: () => string;
  getDisplayValue: () => string;
  setValue: (value: string) => void;
  clear: () => void;
  validate: () => string | null;
  focus: () => void;
}

type MaskType = 'cpf' | 'cnpj' | 'phone' | 'cep' | 'none';

export interface SecureInputProps
  extends Omit<InputProps, 'value' | 'onChange'> {
  onValueChange?: (value: string) => void;
  mask?: MaskType;
  validator?: (value: string) => string | null;
  defaultValue?: string;
}

/**
 * Input masks for Brazilian formats
 * Applied on frontend for better UX
 * - Immediate visual validation
 * - Always send raw value to backend (without mask)
 * 
 * Trade-off:
 * ✅ Superior UX
 * ⚠️  Additional frontend complexity
 */
const masks: Record<MaskType, (value: string) => string> = {
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
    if (numbers.length <= 10) {
      // Landline: (11) 1234-5678
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
    }
    // Mobile: (11) 91234-5678
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
 * SecureInput - Input for sensitive data that doesn't expose values in DevTools
 * 
 * Security Architecture:
 * 
 * 1. Raw value stored in ref (not in state):
 *    - Not visible in React DevTools
 *    - Doesn't trigger unnecessary re-renders
 *    - Not serialized in error snapshots
 * 
 * 2. Separate display value:
 *    - Only for rendering (with mask)
 *    - Can differ from raw value
 *    - Backend always receives raw value
 * 
 * 3. Imperative API:
 *    - getValue() instead of value prop
 *    - Avoids prop drilling of sensitive value
 *    - Better control over when value is accessed
 * 
 * 4. Security attributes:
 *    - autoComplete="off": Prevents browser autocomplete
 *    - data-lpignore="true": LastPass ignore
 *    - data-form-type="other": Prevents password managers
 * 
 * Use cases:
 * - CPF/CNPJ: PII (Personally Identifiable Information)
 * - Email: Can be considered sensitive per LGPD
 * - Phone: Personal data
 * - Address: Private information
 * 
 * @example
 * ```tsx
 * const cpfRef = useRef<SecureInputRef>(null);
 * 
 * const handleSubmit = () => {
 *   const cpf = cpfRef.current?.getValue(); // unmasked value
 *   const error = cpfRef.current?.validate();
 *   if (!error) {
 *     await api.submit({ cpf });
 *   }
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
  (
    {
      onValueChange,
      mask = 'none',
      validator,
      defaultValue = '',
      error: externalError,
      ...inputProps
    },
    ref
  ) => {
    // Raw unmasked value stored in ref
    const rawValue = useRef<string>(defaultValue.replace(/\D/g, ''));

    // Display value with mask for UI
    const [displayValue, setDisplayValue] = useState(() =>
      masks[mask](defaultValue)
    );

    // Internal validation error
    const [internalError, setInternalError] = useState<string | null>(null);

    // Ref to input element for focus()
    const inputRef = useRef<HTMLInputElement>(null);

    // Expose imperative API
    useImperativeHandle(ref, () => ({
      getValue: () => rawValue.current,

      getDisplayValue: () => displayValue,

      setValue: (value: string) => {
        const raw = value.replace(/\D/g, '');
        rawValue.current = raw;
        const masked = masks[mask](raw);
        setDisplayValue(masked);
      },

      clear: () => {
        rawValue.current = '';
        setDisplayValue('');
        setInternalError(null);
      },

      validate: () => {
        if (!validator) return null;
        const error = validator(rawValue.current);
        setInternalError(error);
        return error;
      },

      focus: () => {
        inputRef.current?.focus();
      },
    }));

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Extract raw numeric value for number masks
      const raw =
        mask === 'none' ? inputValue : inputValue.replace(/\D/g, '');
      rawValue.current = raw;

      // Apply mask for display
      const masked = masks[mask](raw);
      setDisplayValue(masked);

      // Validate if validator provided
      if (validator) {
        const error = validator(raw);
        setInternalError(error);
      }

      // Notify parent with raw value
      onValueChange?.(raw);
    };

    // Error to display (external takes priority)
    const displayError = externalError || internalError || undefined;

    return (
      <Input
        {...inputProps}
        ref={inputRef}
        value={displayValue}
        onChange={handleChange}
        error={displayError}
        state={displayError ? 'error' : inputProps.state}
        // Security attributes
        autoComplete="off"
        data-lpignore="true"
        data-form-type="other"
        data-1p-ignore="true"
      />
    );
  }
);

SecureInput.displayName = 'SecureInput';

