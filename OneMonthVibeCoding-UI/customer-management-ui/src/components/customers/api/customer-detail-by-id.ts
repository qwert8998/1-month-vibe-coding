import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../../../config/apiConfig';
import { getAuthHeaders } from '../../../config/authHeader';
import type { Customer } from '../domain/Customer';
import { parseStrictPositiveInteger } from '../../shared/sql-input-validation';

const getCustomerById = async (id: string): Promise<Customer> => {
  const clientId = parseStrictPositiveInteger(id, 'Customer ID');
  const headers = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}client/${clientId}`, {
    headers,
  });
  if (!response.ok) {
    throw new Error('Failed to fetch customer detail');
  }
  return response.json();
};

export const useCustomerDetail = (id: string) => {
  return useQuery<Customer, Error>({
    queryKey: ['customer', id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
    retry: 1,
  });
};
