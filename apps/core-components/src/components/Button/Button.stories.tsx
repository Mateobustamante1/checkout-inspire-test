import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

/**
 * Button component - Inspire design system
 * 
 * Fundamental component for user actions.
 * Supports multiple variants, sizes, and states.
 */
const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Versatile button with support for variants, loading states, and full accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destructive'],
      description: 'Button visual variant',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state - disables button and shows spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Expands button to 100% of container width',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ==================== Basic Variants ====================

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Continuar para Pagamento',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Voltar',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Cancelar',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Excluir pedido',
  },
};

// ==================== Sizes ====================

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

// ==================== States ====================

export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Processando...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

// ==================== With Icons ====================

const IconUser = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconArrowRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const WithLeftIcon: Story = {
  args: {
    leftIcon: <IconUser />,
    children: 'My Account',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: <IconArrowRight />,
    children: 'Next Step',
  },
};

export const WithBothIcons: Story = {
  args: {
    leftIcon: <IconUser />,
    rightIcon: <IconArrowRight />,
    children: 'Continue',
  },
};

// ==================== Layout ====================

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};

// ==================== Interactive ====================

export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Playground Button',
    isLoading: false,
    disabled: false,
    fullWidth: false,
  },
};

// ==================== Real-world Examples ====================

export const CheckoutButton: Story = {
  name: 'Checkout - Continuar para Pagamento',
  args: {
    variant: 'primary',
    size: 'lg',
    fullWidth: true,
    children: 'CONTINUAR PARA PAGAMENTO',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button used on checkout page to continue to payment.',
      },
    },
  },
};

export const CheckoutLoading: Story = {
  name: 'Checkout - Processing',
  args: {
    variant: 'primary',
    size: 'lg',
    fullWidth: true,
    isLoading: true,
    children: 'PROCESSANDO...',
  },
};

