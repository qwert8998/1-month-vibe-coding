import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useOrderDetailById } from '../api/order-detail-by-id';
import { refundOrder } from '../api/refund-order';
import OrderDetail from './order-detail';

vi.mock('../api/order-detail-by-id', () => ({
  useOrderDetailById: vi.fn(),
}));

vi.mock('../api/refund-order', () => ({
  refundOrder: vi.fn(),
}));

const renderOrderDetail = (path = '/orders/7') => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

  const view = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/orders/:orderId" element={<OrderDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

  return { ...view, invalidateSpy };
};

describe('OrderDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state while fetching order detail', () => {
    vi.mocked(useOrderDetailById).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useOrderDetailById>);

    renderOrderDetail();

    expect(screen.getByText('Loading order detail...')).toBeInTheDocument();
  });

  it('shows error state when order detail fetch fails', () => {
    vi.mocked(useOrderDetailById).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('detail failed'),
    } as ReturnType<typeof useOrderDetailById>);

    renderOrderDetail();

    expect(screen.getByText('Error: detail failed')).toBeInTheDocument();
  });

  it('shows no order found when data is empty', () => {
    vi.mocked(useOrderDetailById).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useOrderDetailById>);

    renderOrderDetail();

    expect(screen.getByText('No order found.')).toBeInTheDocument();
  });

  it('renders order details and submits refund successfully', async () => {
    vi.mocked(useOrderDetailById).mockReturnValue({
      data: {
        orderId: 7,
        clientId: 1,
        totalCost: 120,
        createBy: 'system',
        createDate: '2024-01-01T00:00:00.000Z',
        deliveryDate: '2024-01-04T00:00:00.000Z',
        canceled: false,
        refund: false,
        refundCost: 0,
        updateBy: 'system',
        updateDate: '2024-01-02T00:00:00.000Z',
        isDeleted: false,
        client: {
          clientId: 1,
          clientFirstName: 'Alice',
          clientLastName: 'Smith',
          prefferName: 'Al',
          dateofBirth: '1990-01-01',
          createBy: 'system',
          createDate: '2024-01-01T00:00:00.000Z',
          updateBy: 'system',
          updateDate: '2024-01-01T00:00:00.000Z',
          isDeleted: false,
        },
      },
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useOrderDetailById>);

    vi.mocked(refundOrder).mockResolvedValue(undefined);

    const { invalidateSpy } = renderOrderDetail('/orders/7');

    expect(screen.getByRole('heading', { name: 'Order Detail' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Refund' }));
    await userEvent.type(screen.getByLabelText('Refund Amount'), '50');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(refundOrder).toHaveBeenCalledWith(7, { refundCost: 50, updateBy: 'system' });
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['order', '7'] });
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Submit Refund' })).not.toBeInTheDocument();
    });
  });

  it('shows input validation message for invalid refund amount', async () => {
    vi.mocked(useOrderDetailById).mockReturnValue({
      data: {
        orderId: 7,
        clientId: 1,
        totalCost: 120,
        createBy: 'system',
        createDate: '2024-01-01T00:00:00.000Z',
        deliveryDate: '2024-01-04T00:00:00.000Z',
        canceled: false,
        refund: false,
        refundCost: 0,
        updateBy: 'system',
        updateDate: '2024-01-02T00:00:00.000Z',
        isDeleted: false,
      },
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useOrderDetailById>);

    renderOrderDetail('/orders/7');

    await userEvent.click(screen.getByRole('button', { name: 'Refund' }));
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Please enter a number greater than 0.')).toBeInTheDocument();
    expect(refundOrder).not.toHaveBeenCalled();
  });

  it('shows submit error when refund request fails', async () => {
    vi.mocked(useOrderDetailById).mockReturnValue({
      data: {
        orderId: 7,
        clientId: 1,
        totalCost: 120,
        createBy: 'system',
        createDate: '2024-01-01T00:00:00.000Z',
        deliveryDate: '2024-01-04T00:00:00.000Z',
        canceled: false,
        refund: false,
        refundCost: 0,
        updateBy: 'system',
        updateDate: '2024-01-02T00:00:00.000Z',
        isDeleted: false,
      },
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useOrderDetailById>);

    vi.mocked(refundOrder).mockRejectedValue(new Error('refund failed'));

    renderOrderDetail('/orders/7');

    await userEvent.click(screen.getByRole('button', { name: 'Refund' }));
    await userEvent.type(screen.getByLabelText('Refund Amount'), '10');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('refund failed')).toBeInTheDocument();
  });
});
