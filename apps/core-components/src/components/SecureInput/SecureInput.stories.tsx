import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SecureInput, type SecureInputRef } from './SecureInput';
import { validateCPF, validateCEP, validatePhone } from '../../lib/validators';
import { Button } from '../Button';

const meta = {
  title: 'Components/SecureInput',
  component: SecureInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Input seguro para datos sensibles. El valor no se expone en React DevTools ni en el DOM.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SecureInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CPF: Story = {
  args: {
    label: 'CPF',
    mask: 'cpf',
    placeholder: '000.000.000-00',
  },
};

export const CPFWithValidation: Story = {
  args: {
    label: 'CPF',
    mask: 'cpf',
    placeholder: '000.000.000-00',
    validator: (value) => {
      if (!value) return 'CPF é obrigatório';
      return validateCPF(value) ? null : 'CPF inválido';
    },
  },
};

export const CNPJ: Story = {
  args: {
    label: 'CNPJ',
    mask: 'cnpj',
    placeholder: '00.000.000/0000-00',
  },
};

export const Phone: Story = {
  args: {
    label: 'Telefone',
    mask: 'phone',
    placeholder: '(00) 00000-0000',
    validator: (value) => {
      if (!value) return 'Telefone é obrigatório';
      return validatePhone(value) ? null : 'Telefone inválido';
    },
  },
};

export const CEP: Story = {
  args: {
    label: 'CEP',
    mask: 'cep',
    placeholder: '00000-000',
    helperText: 'Não sei meu CEP',
    validator: (value) => {
      if (!value) return 'CEP é obrigatório';
      return validateCEP(value) ? null : 'CEP inválido';
    },
  },
};

// Interactive example
export const WithImperativeAPI: Story = {
  render: () => {
    const cpfRef = useRef<SecureInputRef>(null);

    const handleGetValue = () => {
      const rawValue = cpfRef.current?.getValue();
      const displayValue = cpfRef.current?.getDisplayValue();
      alert(`Raw value: ${rawValue}\nDisplay value: ${displayValue}`);
    };

    const handleValidate = () => {
      const error = cpfRef.current?.validate();
      if (error) {
        alert(`Error: ${error}`);
      } else {
        alert('Valid!');
      }
    };

    const handleClear = () => {
      cpfRef.current?.clear();
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SecureInput
          ref={cpfRef}
          label="CPF"
          mask="cpf"
          placeholder="000.000.000-00"
          validator={(value) => {
            if (!value) return 'CPF é obrigatório';
            return validateCPF(value) ? null : 'CPF inválido';
          }}
        />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button size="sm" onClick={handleGetValue}>
            Get Value
          </Button>
          <Button size="sm" variant="secondary" onClick={handleValidate}>
            Validate
          </Button>
          <Button size="sm" variant="ghost" onClick={handleClear}>
            Clear
          </Button>
        </div>

        <p style={{ fontSize: '14px', color: '#666' }}>
          <strong>Try it:</strong> Digite um CPF e clique nos botões para testar a
          API imperativa.
          <br />
          <strong>Valid CPF:</strong> 332.472.477-50
        </p>
      </div>
    );
  },
};

// Real-world checkout examples
export const CheckoutCPF: Story = {
  name: 'Checkout - CPF Field',
  args: {
    label: 'CPF ou CNPJ',
    mask: 'cpf',
    placeholder: '000.000.000-00',
    validator: (value) => {
      if (!value) return 'Este campo deve ser preenchido';
      return validateCPF(value) ? null : 'CPF inválido';
    },
  },
};

export const CheckoutPhone: Story = {
  name: 'Checkout - Phone Field',
  args: {
    label: 'Telefone com DDD',
    mask: 'phone',
    placeholder: '(00) 00000-0000',
  },
};

export const CheckoutCEP: Story = {
  name: 'Checkout - CEP Field',
  args: {
    label: 'CEP',
    mask: 'cep',
    placeholder: '00000-000',
    helperText: 'Não sei meu CEP',
  },
};

