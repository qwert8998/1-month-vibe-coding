import type { User } from '../domain/User';
import { API_BASE_URL } from '../../../config/apiConfig';
import { getAuthHeaders } from '../../../config/authHeader';
import { validateSafeTextInput } from '../../shared/sql-input-validation';

export async function createUser(user: Omit<User, 'userId'>): Promise<void> {
  const textValidationErrors = [
    validateSafeTextInput(user.userName, 'User name'),
    validateSafeTextInput(user.lastName ?? '', 'Last name'),
    validateSafeTextInput(user.passwordHash ?? '', 'Password hash'),
    validateSafeTextInput(user.email ?? '', 'Email'),
  ].filter((error): error is string => Boolean(error));

  if (textValidationErrors.length > 0) {
    throw new Error(textValidationErrors[0]);
  }

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
