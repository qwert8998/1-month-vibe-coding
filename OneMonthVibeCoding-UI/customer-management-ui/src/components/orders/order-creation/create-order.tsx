import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../customers/api/customer-list';
import { createOrder } from '../api/create-order';
import type { Customer } from '../../customers/domain/Customer';
import {
  createInitialOrderFormState,
  INITIAL_CREATE_ORDER_REQUEST_STATE,
  type CreateOrderFormState,
  type CreateOrderRequestState,
  type CreateOrderValidationErrors,
} from './create-order.state';
import { parseStrictPositiveInteger } from '../../shared/sql-input-validation';
import { ROUTES } from '../../../config/routes';

const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: customers, isLoading: customersLoading } = useCustomers();

  const [formState, setFormState] = useState<CreateOrderFormState>(createInitialOrderFormState);
  const [requestState, setRequestState] = useState<CreateOrderRequestState>(INITIAL_CREATE_ORDER_REQUEST_STATE);

  const { clientId, totalCost, deliveryDate, canceled, refund, refundCost, isDeleted } = formState;
  const { errors, submitError, isSubmitting } = requestState;

  const updateFormState = <K extends keyof CreateOrderFormState>(field: K, value: CreateOrderFormState[K]) => {
    setFormState(previousState => ({
      ...previousState,
      [field]: value,
    }));
  };

  const updateRequestState = (updates: Partial<CreateOrderRequestState>) => {
    setRequestState(previousState => ({
      ...previousState,
      ...updates,
    }));
  };

  const validate = (state: CreateOrderFormState): CreateOrderValidationErrors => {
    const newErrors: CreateOrderValidationErrors = {};

    if (!state.clientId) newErrors.clientId = 'Please select a client.';
    if (state.clientId) {
      try {
        parseStrictPositiveInteger(state.clientId, 'Client ID');
      } catch {
        newErrors.clientId = 'Invalid client id.';
      }
    }

    const cost = Number(state.totalCost);
    if (!state.totalCost || isNaN(cost) || cost <= 0) newErrors.totalCost = 'Total cost must be greater than 0.';
    if (!state.deliveryDate) newErrors.deliveryDate = 'Delivery date is required.';

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate(formState);
    if (Object.keys(newErrors).length > 0) {
      updateRequestState({ errors: newErrors });
      return;
    }

    updateRequestState({ errors: {}, submitError: '', isSubmitting: true });

    try {
      const parsedClientId = parseStrictPositiveInteger(clientId, 'Client ID');
      await createOrder({
        clientId: parsedClientId,
        totalCost: Number(totalCost),
        createBy: 'system',
        createDate: new Date().toISOString(),
        deliveryDate: new Date(deliveryDate).toISOString(),
        canceled,
        refund,
        refundCost: Number(refundCost),
        updateBy: null,
        updateDate: null,
        isDeleted,
      });
      navigate(ROUTES.ORDER_LIST);
    } catch (err: unknown) {
      updateRequestState({ submitError: err instanceof Error ? err.message : 'Failed to create order' });
    } finally {
      updateRequestState({ isSubmitting: false });
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 24 }}>
      <h2>Create Order</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Client *</label>
          {customersLoading ? (
            <div>Loading clients...</div>
          ) : (
            <select
              value={clientId}
              onChange={e => updateFormState('clientId', e.target.value)}
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: 4 }}
            >
              <option value="">-- Select a client --</option>
              {(customers ?? []).map((c: Customer) => (
                <option key={c.clientId} value={c.clientId}>
                  {c.clientFirstName} {c.clientLastName}
                </option>
              ))}
            </select>
          )}
          {errors.clientId && <div style={{ color: 'red', fontSize: '0.875rem' }}>{errors.clientId}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Total Cost *</label>
          <input
            type="number"
            min={1}
            value={totalCost}
            onChange={e => updateFormState('totalCost', e.target.value)}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: 4 }}
          />
          {errors.totalCost && <div style={{ color: 'red', fontSize: '0.875rem' }}>{errors.totalCost}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Delivery Date *</label>
          <input
            type="datetime-local"
            value={deliveryDate}
            onChange={e => updateFormState('deliveryDate', e.target.value)}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: 4 }}
          />
          {errors.deliveryDate && <div style={{ color: 'red', fontSize: '0.875rem' }}>{errors.deliveryDate}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            <input type="checkbox" checked={canceled} onChange={e => updateFormState('canceled', e.target.checked)} />
            {' '}Canceled
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            <input type="checkbox" checked={refund} onChange={e => updateFormState('refund', e.target.checked)} />
            {' '}Refund
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Refund Cost</label>
          <input
            type="number"
            min={0}
            value={refundCost}
            onChange={e => updateFormState('refundCost', e.target.value)}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            <input type="checkbox" checked={isDeleted} onChange={e => updateFormState('isDeleted', e.target.checked)} />
            {' '}Is Deleted
          </label>
        </div>

        {submitError && <div style={{ color: 'red', marginBottom: 12, fontSize: '0.875rem' }}>{submitError}</div>}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ marginTop: 16, padding: '10px 24px', fontSize: '16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default CreateOrderPage;
