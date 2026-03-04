import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCustomerDetail } from '../api';
import CustomerDetail from './customer-detail';

vi.mock('../api', () => ({
  useCustomerDetail: vi.fn(),
}));

const renderCustomerDetail = (path = '/customer/7') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/customer/:id" element={<CustomerDetail />} />
        <Route path="/customer" element={<CustomerDetail />} />
      </Routes>
    </MemoryRouter>,
  );

describe('CustomerDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state while fetching customer detail', () => {
    vi.mocked(useCustomerDetail).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useCustomerDetail>);

    renderCustomerDetail();

    expect(screen.getByText('Loading customer...')).toBeInTheDocument();
  });

  it('shows error state when customer detail fetch fails', () => {
    vi.mocked(useCustomerDetail).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('detail failed'),
    } as ReturnType<typeof useCustomerDetail>);

    renderCustomerDetail();

    expect(screen.getByText('Error: detail failed')).toBeInTheDocument();
  });

  it('renders customer detail when data is returned', () => {
    vi.mocked(useCustomerDetail).mockReturnValue({
      data: {
        clientId: 7,
        clientFirstName: 'Jane',
        clientLastName: 'Doe',
        prefferName: 'JD',
        dateofBirth: '1990-01-01',
        createBy: 'system',
        createDate: '2024-01-01T00:00:00.000Z',
        updateBy: 'system',
        updateDate: '2024-02-01T00:00:00.000Z',
        isDeleted: false,
      },
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCustomerDetail>);

    renderCustomerDetail();

    expect(screen.getByRole('heading', { name: 'Customer Detail' })).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Customer List' })).toHaveAttribute('href', '/customer');
  });

  it('uses fallback id when route param is missing', () => {
    vi.mocked(useCustomerDetail).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useCustomerDetail>);

    renderCustomerDetail('/customer');

    expect(useCustomerDetail).toHaveBeenCalledWith('1');
  });
});
