import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { login } from './api';
import LoginPage from './LoginPage';

vi.mock('./api', () => ({
  login: vi.fn(),
}));

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

const getInputNextToLabel = (labelText: string) => {
  const label = screen.getByText(labelText);
  const input = label.parentElement?.querySelector('input');

  if (!input) {
    throw new Error(`Input not found for label: ${labelText}`);
  }

  return input as HTMLInputElement;
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', localStorageMock);
  });

  it('shows loading state while login request is in progress', async () => {
    vi.mocked(login).mockReturnValue(new Promise(() => {}));

    render(<LoginPage />);

    await userEvent.type(getInputNextToLabel('Username'), 'john');
    await userEvent.type(getInputNextToLabel('Password'), 'secret');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByRole('button', { name: 'Logging in...' })).toBeDisabled();
  });

  it('stores auth token and redirects on successful login', async () => {
    vi.mocked(login).mockResolvedValue({
      status: 'success',
      token: 'token-123',
    });

    render(<LoginPage />);

    await userEvent.type(getInputNextToLabel('Username'), 'john');
    await userEvent.type(getInputNextToLabel('Password'), 'secret');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('john', 'secret');
    });

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('authToken', 'token-123');
    });
  });

  it('shows error and clears password when login fails', async () => {
    vi.mocked(login).mockRejectedValue(new Error('Login failed'));

    render(<LoginPage />);

    const passwordInput = getInputNextToLabel('Password');

    await userEvent.type(getInputNextToLabel('Username'), 'john');
    await userEvent.type(passwordInput, 'secret');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Login failed, please try again')).toBeInTheDocument();
    expect(passwordInput.value).toBe('');
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });
});
