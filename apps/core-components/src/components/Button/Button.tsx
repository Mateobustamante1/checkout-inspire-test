import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import './Button.css';

/**
 * Button variants using CVA (Class Variance Authority)
 * 
 * Why CVA over alternatives:
 * ✅ Type-safe variants
 * ✅ Compound variants (styles for specific combinations)
 * ✅ Default variants
 * ✅ Better DX than manual className concatenation
 * 
 * Alternatives considered:
 * - Manual className strings: Error-prone, not type-safe
 * - Styled-components: Larger bundle, runtime styles
 * - Tailwind variants: Requires Tailwind as dependency
 */
const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'button--primary',
      secondary: 'button--secondary',
      ghost: 'button--ghost',
      destructive: 'button--destructive',
    },
    size: {
      sm: 'button--sm',
      md: 'button--md',
      lg: 'button--lg',
    },
    fullWidth: {
      true: 'button--full-width',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      size: 'lg',
      className: 'button--primary-lg',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    fullWidth: false,
  },
});

export interface ButtonProps
  extends ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  /** Loading state - displays spinner and disables button */
  isLoading?: boolean;
  /** Icon to the left of the text */
  leftIcon?: React.ReactNode;
  /** Icon to the right of the text */
  rightIcon?: React.ReactNode;
}

/**
 * Button component with full variant support and accessibility
 * 
 * Architectural Decisions:
 * 
 * 1. forwardRef:
 *    - Allows refs for focus management
 *    - Necessary for library integrations (react-hook-form, etc.)
 *    - Trade-off: Verbosity vs functionality
 * 
 * 2. ComponentPropsWithoutRef<'button'>:
 *    - Type-safety for all native <button> props
 *    - Allows onClick, type, disabled, etc. automatically
 *    - Avoids manually declaring each prop
 * 
 * 3. Spread props at the end (...props):
 *    - Allows override of any prop
 *    - User can add data-* attributes, aria-*, etc.
 *    - Maximum flexibility
 * 
 * 4. Loading state:
 *    - Disables button automatically
 *    - Aria-busy for screen readers
 *    - Integrated spinner (no external component required)
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" leftIcon={<Icon />}>
 *   Continuar para Pagamento
 * </Button>
 * 
 * <Button isLoading disabled>
 *   Processando...
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      fullWidth,
      className,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="button__spinner"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="button__spinner-track"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="button__spinner-path"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {leftIcon && !isLoading && (
          <span className="button__icon button__icon--left">{leftIcon}</span>
        )}
        <span className="button__content">{children}</span>
        {rightIcon && (
          <span className="button__icon button__icon--right">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

