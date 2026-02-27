import type { User } from '../domain/User';
import { API_BASE_URL } from '../../../config/apiConfig';
import { getAuthHeaders } from '../../../config/authHeader';

export async function fetchAllUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}users/all-users`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}
