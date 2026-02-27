import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../../../config/apiConfig';
import { getAuthHeaders } from '../../../config/authHeader';
import type { Order } from '../domain/Order';

const getOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_BASE_URL}api/Order`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json();
};

export const useOrderList = () => {
  return useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: getOrders,
    retry: 1,
  });
};
