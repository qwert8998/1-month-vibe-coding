import type { Customer } from '../../customers/domain/Customer';

export interface Order {
  orderId: number;
  clientId: number;
  totalCost: number;
  createBy: string;
  createDate: string;
  deliveryDate: string;
  canceled: boolean;
  refund: boolean;
  refundCost: number;
  updateBy: string;
  updateDate: string;
  isDeleted?: boolean;
  client?: Customer;
}
