import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../../../config/apiConfig';
import type { Customer } from '../domain/Customer';

const getCustomers = async (): Promise<Customer[]> => {
  const response = await fetch(`${API_BASE_URL}client/get-clients`);
  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }
  return response.json();
};

export const useCustomers = () => {
  return useQuery<Customer[], Error>({
    queryKey: ['customers'],
    queryFn: getCustomers,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 1,
  });
};
