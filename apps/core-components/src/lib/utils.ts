import { type ClassValue, clsx } from "clsx";

/**
 * Utility to combine classNames conditionally
 * 
 * Why clsx:
 * - Handles conditional classes elegantly
 * - Small bundle size (~200 bytes)
 * - Type-safe with TypeScript
 * 
 * @example
 * ```tsx
 * cn('base-class', isActive && 'active', className)
 * // Output: 'base-class active custom-class'
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

