export interface CreateOrderFormState {
  clientId: string;
  totalCost: string;
  deliveryDate: string;
  canceled: boolean;
  refund: boolean;
  refundCost: string;
  isDeleted: boolean;
}

export interface CreateOrderValidationErrors {
  clientId?: string;
  totalCost?: string;
  deliveryDate?: string;
}

export interface CreateOrderRequestState {
  errors: CreateOrderValidationErrors;
  submitError: string;
  isSubmitting: boolean;
}

const getDefaultDeliveryDate = () => {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  return deliveryDate.toISOString().slice(0, 16);
};

export const createInitialOrderFormState = (): CreateOrderFormState => ({
  clientId: '',
  totalCost: '',
  deliveryDate: getDefaultDeliveryDate(),
  canceled: false,
  refund: false,
  refundCost: '0',
  isDeleted: false,
});

export const INITIAL_CREATE_ORDER_REQUEST_STATE: CreateOrderRequestState = {
  errors: {},
  submitError: '',
  isSubmitting: false,
};
