import { API_BASE_URL } from '../../../config/apiConfig';
import { getAuthHeaders } from '../../../config/authHeader';
import type { Order } from '../domain/Order';

export interface CreateOrderPayload {
  clientId: number;
  totalCost: number;
  createBy: string;
  createDate: string;
  deliveryDate: string;
  canceled: boolean;
  refund: boolean;
  refundCost: number;
  updateBy: null | string;
  updateDate: null | string;
  isDeleted: boolean;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const headers = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}api/Order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to create order');
  }
  return response.json();
}
