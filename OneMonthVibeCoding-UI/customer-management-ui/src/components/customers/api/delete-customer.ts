import { API_BASE_URL } from '../../../config/apiConfig';
import { getAuthHeaders } from '../../../config/authHeader';
import { validatePositiveInteger } from '../../shared/sql-input-validation';

export const deleteCustomer = async (clientId: number): Promise<boolean> => {
  validatePositiveInteger(clientId, 'Customer ID');
  const headers = getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}client/${clientId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to delete customer');
  }

  return response.json();
};
