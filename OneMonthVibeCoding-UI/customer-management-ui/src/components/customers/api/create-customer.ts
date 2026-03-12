import type { Customer } from '../domain/Customer';
import { API_BASE_URL } from '../../../config/apiConfig';
import { getAuthHeaders } from '../../../config/authHeader';
import { validateSafeTextInput } from '../../shared/sql-input-validation';


export async function createCustomer(customer: Customer) {
  const firstNameError = validateSafeTextInput(customer.clientFirstName, 'First name');
  const lastNameError = validateSafeTextInput(customer.clientLastName, 'Last name');
  const preferredNameError = validateSafeTextInput(customer.prefferName ?? '', 'Preferred name');

  if (firstNameError) {
    throw new Error(firstNameError);
  }
  if (lastNameError) {
    throw new Error(lastNameError);
  }
  if (preferredNameError) {
    throw new Error(preferredNameError);
  }

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