import type { User } from '../domain/User';
import { API_BASE_URL } from '../../../config/apiConfig';
import { getAuthHeaders } from '../../../config/authHeader';
import { validatePositiveInteger } from '../../shared/sql-input-validation';

export async function fetchUserById(userId: number): Promise<User> {
  validatePositiveInteger(userId, 'User ID');
  const response = await fetch(`${API_BASE_URL}users/user-detail?userId=${userId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch user detail');
  return response.json();
}
