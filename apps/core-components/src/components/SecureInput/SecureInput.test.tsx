import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { SecureInput, type SecureInputRef } from './SecureInput';

/**
 * Tests for SecureInput Component
 * 
 * Focus: Critical security and business logic
 * - Ref API (getValue, setValue, validate, clear)
 * - Masking behavior (CPF, CEP, Phone)
 * - Validator integration
 * - Value change notifications
 * 
 * Not testing: Visual styling, internal implementation details
 */

describe('SecureInput - Ref API', () => {
  it('should expose getValue through ref', async () => {
    const TestComponent = () => {
      const ref = useRef<SecureInputRef>(null);
      return (
        <>
          <SecureInput ref={ref} label="Test" mask="cpf" />
          <button onClick={() => {
            const value = ref.current?.getValue();
            document.body.setAttribute('data-value', value || '');
          }}>
            Get Value
          </button>
        </>
      );
    };

    const user = userEvent.setup();
    render(<TestComponent />);

    const input = screen.getByLabelText('Test');
    await user.type(input, '12345678909');

    const button = screen.getByText('Get Value');
    await user.click(button);

    // getValue should return raw value (no mask)
    expect(document.body.getAttribute('data-value')).toBe('12345678909');
  });

  it('should expose setValue through ref', async () => {
    const TestComponent = () => {
      const ref = useRef<SecureInputRef>(null);
      return (
        <>
          <SecureInput ref={ref} label="Test" mask="none" />
          <button onClick={() => ref.current?.setValue('12345678')}>
            Set Value
          </button>
        </>
      );
    };

    const user = userEvent.setup();
    render(<TestComponent />);

    const button = screen.getByText('Set Value');
    await user.click(button);

    const input = screen.getByLabelText('Test') as HTMLInputElement;
    expect(input.value).toBe('12345678');
  });

  it('should clear value through ref', async () => {
    const TestComponent = () => {
      const ref = useRef<SecureInputRef>(null);
      return (
        <>
          <SecureInput ref={ref} label="Test" />
          <button onClick={() => ref.current?.clear()}>
            Clear
          </button>
        </>
      );
    };

    const user = userEvent.setup();
    render(<TestComponent />);

    const input = screen.getByLabelText('Test') as HTMLInputElement;
    await user.type(input, '12345');
    
    expect(input.value).toBe('12345');

    const button = screen.getByText('Clear');
    await user.click(button);

    expect(input.value).toBe('');
  });

  it('should validate through ref', async () => {
    const validator = vi.fn((value: string) => {
      return value.length < 5 ? 'Too short' : null;
    });

    const TestComponent = () => {
      const ref = useRef<SecureInputRef>(null);
      return (
        <>
          <SecureInput ref={ref} label="Test" mask="none" validator={validator} />
          <button onClick={() => {
            const error = ref.current?.validate();
            document.body.setAttribute('data-error', error || 'no-error');
          }}>
            Validate
          </button>
        </>
      );
    };

    const user = userEvent.setup();
    render(<TestComponent />);

    const input = screen.getByLabelText('Test');
    await user.type(input, '123');

    const button = screen.getByText('Validate');
    await user.click(button);

    expect(validator).toHaveBeenCalled();
    expect(document.body.getAttribute('data-error')).toBe('Too short');
  });
});

describe('SecureInput - Masking', () => {
  it('should apply CPF mask', async () => {
    const user = userEvent.setup();
    render(<SecureInput label="CPF" mask="cpf" />);

    const input = screen.getByLabelText('CPF') as HTMLInputElement;
    await user.type(input, '12345678909');

    // Mask is applied progressively as user types, final format
    expect(input.value).toContain('123');
    expect(input.value).toContain('456');
    expect(input.value).toContain('789');
  });

  it('should apply CEP mask', async () => {
    const user = userEvent.setup();
    render(<SecureInput label="CEP" mask="cep" />);

    const input = screen.getByLabelText('CEP') as HTMLInputElement;
    await user.type(input, '01310100');

    expect(input.value).toBe('01310-100');
  });

  it('should apply phone mask for mobile', async () => {
    const user = userEvent.setup();
    render(<SecureInput label="Phone" mask="phone" />);

    const input = screen.getByLabelText('Phone') as HTMLInputElement;
    await user.type(input, '11987654321');

    expect(input.value).toBe('(11) 98765-4321');
  });

  it('should apply phone mask for landline', async () => {
    const user = userEvent.setup();
    render(<SecureInput label="Phone" mask="phone" />);

    const input = screen.getByLabelText('Phone') as HTMLInputElement;
    await user.type(input, '1133334444');

    expect(input.value).toBe('(11) 3333-4444');
  });

  it('should not mask when mask="none"', async () => {
    const user = userEvent.setup();
    render(<SecureInput label="Text" mask="none" />);

    const input = screen.getByLabelText('Text') as HTMLInputElement;
    await user.type(input, 'test@example.com');

    expect(input.value).toBe('test@example.com');
  });
});

describe('SecureInput - Value Change Callback', () => {
  it('should call onValueChange with raw value', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SecureInput
        label="CPF"
        mask="cpf"
        onValueChange={handleChange}
      />
    );

    const input = screen.getByLabelText('CPF');
    await user.type(input, '12345678909');

    // Should call with each digit (raw, no mask)
    expect(handleChange).toHaveBeenCalledWith('12345678909');
  });

  it('should call onValueChange with cleaned value for no mask', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SecureInput
        label="Email"
        mask="none"
        onValueChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Email');
    await user.type(input, 'test@example.com');

    expect(handleChange).toHaveBeenLastCalledWith('test@example.com');
  });
});

describe('SecureInput - Validator Integration', () => {
  it('should call validator on value change', async () => {
    const validator = vi.fn(() => null);
    const user = userEvent.setup();

    render(
      <SecureInput
        label="Test"
        validator={validator}
      />
    );

    const input = screen.getByLabelText('Test');
    await user.type(input, '123');

    expect(validator).toHaveBeenCalledWith('123');
  });

  it('should display error from validator', async () => {
    const validator = (value: string) => {
      return value.length < 5 ? 'Minimum 5 characters' : null;
    };

    const user = userEvent.setup();
    render(
      <SecureInput
        label="Test"
        validator={validator}
      />
    );

    const input = screen.getByLabelText('Test');
    await user.type(input, '123');

    expect(screen.getByText('Minimum 5 characters')).toBeInTheDocument();
  });

  it('should prioritize external error over internal validator', async () => {
    const validator = () => 'Internal error';
    const user = userEvent.setup();

    render(
      <SecureInput
        label="Test"
        validator={validator}
        error="External error"
      />
    );

    const input = screen.getByLabelText('Test');
    await user.type(input, '123');

    expect(screen.getByText('External error')).toBeInTheDocument();
    expect(screen.queryByText('Internal error')).not.toBeInTheDocument();
  });
});

describe('SecureInput - Security Attributes', () => {
  it('should have security attributes', () => {
    render(<SecureInput label="Test" />);

    const input = screen.getByLabelText('Test');

    expect(input).toHaveAttribute('autoComplete', 'off');
    expect(input).toHaveAttribute('data-lpignore', 'true');
    expect(input).toHaveAttribute('data-form-type', 'other');
    expect(input).toHaveAttribute('data-1p-ignore', 'true');
  });
});
