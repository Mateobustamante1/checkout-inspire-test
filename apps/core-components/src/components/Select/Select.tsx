import { forwardRef, useState, type SelectHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import './Select.css';

const selectVariants = cva(
  'select',
  {
    variants: {
      state: {
        default: 'select--default',
        error: 'select--error',
        success: 'select--success',
      },
      hasIcon: {
        true: 'select--has-icon',
        false: '',
      },
    },
    defaultVariants: {
      state: 'default',
      hasIcon: false,
    },
  }
);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  /** Label flotante del select */
  label?: string;
  /** Mensaje de error */
  error?: string;
  successMessage?: string;
  /** Opciones del select */
  options: SelectOption[];
  /** Wrapper className */
  wrapperClassName?: string;
}

/**
 * Select component con floating label y estados visuales.
 * 
 * @example
 * ```tsx
 * <Select
 *   label="País"
 *   options={[
 *     { value: 'BR', label: 'Brasil' },
 *     { value: 'AR', label: 'Argentina', disabled: true },
 *   ]}
 *   value="BR"
 * />
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      successMessage,
      state,
      className,
      wrapperClassName,
      id,
      options,
      value,
      ...props
    },
    ref
  ) => {
    const [inputId] = useState(
      () => id || `select-${Math.random().toString(36).slice(2, 9)}`
    );

    const derivedState = error ? 'error' : state;

    const displayIcon = successMessage ? (
      <svg
        className="select__icon select__icon--success"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" fill="#10b981" />
        <polyline points="8 12 11 15 16 9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : null;

    return (
      <div className={cn('select-wrapper', wrapperClassName)}>
        <div className="select-container">
          <select
            ref={ref}
            id={inputId}
            className={cn(selectVariants({ state: derivedState, hasIcon: !!displayIcon }), className)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            value={value}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {label && (
            <label htmlFor={inputId} className="select-label">
              {label}
            </label>
          )}

          <div className="select__arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {displayIcon && (
            <div className="select__icon-wrapper">{displayIcon}</div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="select-error-text" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

