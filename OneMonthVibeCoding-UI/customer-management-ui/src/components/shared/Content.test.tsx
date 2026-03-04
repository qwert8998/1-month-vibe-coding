import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Content from './Content';

vi.mock('../customers/customers-main', () => ({
  default: () => <div>Customers Main Mock</div>,
}));

describe('Content', () => {
  it('renders customers content when customers is selected', () => {
    render(<Content selected="customers" />);

    expect(screen.getByText('Customers Main Mock')).toBeInTheDocument();
  });

  it('renders default welcome content for unknown selection', () => {
    render(<Content selected="unknown" />);

    expect(screen.getByRole('heading', { name: 'Welcome' })).toBeInTheDocument();
    expect(screen.getByText('Please select a menu item.')).toBeInTheDocument();
  });
});
