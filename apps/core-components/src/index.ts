/**
 * @inspire/ui - Core UI Components Library
 * 
 * Entry point for all design system components
 * 
 * Organization:
 * - Barrel exports of all public components
 * - Exported types for TypeScript
 * - Utilities and helpers
 * - Validators
 */

// ==================== Styles ====================
import './styles/globals.css';

// ==================== Components ====================

export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';

export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { SecureInput } from './components/SecureInput';
export type { SecureInputProps, SecureInputRef } from './components/SecureInput';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

export { Select } from './components/Select';
export type { SelectProps, SelectOption } from './components/Select';

export { CustomSelect } from './components/CustomSelect';
export type { CustomSelectProps, CustomSelectOption } from './components/CustomSelect';

export { Header } from './components/Header';
export type { HeaderProps } from './components/Header';

export { Modal } from './components/Modal';
export type { ModalProps } from './components/Modal';

// ==================== Utilities ====================

export { cn } from './lib/utils';

// ==================== Validators ====================

export {
  validateCPF,
  validateCNPJ,
  validateCEP,
  validateEmail,
  validatePhone,
} from './lib/validators';

