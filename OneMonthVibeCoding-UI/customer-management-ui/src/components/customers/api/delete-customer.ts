import { API_BASE_URL } from '../../../config/apiConfig';
import { getAuthHeaders } from '../../../config/authHeader';

export const deleteCustomer = async (clientId: number): Promise<boolean> => {
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
