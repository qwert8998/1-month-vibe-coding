import type { User } from '../domain/User';
import { API_BASE_URL } from '../../../config/apiConfig';
import { getAuthHeaders } from '../../../config/authHeader';

export async function createUser(user: Omit<User, 'userId'>): Promise<void> {
  const response = await fetch(`${API_BASE_URL}users/creation`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Failed to create user');
  // If response is empty, just return
  return;
}
