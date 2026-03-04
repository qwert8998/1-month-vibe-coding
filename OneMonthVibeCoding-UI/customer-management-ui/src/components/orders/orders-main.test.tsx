import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useOrderList } from './api/order-list';
import type { Order } from './domain/Order';
import OrdersMain from './orders-main';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('./api/order-list', () => ({
  useOrderList: vi.fn(),
}));

describe('OrdersMain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state while fetching orders', () => {
    vi.mocked(useOrderList).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useOrderList>);

    render(
      <MemoryRouter>
        <OrdersMain />
      </MemoryRouter>,
    );

    expect(screen.getByText('Loading orders...')).toBeInTheDocument();
  });

  it('shows error state when order fetch fails', () => {
    vi.mocked(useOrderList).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('orders failed'),
    } as ReturnType<typeof useOrderList>);

    render(
      <MemoryRouter>
        <OrdersMain />
      </MemoryRouter>,
    );

    expect(screen.getByText('Error: orders failed')).toBeInTheDocument();
  });

  it('shows empty state when no orders are returned', () => {
    vi.mocked(useOrderList).mockReturnValue({
      data: [] as Order[],
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useOrderList>);

    render(
      <MemoryRouter>
        <OrdersMain />
      </MemoryRouter>,
    );

    expect(screen.getByText('No orders found.')).toBeInTheDocument();
  });

  it('renders order rows and navigates to create order', async () => {
    vi.mocked(useOrderList).mockReturnValue({
      data: [
        {
          orderId: 11,
          clientId: 1,
          totalCost: 100,
          createBy: 'system',
          createDate: '2024-01-01T00:00:00.000Z',
          deliveryDate: '2024-01-05T00:00:00.000Z',
          canceled: false,
          refund: false,
          refundCost: 0,
          updateBy: 'system',
          updateDate: '2024-01-02T00:00:00.000Z',
          isDeleted: false,
          client: {
            clientId: 1,
            clientFirstName: 'John',
            clientLastName: 'Doe',
            prefferName: 'JD',
            dateofBirth: '1990-01-01',
            createBy: 'system',
            createDate: '2024-01-01T00:00:00.000Z',
            updateBy: 'system',
            updateDate: '2024-01-01T00:00:00.000Z',
            isDeleted: false,
          },
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useOrderList>);

    render(
      <MemoryRouter>
        <OrdersMain />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Orders' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '11' })).toHaveAttribute('href', '/orders/11');
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Create Order' }));
    expect(mockNavigate).toHaveBeenCalledWith('/orders/create');
  });
});
