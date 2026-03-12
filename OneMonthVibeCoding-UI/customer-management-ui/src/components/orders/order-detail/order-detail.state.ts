import type { ReactNode } from 'react';
import type { Order } from '../domain/Order';

export interface RefundModalState {
  modalOpen: boolean;
  refundCost: string;
  inputError: string;
  submitError: string;
  isSubmitting: boolean;
}

export interface OrderDetailTableRow {
  label: string;
  value: ReactNode;
}

export const INITIAL_REFUND_MODAL_STATE: RefundModalState = {
  modalOpen: false,
  refundCost: '',
  inputError: '',
  submitError: '',
  isSubmitting: false,
};

export const buildOrderDetailTableRows = (order: Order): OrderDetailTableRow[] => [
  { label: 'OrderId', value: order.orderId },
  { label: 'Client Name', value: order.client?.clientFirstName },
  { label: 'Total Cost', value: order.totalCost },
  { label: 'Create By', value: order.createBy },
  { label: 'Create Date', value: order.createDate },
  { label: 'Delivery Date', value: order.deliveryDate },
  { label: 'Canceled', value: order.canceled ? 'Yes' : 'No' },
  { label: 'Refund', value: order.refund ? 'Yes' : 'No' },
  { label: 'Refund Cost', value: order.refundCost },
  { label: 'Update By', value: order.updateBy },
  { label: 'Update Date', value: order.updateDate },
  { label: 'Is Deleted', value: order.isDeleted ? 'Yes' : 'No' },
];
