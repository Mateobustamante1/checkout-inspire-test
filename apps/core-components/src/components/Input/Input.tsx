import {
  forwardRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import './Input.css';

const inputVariants = cva('input', {
  variants: {
    state: {
      default: 'input--default',
      error: 'input--error',
      success: 'input--success',
    },
    hasIcon: {
      true: 'input--has-icon',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

export interface InputProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Input label */
  label?: string;
  /** Error message */
  error?: string;
  /** Success message */
  successMessage?: string;
  /** Icon at the end of input (right side) */
  endIcon?: ReactNode;
  /** Helper text below input (can be string or component) */
  helperText?: ReactNode;
  /** Wrapper className */
  wrapperClassName?: string;
  /** Whether to show error icon (default true) */
  showErrorIcon?: boolean;
}

/**
 * Input component with visual states and full accessibility
 * 
 * Architectural Decisions:
 * 
 * 1. Omit<ComponentPropsWithoutRef<'input'>, 'size'>:
 *    Why: Avoid conflict between:
 *    - HTML size attribute (number)
 *    - Possible size variant ('sm', 'md', 'lg')
 *    Trade-off: Lose HTML size prop, but gain flexibility
 * 
 * 2. Auto-generated ID:
 *    Why: Guarantees accessibility label-input association
 *    Alternative: Require manual ID (more error-prone)
 * 
 * 3. State derivation (error → state):
 *    Why: Simpler API - pass error and state is derived
 *    Alternative: Manual state handling (more verbose)
 * 
 * 4. Wrapper div:
 *    Why: Need to contain label, input, error, helper text
 *    Trade-off: Extra div vs better UX and accessibility
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   error="Email inválido"
 *   placeholder="seu@email.com"
 * />
 * 
 * <Input
 *   label="CPF"
 *   successMessage="CPF válido"
 *   endIcon={<CheckIcon />}
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
      wrapperClassName,
      endIcon,
      helperText,
      id,
      showErrorIcon = true,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    // Auto-generate ID for accessibility
    const [inputId] = useState(
      () => id || `input-${Math.random().toString(36).slice(2, 9)}`
    );

    // Derive state based on error (success doesn't change state, only shows icon)
    const derivedState = error ? 'error' : state;
    const hasIcon = !!endIcon || !!error || !!successMessage;

    // Icon to display
    const displayIcon = error && showErrorIcon ? (
      <svg
        className="input__icon input__icon--error"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" fill="#dc2626" />
        <line x1="15" y1="9" x2="9" y2="15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <line x1="9" y1="9" x2="15" y2="15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ) : successMessage ? (
      <svg
        className="input__icon input__icon--success"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" fill="#10b981" />
        <polyline points="8 12 11 15 16 9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : (
      endIcon
    );

      return (
        <div className={cn('input-wrapper', wrapperClassName)}>
          <div className="input-container">
            <input
              ref={ref}
              id={inputId}
              className={cn(inputVariants({ state: derivedState, hasIcon }), className)}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error
                  ? `${inputId}-error`
                  : helperText
                  ? `${inputId}-helper`
                  : undefined
              }
              value={value}
              defaultValue={defaultValue}
              placeholder=" "
              {...props}
            />

            {label && (
              <label htmlFor={inputId} className="input-label">
                {label}
              </label>
            )}

            {displayIcon && (
              <div className="input__icon-wrapper">{displayIcon}</div>
            )}
          </div>

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="input-helper-text">
            {helperText}
          </p>
        )}

        {error && (
          <p id={`${inputId}-error`} className="input-error-text" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

