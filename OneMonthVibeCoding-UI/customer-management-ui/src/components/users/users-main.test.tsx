import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchAllUsers } from './api/user-list';
import UsersMain from './users-main';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('./api/user-list', () => ({
  fetchAllUsers: vi.fn(),
}));

const createTestClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderUsersMain = () => {
  const queryClient = createTestClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <UsersMain />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('UsersMain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state while users are being fetched', () => {
    vi.mocked(fetchAllUsers).mockReturnValue(new Promise(() => {}));

    renderUsersMain();

    expect(screen.getByText('Loading users...')).toBeInTheDocument();
  });

  it('renders users and navigates to create page on button click', async () => {
    vi.mocked(fetchAllUsers).mockResolvedValue([
      {
        userId: 1,
        userName: 'alice',
        lastName: 'smith',
        dateOfBirth: '2000-01-01',
        isActive: true,
        email: 'alice@example.com',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]);

    renderUsersMain();

    expect(await screen.findByRole('heading', { name: 'Users' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '1' })).toHaveAttribute('href', '/users/1');
    expect(screen.getByText('alice')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Create User' }));

    expect(mockNavigate).toHaveBeenCalledWith('/users/create');
  });

  it('shows error state when fetching users fails', async () => {
    vi.mocked(fetchAllUsers).mockRejectedValue(new Error('users failed'));

    renderUsersMain();

    expect(await screen.findByText('Error: users failed')).toBeInTheDocument();
  });
});
