import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Aceito os termos e condições',
  },
};

export const Checked: Story = {
  args: {
    label: 'Opção marcada',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Opção desabilitada',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Marcada e desabilitada',
    defaultChecked: true,
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Você deve aceitar os termos',
    error: 'Campo obrigatório',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Enviar notificações',
    helperText: 'Você receberá emails semanais',
  },
};

export const LongLabel: Story = {
  args: {
    label:
      'Ao marcar esta opção, você concorda com nossa política de privacidade e aceita receber comunicações por email sobre novidades, promoções e atualizações do nosso serviço.',
  },
};

// Real-world checkout examples
export const CheckoutNewsletter: Story = {
  name: 'Checkout - Newsletter',
  args: {
    label: 'Receber ofertas e novidades por e-mail',
    defaultChecked: true,
  },
};

export const CheckoutDifferentPerson: Story = {
  name: 'Checkout - Outra pessoa buscará',
  args: {
    label: 'Outra pessoa buscará pelo pedido',
  },
};

