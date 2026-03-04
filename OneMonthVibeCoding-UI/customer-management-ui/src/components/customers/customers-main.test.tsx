import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteCustomer, useCustomers } from './api';
import type { Customer } from './domain/Customer';
import CustomersMain from './customers-main';

vi.mock('./api', () => ({
  useCustomers: vi.fn(),
  deleteCustomer: vi.fn(),
}));

describe('CustomersMain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state while customers are loading', () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useCustomers>);

    render(
      <MemoryRouter>
        <CustomersMain />
      </MemoryRouter>,
    );

    expect(screen.getByText('Loading customers...')).toBeInTheDocument();
  });

  it('shows error state when customer fetch fails', () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('customers failed'),
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useCustomers>);

    render(
      <MemoryRouter>
        <CustomersMain />
      </MemoryRouter>,
    );

    expect(screen.getByText('Error: customers failed')).toBeInTheDocument();
  });

  it('renders customers and create link', () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: [
        {
          clientId: 10,
          clientFirstName: 'Jane',
          clientLastName: 'Doe',
          prefferName: 'JD',
          dateofBirth: '1990-01-01',
          createBy: 'system',
          createDate: '2024-01-01T00:00:00.000Z',
          updateBy: 'system',
          updateDate: '2024-01-01T00:00:00.000Z',
          isDeleted: false,
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useCustomers>);

    render(
      <MemoryRouter>
        <CustomersMain />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Customer Details' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Jane' })).toHaveAttribute('href', '/customer/10');
    expect(screen.getByRole('link', { name: 'Create User' })).toHaveAttribute('href', '/customer/create');
  });

  it('shows delete error when delete API returns false', async () => {
    const refetch = vi.fn();

    vi.mocked(useCustomers).mockReturnValue({
      data: [
        {
          clientId: 10,
          clientFirstName: 'Jane',
          clientLastName: 'Doe',
          prefferName: 'JD',
          dateofBirth: '1990-01-01',
          createBy: 'system',
          createDate: '2024-01-01T00:00:00.000Z',
          updateBy: 'system',
          updateDate: '2024-01-01T00:00:00.000Z',
          isDeleted: false,
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    } as unknown as ReturnType<typeof useCustomers>);

    vi.mocked(deleteCustomer).mockResolvedValue(false);

    render(
      <MemoryRouter>
        <CustomersMain />
      </MemoryRouter>,
    );

    refetch.mockClear();

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteCustomer).toHaveBeenCalledWith(10);
    expect(await screen.findByText('Failed to delete customer')).toBeInTheDocument();
    expect(refetch).not.toHaveBeenCalled();
  });

  it('refetches when delete succeeds', async () => {
    const refetch = vi.fn();

    vi.mocked(useCustomers).mockReturnValue({
      data: [
        {
          clientId: 10,
          clientFirstName: 'Jane',
          clientLastName: 'Doe',
          prefferName: 'JD',
          dateofBirth: '1990-01-01',
          createBy: 'system',
          createDate: '2024-01-01T00:00:00.000Z',
          updateBy: 'system',
          updateDate: '2024-01-01T00:00:00.000Z',
          isDeleted: false,
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    } as unknown as ReturnType<typeof useCustomers>);

    vi.mocked(deleteCustomer).mockResolvedValue(true);

    render(
      <MemoryRouter>
        <CustomersMain />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(refetch).toHaveBeenCalled();
    });
  });

  it('handles empty customer list', () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: [] as Customer[],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useCustomers>);

    render(
      <MemoryRouter>
        <CustomersMain />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Customer Details' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Jane' })).not.toBeInTheDocument();
  });
});
