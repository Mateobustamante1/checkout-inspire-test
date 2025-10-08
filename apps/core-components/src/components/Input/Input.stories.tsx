import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'example@example.com',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    value: 'invalid-email',
    error: 'Este campo deve ser preenchido',
  },
};

export const WithSuccess: Story = {
  args: {
    label: 'CPF',
    value: '332.472.477-50',
    successMessage: 'CPF válido',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Senha',
    type: 'password',
    helperText: 'Mínimo 8 caracteres',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Campo desabilitado',
    value: 'Não editável',
    disabled: true,
  },
};

export const WithPlaceholder: Story = {
  args: {
    label: 'Nome',
    placeholder: 'Digite seu nome completo',
  },
};

// Real-world examples
export const EmailField: Story = {
  name: 'Checkout - Email',
  args: {
    label: 'E-mail',
    type: 'email',
    placeholder: 'example@example.com',
  },
};

export const CPFField: Story = {
  name: 'Checkout - CPF',
  args: {
    label: 'CPF ou CNPJ',
    placeholder: '000.000.000-00',
  },
};

export const PhoneField: Story = {
  name: 'Checkout - Telefone',
  args: {
    label: 'Telefone com DDD',
    type: 'tel',
    placeholder: '(11) 98765-4321',
  },
};

export const CEPField: Story = {
  name: 'Checkout - CEP',
  args: {
    label: 'CEP',
    placeholder: '00000-000',
    helperText: 'Não sei meu CEP',
  },
};

