import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../../../config/apiConfig';
import { getAuthHeaders } from '../../../config/authHeader';
import type { Order } from '../domain/Order';

const getOrderById = async (id: string): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}api/Order/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch order detail');
  }

  return response.json();
};

export const useOrderDetailById = (id: string) => {
  return useQuery<Order, Error>({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
    retry: 1,
  });
};
