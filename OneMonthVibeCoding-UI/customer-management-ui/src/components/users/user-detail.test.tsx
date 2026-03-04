import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchUserById } from './api/user-detail-by-id';
import UserDetail from './user-detail';

vi.mock('./api/user-detail-by-id', () => ({
  fetchUserById: vi.fn(),
}));

const createTestClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderUserDetail = (path = '/users/7') => {
  const queryClient = createTestClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/users/:userId" element={<UserDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('UserDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state while fetching user detail', () => {
    vi.mocked(fetchUserById).mockReturnValue(new Promise(() => {}));

    renderUserDetail();

    expect(screen.getByText('Loading user detail...')).toBeInTheDocument();
  });

  it('renders user detail when API returns data', async () => {
    vi.mocked(fetchUserById).mockResolvedValue({
      userId: 7,
      userName: 'john',
      lastName: 'doe',
      dateOfBirth: '1990-03-15',
      isActive: true,
      email: 'john@example.com',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-02-01T00:00:00.000Z',
    });

    renderUserDetail();

    expect(await screen.findByRole('heading', { name: 'User Detail' })).toBeInTheDocument();
    expect(screen.getByText('john')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('shows no user found state when API returns empty data', async () => {
    vi.mocked(fetchUserById).mockResolvedValue(null as unknown as Awaited<ReturnType<typeof fetchUserById>>);

    renderUserDetail();

    expect(await screen.findByText('No user found.')).toBeInTheDocument();
  });

  it('shows error state when user detail fetch fails', async () => {
    vi.mocked(fetchUserById).mockRejectedValue(new Error('detail failed'));

    renderUserDetail();

    expect(await screen.findByText('Error: detail failed')).toBeInTheDocument();
  });
});
