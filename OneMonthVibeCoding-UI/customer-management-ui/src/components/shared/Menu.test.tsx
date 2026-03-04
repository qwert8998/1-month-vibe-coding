import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Menu from './Menu';

describe('Menu', () => {
  it('renders menu items and marks current route as active', () => {
    render(
      <MemoryRouter initialEntries={['/users']}>
        <Menu />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument();

    const customersLink = screen.getByRole('link', { name: 'Customers' });
    const usersLink = screen.getByRole('link', { name: 'Users' });
    const ordersLink = screen.getByRole('link', { name: 'Orders' });

    expect(customersLink).toHaveAttribute('href', '/customer');
    expect(usersLink).toHaveAttribute('href', '/users');
    expect(ordersLink).toHaveAttribute('href', '/orders');

    expect(usersLink).toHaveStyle({ fontWeight: 'bold' });
    expect(customersLink).toHaveStyle({ fontWeight: 'normal' });
    expect(ordersLink).toHaveStyle({ fontWeight: 'normal' });
  });

  it('keeps all links in non-active style when no route matches', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <Menu />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Customers' })).toHaveStyle({ fontWeight: 'normal' });
    expect(screen.getByRole('link', { name: 'Users' })).toHaveStyle({ fontWeight: 'normal' });
    expect(screen.getByRole('link', { name: 'Orders' })).toHaveStyle({ fontWeight: 'normal' });
  });
});
