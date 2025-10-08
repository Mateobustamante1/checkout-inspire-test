import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import './CustomSelect.css';

export interface CustomSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CustomSelectProps {
  label?: string;
  options: CustomSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  wrapperClassName?: string;
}

/**
 * CustomSelect - Custom select with styled dropdown
 * 
 * Uses divs instead of native <select> for full style control
 */
export const CustomSelect = ({
  label,
  options,
  value,
  onChange,
  error,
  wrapperClassName,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value);
  
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSelect = (option: CustomSelectOption) => {
    if (!option.disabled) {
      onChange?.(option.value);
      setIsOpen(false);
    }
  };
  
  return (
    <div className={cn('custom-select-wrapper', wrapperClassName)} ref={containerRef}>
      <div className="custom-select-container">
        <button
          type="button"
          className={cn('custom-select-trigger', isOpen && 'custom-select-trigger--open')}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="custom-select-value">
            {selectedOption?.label || 'Seleccionar...'}
          </span>
          <svg
            className={cn('custom-select-arrow', isOpen && 'custom-select-arrow--open')}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        
        {label && (
          <label className="custom-select-label">{label}</label>
        )}
        
        {isOpen && (
          <div className="custom-select-dropdown" role="listbox">
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  'custom-select-option',
                  option.value === value && 'custom-select-option--selected',
                  option.disabled && 'custom-select-option--disabled'
                )}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={option.value === value}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <p className="custom-select-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

