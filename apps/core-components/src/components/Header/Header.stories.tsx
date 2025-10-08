import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default header with logo and security badge
 */
export const Default: Story = {
  args: {
    logoText: 'Inspire',
    showSecurityBadge: true,
  },
};

/**
 * Header without security badge
 */
export const WithoutSecurityBadge: Story = {
  args: {
    logoText: 'Inspire',
    showSecurityBadge: false,
  },
};

/**
 * Header with custom right content
 */
export const CustomRightContent: Story = {
  args: {
    logoText: 'Inspire',
    rightContent: (
      <div style={{ padding: '0.5rem 1rem', backgroundColor: '#eff6ff', borderRadius: '0.375rem', color: '#2563eb', fontWeight: 600 }}>
        Custom Badge
      </div>
    ),
  },
};

