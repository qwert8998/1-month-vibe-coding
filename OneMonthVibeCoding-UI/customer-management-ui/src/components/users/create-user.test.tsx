import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createUser } from './api/create-user';
import CreateUser from './create-user';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('./api/create-user', () => ({
  createUser: vi.fn(),
}));

const createTestClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderCreateUser = () => {
  const queryClient = createTestClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

const getInputNextToLabel = (labelText: string) => {
  const label = screen.getByText(labelText);
  const input = label.parentElement?.querySelector('input');

  if (!input) {
    throw new Error(`Input not found for label: ${labelText}`);
  }

  return input as HTMLInputElement;
};

describe('CreateUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits form and navigates to users list on success', async () => {
    vi.mocked(createUser).mockResolvedValue(undefined);

    renderCreateUser();

    await userEvent.type(getInputNextToLabel('UserName:'), 'alice');
    await userEvent.type(getInputNextToLabel('Date of Birth:'), '2000-01-01');
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(createUser).toHaveBeenCalledTimes(1);
    });

    const submittedPayload = vi.mocked(createUser).mock.calls[0][0];
    expect(submittedPayload).toEqual(
      expect.objectContaining({
        userName: 'alice',
        dateOfBirth: '2000-01-01',
        isActive: true,
      }),
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/users');
    });
  });

  it('shows error message when create user fails', async () => {
    vi.mocked(createUser).mockRejectedValue(new Error('create failed'));

    renderCreateUser();

    await userEvent.type(getInputNextToLabel('UserName:'), 'alice');
    await userEvent.type(getInputNextToLabel('Date of Birth:'), '2000-01-01');
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Error: create failed')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('disables submit button while mutation is pending', async () => {
    vi.mocked(createUser).mockReturnValue(new Promise(() => {}));

    renderCreateUser();

    await userEvent.type(getInputNextToLabel('UserName:'), 'alice');
    await userEvent.type(getInputNextToLabel('Date of Birth:'), '2000-01-01');

    const submitButton = screen.getByRole('button', { name: 'Create' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
