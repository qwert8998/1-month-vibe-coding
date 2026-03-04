import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createCustomer } from '../api/create-customer';
import CreateCustomerPage from './create-customer';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../api/create-customer', () => ({
  createCustomer: vi.fn(),
}));

const getInputNextToLabel = (labelText: string) => {
  const label = screen.getByText(labelText);
  const input = label.parentElement?.querySelector('input');

  if (!input) {
    throw new Error(`Input not found for label: ${labelText}`);
  }

  return input as HTMLInputElement;
};

describe('CreateCustomerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows validation errors for empty required fields', async () => {
    render(
      <MemoryRouter>
        <CreateCustomerPage />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Last name is required')).toBeInTheDocument();
    expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
    expect(createCustomer).not.toHaveBeenCalled();
  });

  it('creates customer and navigates to customer list on success', async () => {
    vi.mocked(createCustomer).mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <CreateCustomerPage />
      </MemoryRouter>,
    );

    await userEvent.type(getInputNextToLabel('First Name *'), 'Jane');
    await userEvent.type(getInputNextToLabel('Last Name *'), 'Doe');
    await userEvent.type(getInputNextToLabel('Preferred Name'), 'JD');
    await userEvent.type(getInputNextToLabel('Date of Birth *'), '1990-01-01');

    await userEvent.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(createCustomer).toHaveBeenCalledTimes(1);
    });

    expect(vi.mocked(createCustomer).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        clientId: 0,
        clientFirstName: 'Jane',
        clientLastName: 'Doe',
        prefferName: 'JD',
        dateofBirth: '1990-01-01',
        createBy: 'system',
        updateBy: 'system',
        isDeleted: false,
      }),
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/customer');
    });
  });

  it('shows submit error when create customer fails', async () => {
    vi.mocked(createCustomer).mockRejectedValue(new Error('create customer failed'));

    render(
      <MemoryRouter>
        <CreateCustomerPage />
      </MemoryRouter>,
    );

    await userEvent.type(getInputNextToLabel('First Name *'), 'Jane');
    await userEvent.type(getInputNextToLabel('Last Name *'), 'Doe');
    await userEvent.type(getInputNextToLabel('Date of Birth *'), '1990-01-01');

    await userEvent.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Failed to create customer')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
