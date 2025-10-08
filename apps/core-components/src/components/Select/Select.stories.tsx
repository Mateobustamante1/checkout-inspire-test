import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import { useState } from 'react';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

const countries = [
  { value: 'BR', label: 'Brasil' },
  { value: 'AR', label: 'Argentina', disabled: true },
  { value: 'CL', label: 'Chile', disabled: true },
  { value: 'UY', label: 'Uruguay', disabled: true },
];

export const Default: Story = {
  args: {
    label: 'País',
    options: countries,
    value: 'BR',
  },
};

export const WithError: Story = {
  args: {
    label: 'País',
    options: countries,
    value: '',
    error: 'Este campo deve ser preenchido',
  },
};

export const WithSuccess: Story = {
  args: {
    label: 'País',
    options: countries,
    value: 'BR',
    successMessage: 'valid',
  },
};

export const Interactive = () => {
  const [value, setValue] = useState('BR');
  
  return (
    <div style={{ width: '300px' }}>
      <Select
        label="País"
        options={countries}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        successMessage={value ? 'valid' : undefined}
      />
    </div>
  );
};

