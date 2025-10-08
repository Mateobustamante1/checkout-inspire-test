import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/utils';
import './Checkbox.css';

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  /** Checkbox label */
  label?: ReactNode;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
}

/**
 * Checkbox component with custom styles and accessibility
 * 
 * Design Decisions:
 * 
 * 1. Native input + custom styles:
 *    Why: Maintain browser native accessibility
 *    Alternatives considered:
 *    - Div with role="checkbox": More work for accessibility
 *    - Third-party library: Unnecessary dependency
 * 
 * 2. Visual check with SVG:
 *    Why: Full style control, scalable
 *    Alternative: Unicode check (✓): Inconsistent across fonts
 * 
 * 3. Label as peer:
 *    Why: Allows clicking label to toggle
 *    Better UX (larger target for mobile)
 * 
 * @example
 * ```tsx
 * <Checkbox
 *   label="Receber ofertas e novidades por e-mail"
 *   defaultChecked
 * />
 * 
 * <Checkbox
 *   label="Aceito os termos"
 *   error="Você deve aceitar os termos"
 * />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="checkbox-wrapper">
        <div className="checkbox-container">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn('checkbox-input', className)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${checkboxId}-error`
                : helperText
                ? `${checkboxId}-helper`
                : undefined
            }
            {...props}
          />

          {/* Visual checkbox (styled) */}
          <div className="checkbox-box" aria-hidden="true">
            <svg
              className="checkbox-check"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {label && (
            <label htmlFor={checkboxId} className="checkbox-label">
              {label}
            </label>
          )}
        </div>

        {helperText && !error && (
          <p id={`${checkboxId}-helper`} className="checkbox-helper-text">
            {helperText}
          </p>
        )}

        {error && (
          <p
            id={`${checkboxId}-error`}
            className="checkbox-error-text"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

