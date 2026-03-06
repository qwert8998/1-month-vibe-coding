import { API_BASE_URL } from '../../../config/apiConfig';
import { getAuthHeaders } from '../../../config/authHeader';
import {
  validateNonNegativeNumber,
  validatePositiveInteger,
  validateSafeTextInput,
} from '../../shared/sql-input-validation';

export interface RefundOrderPayload {
  refundCost: number;
  updateBy: string;
}

export async function refundOrder(orderId: number, payload: RefundOrderPayload): Promise<void> {
  validatePositiveInteger(orderId, 'Order ID');
  validateNonNegativeNumber(payload.refundCost, 'Refund cost');

  const updateByError = validateSafeTextInput(payload.updateBy, 'Updated by');
  if (updateByError) {
    throw new Error(updateByError);
  }

  const headers = getAuthHeaders();
  const params = new URLSearchParams({
    refundCost: String(payload.refundCost),
    updateBy: payload.updateBy,
  });
  const response = await fetch(`${API_BASE_URL}api/Order/${orderId}/refund?${params.toString()}`, {
    method: 'POST',
    headers: {
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to submit refund');
  }
}
