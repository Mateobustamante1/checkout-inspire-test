/**
 * Public API for Button component
 * 
 * Pattern: Barrel exports
 * 
 * Why:
 * - Control over what is exported (clear public API)
 * - Allows reorganizing internals without breaking external imports
 * - Facilitates re-exports from main index.ts
 * 
 * Trade-off:
 * ✅ Clean and controlled API
 * ⚠️  May affect tree-shaking if not configured correctly
 */

export { Button } from './Button';
export type { ButtonProps } from './Button';

