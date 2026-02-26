import type { Customer } from '../domain/Customer';
import { API_BASE_URL } from '../../../config/apiConfig';
import { getAuthHeaders } from '../../../config/authHeader';


export async function createCustomer(customer: Customer) {
const headers = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}client/create-client`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(customer),
  });
  if (!response.ok) {
    throw new Error('Failed to create customer');
  }
  // No content expected on success
}