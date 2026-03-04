import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCustomers } from '../../customers/api/customer-list';
import type { Customer } from '../../customers/domain/Customer';
import { createOrder } from '../api/create-order';
import CreateOrderPage from './create-order';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../customers/api/customer-list', () => ({
  useCustomers: vi.fn(),
}));

vi.mock('../api/create-order', () => ({
  createOrder: vi.fn(),
}));

const getFieldByLabel = <T extends Element>(labelText: string, selector: string) => {
  const label = screen.getByText(labelText);
  const field = label.parentElement?.querySelector(selector);

  if (!field) {
    throw new Error(`Field not found for label: ${labelText}`);
  }

  return field as T;
};

describe('CreateOrderPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows customer loading state while clients are loading', () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useCustomers>);

    render(
      <MemoryRouter>
        <CreateOrderPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Loading clients...')).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: [] as Customer[],
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCustomers>);

    render(
      <MemoryRouter>
        <CreateOrderPage />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please select a client.')).toBeInTheDocument();
    expect(screen.getByText('Total cost must be greater than 0.')).toBeInTheDocument();
    expect(createOrder).not.toHaveBeenCalled();
  });

  it('creates order and navigates to orders list on success', async () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: [
        {
          clientId: 1,
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
    } as ReturnType<typeof useCustomers>);

    vi.mocked(createOrder).mockResolvedValue({
      orderId: 100,
      clientId: 1,
      totalCost: 150,
      createBy: 'system',
      createDate: '2024-01-01T00:00:00.000Z',
      deliveryDate: '2024-01-05T00:00:00.000Z',
      canceled: false,
      refund: false,
      refundCost: 0,
      updateBy: 'system',
      updateDate: '2024-01-01T00:00:00.000Z',
      isDeleted: false,
    });

    render(
      <MemoryRouter>
        <CreateOrderPage />
      </MemoryRouter>,
    );

    await userEvent.selectOptions(getFieldByLabel<HTMLSelectElement>('Client *', 'select'), '1');
    await userEvent.type(getFieldByLabel<HTMLInputElement>('Total Cost *', 'input'), '150');
    fireEvent.change(getFieldByLabel<HTMLInputElement>('Delivery Date *', 'input'), {
      target: { value: '2026-03-08T10:30' },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(createOrder).toHaveBeenCalledTimes(1);
    });

    expect(vi.mocked(createOrder).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        clientId: 1,
        totalCost: 150,
        canceled: false,
        refund: false,
      }),
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/orders');
    });
  });

  it('shows submit error when create order fails', async () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: [
        {
          clientId: 1,
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
    } as ReturnType<typeof useCustomers>);

    vi.mocked(createOrder).mockRejectedValue(new Error('create order failed'));

    render(
      <MemoryRouter>
        <CreateOrderPage />
      </MemoryRouter>,
    );

    await userEvent.selectOptions(getFieldByLabel<HTMLSelectElement>('Client *', 'select'), '1');
    await userEvent.type(getFieldByLabel<HTMLInputElement>('Total Cost *', 'input'), '200');

    await userEvent.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('create order failed')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
